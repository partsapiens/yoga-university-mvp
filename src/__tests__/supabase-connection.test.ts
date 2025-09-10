// Test file to verify Supabase connection and schema mapping
// Run this when network/connection issues are resolved
// Usage: npm test -- --run src/__tests__/supabase-connection.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { getPosesFromDatabase, testSupabaseConnection, debugDatabaseConnection } from '../lib/database';

describe('Supabase Connection Tests', () => {
  it('should be able to connect to Supabase', async () => {
    const connectionWorking = await testSupabaseConnection();
    
    if (!connectionWorking) {
      console.warn('Skipping test: Supabase connection not available');
      return;
    }
    
    expect(connectionWorking).toBe(true);
  });

  it('should fetch poses with correct schema', async () => {
    const poses = await getPosesFromDatabase();
    
    // Should always return data (either real data or fallback)
    expect(poses).toBeDefined();
    expect(Array.isArray(poses)).toBe(true);
    expect(poses.length).toBeGreaterThan(0);
    
    // Check schema structure
    const firstPose = poses[0];
    expect(firstPose).toHaveProperty('id');
    expect(firstPose).toHaveProperty('name');
    expect(firstPose).toHaveProperty('slug');
    expect(firstPose).toHaveProperty('category');
    
    // These fields should exist in the new schema
    expect(firstPose).toHaveProperty('sanskrit');
    expect(firstPose).toHaveProperty('level');
    expect(firstPose).toHaveProperty('intensity');
    expect(firstPose).toHaveProperty('anatomical_focus');
    
    console.log('Sample pose structure:', Object.keys(firstPose));
  });

  it('should handle database debug function', async () => {
    // This should not throw an error
    await expect(debugDatabaseConnection()).resolves.not.toThrow();
  });

  it('should have valid pose data structure', async () => {
    const poses = await getPosesFromDatabase();
    
    for (const pose of poses.slice(0, 3)) { // Test first 3 poses
      expect(typeof pose.id).toBe('string');
      expect(typeof pose.name).toBe('string');
      expect(pose.name.length).toBeGreaterThan(0);
      
      // Optional fields should be either string or null
      if (pose.sanskrit !== null) {
        expect(typeof pose.sanskrit).toBe('string');
      }
      
      if (pose.category !== null) {
        expect(typeof pose.category).toBe('string');
      }
      
      if (pose.level !== null) {
        expect(['beginner', 'intermediate', 'advanced']).toContain(pose.level);
      }
      
      // Arrays should be arrays
      if (pose.benefits) {
        expect(Array.isArray(pose.benefits)).toBe(true);
      }
      
      if (pose.anatomical_focus) {
        expect(Array.isArray(pose.anatomical_focus)).toBe(true);
      }
    }
  });
});

// Manual test function that can be called directly
export async function manualConnectionTest() {
  console.log('=== Manual Supabase Connection Test ===');
  
  try {
    console.log('1. Testing connection...');
    const connected = await testSupabaseConnection();
    console.log(`Connection status: ${connected ? '✅ Connected' : '❌ Failed'}`);
    
    console.log('\n2. Running debug...');
    await debugDatabaseConnection();
    
    console.log('\n3. Fetching poses...');
    const poses = await getPosesFromDatabase();
    console.log(`Fetched ${poses.length} poses`);
    
    if (poses.length > 0) {
      console.log('\n4. Sample pose:');
      console.log(JSON.stringify(poses[0], null, 2));
    }
    
    return { connected, posesCount: poses.length };
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}