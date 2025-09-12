import { openai, isOpenAIAvailable } from './openai';

export interface EmbeddingResult {
  content: string;
  embedding: number[];
  id: string;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  content: string;
  similarity: number;
  id: string;
  metadata?: Record<string, any>;
}

// Cache for storing embeddings to reduce API calls
const embeddingCache = new Map<string, number[]>();

/**
 * Generate embeddings for text content using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    // Check cache first
    const cacheKey = text.toLowerCase().trim();
    if (embeddingCache.has(cacheKey)) {
      return embeddingCache.get(cacheKey)!;
    }

    if (!isOpenAIAvailable()) {
      console.warn('OpenAI not available for embeddings');
      return null;
    }

    const response = await openai!.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;
    
    // Cache the result
    embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Perform semantic search against a collection of pre-embedded content
 */
export async function semanticSearch(
  query: string,
  embeddedContent: EmbeddingResult[],
  options: {
    limit?: number;
    threshold?: number;
  } = {}
): Promise<SearchResult[]> {
  const { limit = 10, threshold = 0.7 } = options;

  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query);
    
    if (!queryEmbedding) {
      // Fallback to empty results if embedding generation fails
      return [];
    }

    // Calculate similarities
    const results: SearchResult[] = embeddedContent
      .map(item => ({
        content: item.content,
        similarity: cosineSimilarity(queryEmbedding, item.embedding),
        id: item.id,
        metadata: item.metadata,
      }))
      .filter(result => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error('Error in semantic search:', error);
    return [];
  }
}

/**
 * Create searchable text content from pose data
 */
export function createPoseSearchText(pose: any): string {
  const parts = [
    pose.name || '',
    pose.name_en || '',
    pose.sanskrit || pose.name_sanskrit || '',
    pose.family_id || pose.category || pose.family || '',
    ...(pose.benefits || []),
    ...(pose.anatomical_focus || []),
    ...(pose.cues || []),
    pose.instructions || '',
    pose.description || '',
    ...(pose.aka || []),
  ].filter(Boolean);

  return parts.join(' ').toLowerCase();
}

/**
 * Create searchable text content from content data  
 */
export function createContentSearchText(item: any): string {
  const parts = [
    item.title || '',
    item.summary || '',
    item.content || '',
    item.group || '',
  ].filter(Boolean);

  return parts.join(' ').toLowerCase();
}

/**
 * Batch generate embeddings for multiple items
 */
export async function generateBatchEmbeddings<T>(
  items: T[],
  textExtractor: (item: T) => string,
  idExtractor: (item: T) => string
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  for (const item of items) {
    const text = textExtractor(item);
    const id = idExtractor(item);
    
    const embedding = await generateEmbedding(text);
    
    if (embedding) {
      results.push({
        content: text,
        embedding,
        id,
        metadata: item as Record<string, any>,
      });
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Enhanced search that combines semantic and traditional fuzzy search
 */
export async function hybridSearch<T>(
  query: string,
  items: T[],
  options: {
    textExtractor: (item: T) => string;
    idExtractor: (item: T) => string;
    semanticWeight?: number;
    fuzzySearchFn?: (query: string, items: T[]) => T[];
    limit?: number;
  }
): Promise<{ item: T; score: number; source: 'semantic' | 'fuzzy' | 'hybrid' }[]> {
  const {
    textExtractor,
    idExtractor,
    semanticWeight = 0.7,
    fuzzySearchFn,
    limit = 10
  } = options;

  const results = new Map<string, { item: T; score: number; source: 'semantic' | 'fuzzy' | 'hybrid' }>();

  try {
    // Try semantic search first
    const embeddedItems = await generateBatchEmbeddings(items, textExtractor, idExtractor);
    const semanticResults = await semanticSearch(query, embeddedItems, { limit: limit * 2 });

    // Add semantic results
    semanticResults.forEach(result => {
      const item = result.metadata as T;
      const id = idExtractor(item);
      results.set(id, {
        item,
        score: result.similarity * semanticWeight,
        source: 'semantic'
      });
    });

    // Add fuzzy search results if available
    if (fuzzySearchFn) {
      const fuzzyResults = fuzzySearchFn(query, items);
      fuzzyResults.forEach((item, index) => {
        const id = idExtractor(item);
        const fuzzyScore = (1 - index / fuzzyResults.length) * (1 - semanticWeight);
        
        if (results.has(id)) {
          // Combine scores for items found by both methods
          const existing = results.get(id)!;
          results.set(id, {
            item,
            score: existing.score + fuzzyScore,
            source: 'hybrid'
          });
        } else {
          results.set(id, {
            item,
            score: fuzzyScore,
            source: 'fuzzy'
          });
        }
      });
    }

    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.error('Error in hybrid search:', error);
    
    // Fallback to fuzzy search only
    if (fuzzySearchFn) {
      const fuzzyResults = fuzzySearchFn(query, items);
      return fuzzyResults.slice(0, limit).map((item, index) => ({
        item,
        score: 1 - index / fuzzyResults.length,
        source: 'fuzzy' as const
      }));
    }

    return [];
  }
}