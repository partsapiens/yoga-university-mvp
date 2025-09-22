#!/bin/bash

# OpenAI API Troubleshooting Script for Netlify Deployment
# This script helps diagnose OpenAI API issues in production and development

echo "🔧 OpenAI API Troubleshooting Tool"
echo "=================================="
echo ""

# Check if we're running locally or on Netlify
if [ -n "$NETLIFY" ]; then
    echo "📍 Environment: Netlify (Production)"
    SERVER_URL="https://${URL}"
    echo "🌐 Site URL: $SERVER_URL"
else
    echo "📍 Environment: Local Development"
    SERVER_URL="http://localhost:3000"
    echo "🌐 Local URL: $SERVER_URL"
fi

echo ""

# Function to make API calls with better error handling
make_api_call() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    
    echo "📡 Testing $endpoint..."
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
          -H "Content-Type: application/json" \
          -d "$data" \
          "$SERVER_URL$endpoint" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" "$SERVER_URL$endpoint" 2>&1)
    fi
    
    # Split response and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "   Status: $http_code"
    if [ "$http_code" = "200" ]; then
        echo "   ✅ Success"
        if command -v jq >/dev/null 2>&1; then
            echo "$body" | jq . 2>/dev/null || echo "   Response: $body"
        else
            echo "   Response: $body"
        fi
    else
        echo "   ❌ Failed"
        echo "   Response: $body"
    fi
    echo ""
    
    return $http_code
}

# 1. Basic connectivity test
echo "1. Testing basic connectivity..."
if curl -s --max-time 10 "$SERVER_URL" > /dev/null; then
    echo "✅ Server is reachable"
else
    echo "❌ Server is not reachable"
    echo "   Check if the server is running and accessible"
    exit 1
fi
echo ""

# 2. Health check
echo "2. Testing health endpoint..."
make_api_call "/api/health"

# 3. Debug environment info (if available)
echo "3. Testing debug environment endpoint..."
make_api_call "/api/debug/environment"

# 4. Test AI endpoints with sample data
echo "4. Testing AI endpoints..."

echo "4a. AI Select endpoint..."
make_api_call "/api/ai-select" "POST" '{"userText": "I feel stressed", "preferredDuration": 10}'

echo "4b. AI Guide endpoint..."
make_api_call "/api/ai-guide" "POST" '{"messages": [{"role": "user", "content": "I need help with breathing"}]}'

echo "4c. AI Script endpoint..."
make_api_call "/api/ai-script" "POST" '{"style": "mindfulness", "duration": 10, "mood": "stressed"}'

# 5. Environment analysis
echo "5. Environment Analysis..."
echo "========================="

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "^OPENAI_API_KEY=" .env; then
        echo "✅ OPENAI_API_KEY is set in .env"
        # Check the format without exposing the key
        key_length=$(grep "^OPENAI_API_KEY=" .env | cut -d'=' -f2 | wc -c)
        echo "   Key length: $key_length characters"
        if [ $key_length -lt 50 ]; then
            echo "   ⚠️  API key seems too short (expected ~50+ chars)"
        fi
    else
        echo "⚠️  OPENAI_API_KEY not found in .env"
    fi
    
    if grep -q "^USE_MOCK=" .env; then
        mock_value=$(grep "^USE_MOCK=" .env | cut -d'=' -f2)
        echo "✅ USE_MOCK is set to: $mock_value"
        if [ "$mock_value" = "true" ]; then
            echo "   ℹ️  Mock mode is enabled - API calls will use fallback responses"
        fi
    else
        echo "ℹ️  USE_MOCK not explicitly set"
    fi
else
    echo "⚠️  .env file not found"
fi

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    if grep -q "^OPENAI_API_KEY=" .env.local; then
        echo "✅ OPENAI_API_KEY is set in .env.local (takes precedence)"
    fi
else
    echo "ℹ️  .env.local file not found (optional)"
fi

echo ""

# 6. Netlify-specific checks
if [ -n "$NETLIFY" ]; then
    echo "6. Netlify-specific Analysis..."
    echo "=============================="
    echo "Deploy ID: ${DEPLOY_ID:-'unknown'}"
    echo "Context: ${CONTEXT:-'unknown'}"
    echo "Build ID: ${BUILD_ID:-'unknown'}"
    echo "Site ID: ${SITE_ID:-'unknown'}"
    echo ""
    
    # Check if environment variables are available in Netlify context
    if [ -n "$OPENAI_API_KEY" ]; then
        echo "✅ OPENAI_API_KEY is available in Netlify environment"
        echo "   Key length: ${#OPENAI_API_KEY} characters"
    else
        echo "❌ OPENAI_API_KEY is NOT available in Netlify environment"
        echo "   Please check Netlify environment variables settings"
    fi
    
    if [ -n "$USE_MOCK" ]; then
        echo "✅ USE_MOCK is set to: $USE_MOCK"
    else
        echo "ℹ️  USE_MOCK not set (defaults to false)"
    fi
fi

echo ""

# 7. Recommendations
echo "7. Troubleshooting Recommendations..."
echo "===================================="

# Analyze the results and provide recommendations
if [ -n "$NETLIFY" ]; then
    echo "For Netlify deployment issues:"
    echo "• Verify OPENAI_API_KEY is set in Netlify environment variables"
    echo "• Ensure USE_MOCK=false for live API calls"
    echo "• Check Netlify build logs for any errors"
    echo "• Verify the site is using @netlify/plugin-nextjs"
else
    echo "For local development issues:"
    echo "• Create .env.local with OPENAI_API_KEY=your_key_here"
    echo "• Set USE_MOCK=false to enable live API calls"
    echo "• Restart the development server after changing environment variables"
    echo "• Get an API key from: https://platform.openai.com/api-keys"
fi

echo ""
echo "For both environments:"
echo "• Check server logs for detailed error messages"
echo "• Verify API key is valid and has sufficient credits"
echo "• Test health endpoint: $SERVER_URL/api/health"
echo "• Check debug endpoint: $SERVER_URL/api/debug/environment"

echo ""
echo "🎯 Troubleshooting Complete!"
echo "Check the output above for any issues that need attention."