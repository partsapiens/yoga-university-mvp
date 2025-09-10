import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

interface QueryFilters {
  category?: string[];
  energy_level?: string[];
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
        energy_level,
        search,
        favorites,
        page = 1,
        limit = 20
      } = req.query as any;

      // Start building the query
      let query = supabase
        .from('poses')
        .select('*', { count: 'exact' })
        .eq('is_published', true);

      // Apply category filter
      if (category) {
        const categoryArray = Array.isArray(category) ? category : [category];
        query = query.in('category', categoryArray);
      }

      // Apply energy level filter
      if (energy_level) {
        const energyArray = Array.isArray(energy_level) ? energy_level : [energy_level];
        query = query.in('energy_level', energyArray);
      }

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,sanskrit_name.ilike.%${search}%,category.ilike.%${search}%`);
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

      query = query.range(from, to).order('name');

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