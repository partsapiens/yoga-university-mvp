#!/bin/bash

# Script to verify no secrets are exposed in build output
# This simulates what Netlify's secret scanner would look for

echo "🔍 Checking build output for exposed secrets..."

# Set up test environment with a mock API key
export OPENAI_API_KEY="sk-test-mock-key-for-secret-scanning-12345"
export USE_MOCK="false"

# Clean and rebuild
echo "Cleaning previous build..."
rm -rf .next

echo "Building with mock API key..."
npm run build >/dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Search for the mock API key in build output
echo "Searching for API key exposure in build artifacts..."

FOUND_FILES=$(find .next -type f \( -name "*.js" -o -name "*.json" -o -name "*.html" \) -exec grep -l "sk-test-mock-key-for-secret-scanning" {} \; 2>/dev/null)

if [ -n "$FOUND_FILES" ]; then
    echo "❌ SECURITY ISSUE: API key found in build output!"
    echo "Files containing secret:"
    echo "$FOUND_FILES"
    exit 1
else
    echo "✅ No API key found in build output"
fi

# Check for any "sk-" patterns (OpenAI key format)
SK_PATTERNS=$(find .next -type f \( -name "*.js" -o -name "*.json" \) -exec grep -l "sk-[a-zA-Z0-9]\{40,\}" {} \; 2>/dev/null)

if [ -n "$SK_PATTERNS" ]; then
    echo "⚠️  Warning: Potential API key patterns found:"
    echo "$SK_PATTERNS"
    echo "Please verify these are not actual secrets"
else
    echo "✅ No API key patterns found in build output"
fi

echo "✅ Build secret scanning complete - PASSED"