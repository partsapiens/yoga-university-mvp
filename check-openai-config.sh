#!/bin/bash

# OpenAI Configuration Status Check
# This script helps diagnose OpenAI API configuration issues

echo "🔧 OpenAI Configuration Status Check"
echo "===================================="
echo ""

# Check if server is running
SERVER_URL="http://localhost:3000"
echo "1. Checking if development server is running..."
if curl -s "$SERVER_URL/api/health" > /dev/null; then
    echo "✅ Server is running at $SERVER_URL"
else
    echo "❌ Server is not running. Start it with: npm run dev"
    exit 1
fi

echo ""

# Check API health
echo "2. Checking OpenAI API health..."
HEALTH_RESPONSE=$(curl -s "$SERVER_URL/api/health")
echo "Health response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q '"openai": *true'; then
    echo "✅ OpenAI API is configured and healthy"
elif echo "$HEALTH_RESPONSE" | grep -q '"openai": *false'; then
    echo "⚠️  OpenAI API is not configured or unhealthy"
    echo "   This usually means OPENAI_API_KEY is missing or invalid"
else
    echo "❌ Unexpected health response"
fi

echo ""

# Test a simple AI endpoint
echo "3. Testing AI endpoint functionality..."
AI_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/ai-select" \
  -H "Content-Type: application/json" \
  -d '{"userText": "test", "preferredDuration": 10}')

echo "AI Select response: $AI_RESPONSE"

if echo "$AI_RESPONSE" | grep -q '"rationale": *"Mock"'; then
    echo "ℹ️  System is running in fallback/mock mode"
    echo "   To use live OpenAI API, ensure OPENAI_API_KEY is set and USE_MOCK=false"
elif echo "$AI_RESPONSE" | grep -q '"rationale"'; then
    echo "✅ OpenAI API is working correctly"
else
    echo "⚠️  Unexpected AI response format"
fi

echo ""

# Check environment files
echo "4. Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    if grep -q "^OPENAI_API_KEY=" .env.local; then
        echo "✅ OPENAI_API_KEY is set in .env.local"
    else
        echo "⚠️  OPENAI_API_KEY not found in .env.local"
    fi
else
    echo "ℹ️  .env.local file not found (using .env only)"
fi

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "^OPENAI_API_KEY=" .env; then
        echo "✅ OPENAI_API_KEY is uncommented in .env"
    else
        echo "⚠️  OPENAI_API_KEY is commented out in .env"
    fi
else
    echo "❌ .env file not found"
fi

echo ""
echo "🎯 Configuration Summary:"
echo "========================"
echo "- To enable OpenAI API: Set OPENAI_API_KEY in .env.local or uncomment in .env"
echo "- To use live API calls: Set USE_MOCK=false"
echo "- Get API key from: https://platform.openai.com/api-keys"
echo "- Restart server after changing environment variables"