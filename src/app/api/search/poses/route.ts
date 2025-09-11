import { NextResponse } from 'next/server';
import { getPosesFromDatabase } from '@/lib/database';
import { hybridSearch, createPoseSearchText } from '@/lib/embeddings';
import Fuse from 'fuse.js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Get all poses from database
    const poses = await getPosesFromDatabase();

    if (poses.length === 0) {
      return NextResponse.json({ results: [], message: 'No poses available' });
    }

    // Fuzzy search fallback function using Fuse.js
    const fuzzySearchFn = (searchQuery: string, items: typeof poses) => {
      const fuse = new Fuse(items, {
        keys: [
          { name: 'name', weight: 0.3 },
          { name: 'sanskrit', weight: 0.2 },
          { name: 'family', weight: 0.2 },
          { name: 'benefits', weight: 0.15 },
          { name: 'anatomical_focus', weight: 0.1 },
          { name: 'instructions', weight: 0.05 }
        ],
        threshold: 0.4,
        includeScore: true,
      });

      return fuse.search(searchQuery).map(result => result.item);
    };

    // Perform hybrid search (semantic + fuzzy)
    const searchResults = await hybridSearch(query, poses, {
      textExtractor: createPoseSearchText,
      idExtractor: (pose) => pose.id,
      semanticWeight: 0.7,
      fuzzySearchFn,
      limit
    });

    // Transform results for frontend
    const results = searchResults.map(result => ({
      ...result.item,
      searchScore: result.score,
      searchSource: result.source,
      // Add additional metadata for UI
      displayName: result.item.name,
      displaySanskrit: result.item.sanskrit || '',
      displayCategory: result.item.family || result.item.category || 'General',
      displayDifficulty: result.item.level || 'beginner',
      displayBenefits: result.item.benefits || [],
      displayImage: result.item.thumbnail_url || result.item.image_url || '/images/poses/default.jpg'
    }));

    return NextResponse.json({
      results,
      query,
      totalResults: results.length,
      message: results.length > 0 
        ? `Found ${results.length} poses matching "${query}"` 
        : `No poses found matching "${query}"`
    });

  } catch (error) {
    console.error('Error in poses search:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to search poses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, filters = {}, limit = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get all poses from database
    const allPoses = await getPosesFromDatabase();

    // Apply filters first
    let filteredPoses = allPoses;

    if (filters.category && filters.category.length > 0) {
      filteredPoses = filteredPoses.filter(pose => 
        filters.category.includes(pose.family || pose.category)
      );
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredPoses = filteredPoses.filter(pose => 
        filters.difficulty.includes(pose.level)
      );
    }

    if (filters.intensity && filters.intensity.length > 0) {
      filteredPoses = filteredPoses.filter(pose => 
        filters.intensity.includes(pose.intensity?.toString())
      );
    }

    if (filters.bodyFocus && filters.bodyFocus.length > 0) {
      filteredPoses = filteredPoses.filter(pose => 
        pose.anatomical_focus?.some(focus => filters.bodyFocus.includes(focus))
      );
    }

    // Fuzzy search fallback function
    const fuzzySearchFn = (searchQuery: string, items: typeof filteredPoses) => {
      const fuse = new Fuse(items, {
        keys: [
          { name: 'name', weight: 0.3 },
          { name: 'sanskrit', weight: 0.2 },
          { name: 'family', weight: 0.2 },
          { name: 'benefits', weight: 0.15 },
          { name: 'anatomical_focus', weight: 0.1 },
          { name: 'instructions', weight: 0.05 }
        ],
        threshold: 0.4,
        includeScore: true,
      });

      return fuse.search(searchQuery).map(result => result.item);
    };

    // Perform hybrid search on filtered poses
    const searchResults = await hybridSearch(query, filteredPoses, {
      textExtractor: createPoseSearchText,
      idExtractor: (pose) => pose.id,
      semanticWeight: 0.7,
      fuzzySearchFn,
      limit
    });

    // Transform results for frontend
    const results = searchResults.map(result => ({
      ...result.item,
      searchScore: result.score,
      searchSource: result.source,
      displayName: result.item.name,
      displaySanskrit: result.item.sanskrit || '',
      displayCategory: result.item.family || result.item.category || 'General',
      displayDifficulty: result.item.level || 'beginner',
      displayBenefits: result.item.benefits || [],
      displayImage: result.item.thumbnail_url || result.item.image_url || '/images/poses/default.jpg'
    }));

    return NextResponse.json({
      results,
      query,
      filters,
      totalResults: results.length,
      filteredFrom: filteredPoses.length,
      totalPoses: allPoses.length,
      message: results.length > 0 
        ? `Found ${results.length} poses matching "${query}"` 
        : `No poses found matching "${query}" with current filters`
    });

  } catch (error) {
    console.error('Error in poses search POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to search poses' },
      { status: 500 }
    );
  }
}