#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

/**
 * Script to fix basic formatting issues in manual pages
 * This addresses the "PDF dump to text" problems by adding proper spacing and structure
 */

const CONTENT_DIR = path.join(process.cwd(), 'content/manual/pages');

function formatContent(content: string): string {
  // Extract the header and navigation parts
  const lines = content.split('\n');
  const headerEnd = lines.findIndex(line => line.trim() === '---' && lines.indexOf(line) > 0);
  
  if (headerEnd === -1) return content;
  
  const header = lines.slice(0, headerEnd + 1).join('\n');
  const footer = lines.slice(-3).join('\n'); // Usually the navigation footer
  const mainContent = lines.slice(headerEnd + 1, -3).join('\n');
  
  if (!mainContent.trim()) return content;
  
  // Apply formatting fixes to main content
  let formatted = mainContent
    // Fix run-on text with missing spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Add spaces around periods that are missing them
    .replace(/\.([A-Z])/g, '. $1')
    // Fix specific patterns like "chakrasChakra" 
    .replace(/chakras([A-Z])/g, 'chakras. $1')
    // Add space after common words that are run together
    .replace(/\b(and|or|the|of|in|to|for|with|by|from|on|at|is|are|was|were)([A-Z])/g, '$1 $2')
    // Add line breaks before common section headers
    .replace(/(INBALANCE|OUTOFBALANCE|Sanskrit:|Meaning:|Location:|Color:|Essence:|Governs:|Actions:|Postures:)/gi, '\n\n**$1**')
    // Add breaks before numbered sections
    .replace(/(\d+\.\d+)/g, '\n\n## $1')
    // Add space after copyright symbols
    .replace(/©([A-Z])/g, '© $1')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Add proper paragraph breaks for sentences ending with periods followed by capital letters
    .replace(/\. ([A-Z][a-z])/g, '.\n\n$1')
    // Fix spacing around quotes
    .replace(/"\s*([^"]+)\s*"/g, ' "$1" ')
    // Add breaks around Sanskrit terms in parentheses
    .replace(/\(([A-Z]{2,}[a-z-]+)\)/g, '\n\n*($1)*\n\n')
    // Clean up excessive line breaks
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  return `${header}\n\n${formatted}\n\n${footer}`;
}

function processFiles() {
  console.log('🔄 Processing manual pages for formatting improvements...');
  
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  let processedCount = 0;
  let skippedCount = 0;
  
  console.log(`Found ${files.length} markdown files to check.`);
  
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`📄 Checking ${file} (${originalContent.length} chars)`);
    
    // Skip files that are already well-formatted (like page-001.md which is just a title)
    if (originalContent.length < 500) {
      console.log(`⏭️  Skipping ${file} - too short`);
      skippedCount++;
      continue;
    }
    
    const formattedContent = formatContent(originalContent);
    
    // Only write if content actually changed
    if (formattedContent !== originalContent) {
      // Make a backup first
      fs.writeFileSync(filePath + '.backup', originalContent);
      fs.writeFileSync(filePath, formattedContent);
      processedCount++;
      console.log(`✅ Formatted ${file} (${originalContent.length} -> ${formattedContent.length} chars)`);
    } else {
      console.log(`✔️  ${file} - no changes needed`);
    }
  }
  
  console.log(`🎉 Completed! Processed ${processedCount} files, skipped ${skippedCount}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processFiles();
}

export { formatContent, processFiles };