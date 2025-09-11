import { NextResponse } from 'next/server';
import { hybridSearch, createManualSearchText } from '@/lib/embeddings';
import Fuse from 'fuse.js';

export const dynamic = 'force-dynamic';

interface ManualItem {
  slug: string;
  title: string;
  summary: string;
  content: string;
  group: string;
}

// Load manual search index from public directory
async function loadManualData(): Promise<ManualItem[]> {
  try {
    // In production, we'd read from public/manual/search-index.json
    // For now, we'll create sample data that matches the existing structure
    const sampleData: ManualItem[] = [
      {
        slug: 'intention-setting',
        title: 'Setting Your Intention',
        summary: 'Learn how to set meaningful intentions for your yoga practice',
        content: 'Setting an intention for your practice helps focus your mind and create purpose in your movements. An intention can be as simple as dedicating your practice to gratitude or as specific as working on balance and strength.',
        group: 'Philosophy'
      },
      {
        slug: 'breathing-basics',
        title: 'Fundamentals of Yogic Breathing',
        summary: 'Master the essential breathing techniques for yoga practice',
        content: 'Proper breathing is the foundation of yoga practice. Learn about ujjayi breath, three-part breathing, and how to coordinate breath with movement for a more mindful practice.',
        group: 'Breathing'
      },
      {
        slug: 'anatomy-spine',
        title: 'Understanding Your Spine',
        summary: 'Explore spinal anatomy and its role in yoga poses',
        content: 'The spine has natural curves that support healthy posture and movement. Understanding these curves helps you practice safely and effectively, maintaining length and stability in poses.',
        group: 'Anatomy'
      },
      {
        slug: 'meditation-introduction',
        title: 'Introduction to Meditation',
        summary: 'Begin your meditation journey with simple techniques',
        content: 'Meditation is an essential component of yoga that cultivates awareness and inner peace. Start with simple techniques like breath awareness and gradually develop your practice.',
        group: 'Meditation'
      },
      {
        slug: 'sun-salutation-guide',
        title: 'Sun Salutation Sequence',
        summary: 'Step-by-step guide to the classic sun salutation',
        content: 'Sun Salutations (Surya Namaskara) are flowing sequences that warm the body and connect breath with movement. Learn the traditional sequence and variations for different levels.',
        group: 'Sequences'
      }
    ];

    // Try to load actual data from search index if available
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/manual/search-index.json`);
      if (response.ok) {
        const data = await response.json();
        return data as ManualItem[];
      }
    } catch (error) {
      console.log('Could not load manual search index, using sample data');
    }

    return sampleData;
  } catch (error) {
    console.error('Error loading manual data:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const group = searchParams.get('group');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Load manual data
    const manualData = await loadManualData();

    if (manualData.length === 0) {
      return NextResponse.json({ results: [], message: 'No manual content available' });
    }

    // Filter by group if specified
    let filteredData = manualData;
    if (group && group !== 'all') {
      filteredData = manualData.filter(item => item.group === group);
    }

    // Fuzzy search fallback function using Fuse.js
    const fuzzySearchFn = (searchQuery: string, items: ManualItem[]) => {
      const fuse = new Fuse(items, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'summary', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'group', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
      });

      return fuse.search(searchQuery).map(result => result.item);
    };

    // Perform hybrid search (semantic + fuzzy)
    const searchResults = await hybridSearch(query, filteredData, {
      textExtractor: createManualSearchText,
      idExtractor: (item) => item.slug,
      semanticWeight: 0.7,
      fuzzySearchFn,
      limit
    });

    // Calculate reading time for each result
    const getReadingTime = (content: string) => {
      return Math.ceil(content.split(' ').length / 200);
    };

    // Transform results for frontend
    const results = searchResults.map(result => ({
      ...result.item,
      searchScore: result.score,
      searchSource: result.source,
      readingTime: getReadingTime(result.item.content),
      // Add highlighting metadata for UI
      relevance: result.score > 0.8 ? 'high' : result.score > 0.6 ? 'medium' : 'low'
    }));

    return NextResponse.json({
      results,
      query,
      group: group || 'all',
      totalResults: results.length,
      message: results.length > 0 
        ? `Found ${results.length} articles matching "${query}"` 
        : `No articles found matching "${query}"`
    });

  } catch (error) {
    console.error('Error in manual search:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to search manual content' },
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

    // Load manual data
    const allManualData = await loadManualData();

    // Apply filters
    let filteredData = allManualData;

    if (filters.groups && filters.groups.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.groups.includes(item.group)
      );
    }

    // Fuzzy search fallback function
    const fuzzySearchFn = (searchQuery: string, items: ManualItem[]) => {
      const fuse = new Fuse(items, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'summary', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'group', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
      });

      return fuse.search(searchQuery).map(result => result.item);
    };

    // Perform hybrid search on filtered data
    const searchResults = await hybridSearch(query, filteredData, {
      textExtractor: createManualSearchText,
      idExtractor: (item) => item.slug,
      semanticWeight: 0.7,
      fuzzySearchFn,
      limit
    });

    // Calculate reading time for each result
    const getReadingTime = (content: string) => {
      return Math.ceil(content.split(' ').length / 200);
    };

    // Transform results for frontend
    const results = searchResults.map(result => ({
      ...result.item,
      searchScore: result.score,
      searchSource: result.source,
      readingTime: getReadingTime(result.item.content),
      relevance: result.score > 0.8 ? 'high' : result.score > 0.6 ? 'medium' : 'low'
    }));

    // Get unique groups for response metadata
    const availableGroups = Array.from(new Set(allManualData.map(item => item.group)));

    return NextResponse.json({
      results,
      query,
      filters,
      totalResults: results.length,
      filteredFrom: filteredData.length,
      totalManualItems: allManualData.length,
      availableGroups,
      message: results.length > 0 
        ? `Found ${results.length} articles matching "${query}"` 
        : `No articles found matching "${query}" with current filters`
    });

  } catch (error) {
    console.error('Error in manual search POST:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to search manual content' },
      { status: 500 }
    );
  }
}