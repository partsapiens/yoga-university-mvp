import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

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
      const {
        category,
        level,
        search,
        favorites,
        page = 1,
        limit = 20
      } = req.query as any;

      // Start building the query
      let query = supabase
        .from('poses')
        .select('*', { count: 'exact' });

      // Exclude variations from main library unless searching
      // Variations are typically poses with (Right), (Left), or similar directional indicators
      if (!search) {
        // Filter out poses that appear to be variations (contain directional indicators)
        query = query.not('name', 'ilike', '%\\(Right\\)%')
                     .not('name', 'ilike', '%\\(Left\\)%')
                     .not('name', 'ilike', '%Right%')
                     .not('name', 'ilike', '%Left%');
      }

      // Apply category filter
      if (category) {
        const categoryArray = Array.isArray(category) ? category : [category];
        query = query.in('category', categoryArray);
      }

      // Apply level filter (changed from energy_level to level)
      if (level) {
        const levelArray = Array.isArray(level) ? level : [level];
        query = query.in('level', levelArray);
      }

      // Apply search filter (using correct field names)
      if (search) {
        query = query.or(`name.ilike.%${search}%,sanskrit.ilike.%${search}%,category.ilike.%${search}%`);
      }

      // Apply favorites filter
      if (favorites) {
        const favArray = Array.isArray(favorites) ? favorites : [favorites];
        query = query.in('id', favArray);
      }

      // Apply pagination
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      query = query.range(from, to)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name');

      const { data, error, count } = await query;
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Return data with pagination info
      res.status(200).json({
        data,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
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