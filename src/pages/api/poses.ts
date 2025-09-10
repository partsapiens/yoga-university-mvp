import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('poses')
        .select('*')
        .order('name_en');
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch poses' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}