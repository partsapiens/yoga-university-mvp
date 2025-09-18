import type { NextApiRequest, NextApiResponse } from 'next';
import { getPosesFromDatabase } from '../../lib/database';

interface QueryFilters {
  category?: string[];
  level?: string[];
  search?: string;
  favorites?: string[];
  page?: number;
  limit?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Add cache headers for better performance
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      
      const {
        category,
        level,
        search,
        favorites,
        page = 1,
        limit = 20
      } = req.query as any;

      // Quick validation
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(100, Math.max(1, Number(limit)));

      // Get all poses using our centralized database function (with fallback)
      const allPoses = await getPosesFromDatabase();
      
      let filteredPoses = [...allPoses];

      // Exclude variations from main library unless searching
      if (!search) {
        filteredPoses = filteredPoses.filter(pose => 
          !pose.name.includes('(Right)') && 
          !pose.name.includes('(Left)') && 
          !pose.name.includes('Right') && 
          !pose.name.includes('Left')
        );
      }

      // Apply category filter
      if (category) {
        const categoryArray = Array.isArray(category) ? category : [category];
        filteredPoses = filteredPoses.filter(pose => 
          pose.category && categoryArray.includes(pose.category)
        );
      }

      // Apply level filter
      if (level) {
        const levelArray = Array.isArray(level) ? level : [level];
        filteredPoses = filteredPoses.filter(pose => 
          pose.level && levelArray.includes(pose.level)
        );
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPoses = filteredPoses.filter(pose => 
          pose.name.toLowerCase().includes(searchLower) ||
          (pose.sanskrit && pose.sanskrit.toLowerCase().includes(searchLower)) ||
          (pose.category && pose.category.toLowerCase().includes(searchLower))
        );
      }

      // Apply favorites filter
      if (favorites) {
        const favArray = Array.isArray(favorites) ? favorites : [favorites];
        filteredPoses = filteredPoses.filter(pose => favArray.includes(pose.id));
      }

      // Sort poses
      filteredPoses.sort((a, b) => {
        // First by sort_order
        if (a.sort_order !== null && b.sort_order !== null) {
          if (a.sort_order !== b.sort_order) {
            return a.sort_order - b.sort_order;
          }
        } else if (a.sort_order !== null) {
          return -1;
        } else if (b.sort_order !== null) {
          return 1;
        }
        
        // Then by name
        return a.name.localeCompare(b.name);
      });

      // Apply pagination
      const totalCount = filteredPoses.length;
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum;
      const paginatedPoses = filteredPoses.slice(from, to);

      // Return data with pagination info
      res.status(200).json({
        data: paginatedPoses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    } catch (error) {
      console.error('Poses API error:', error);
      res.status(500).json({ error: 'Failed to fetch poses' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}