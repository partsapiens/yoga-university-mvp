import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

interface QueryFilters {
  family?: string[];
  intensity?: number[];
  search?: string;
  favorites?: string[];
  page?: number;
  limit?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const {
        family,
        intensity,
        search,
        favorites,
        page = 1,
        limit = 20
      } = req.query as any;

      // Start building the query
      let query = supabase
        .from('poses')
        .select('*', { count: 'exact' });

      // Apply family filter
      if (family) {
        const familyArray = Array.isArray(family) ? family : [family];
        query = query.in('family_id', familyArray);
      }

      // Apply intensity filter
      if (intensity) {
        const intensityArray = Array.isArray(intensity) ? intensity.map(Number) : [Number(intensity)];
        query = query.in('intensity', intensityArray);
      }

      // Apply search filter
      if (search) {
        query = query.or(`name_en.ilike.%${search}%,name_sanskrit.ilike.%${search}%,family_id.ilike.%${search}%`);
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

      query = query.range(from, to).order('name_en');

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