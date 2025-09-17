# OpenAI Integration Setup

This document explains how to set up and test the OpenAI integration for the Yoga University MVP.

## Current Status

✅ **All AI endpoints are functional and tested**
✅ **Proper fallback behavior when OpenAI API is unavailable**
✅ **Safe error handling and content filtering**
✅ **Tests passing for all AI functionality**

## Available AI Endpoints

1. **AI Selector** (`/api/ai-select`) - Natural language meditation style recommendation
2. **AI Script Generator** (`/api/ai-script`) - Dynamic meditation script generation
3. **AI Recap** (`/api/ai-recap`) - Session summary and insights
4. **AI Guide** (`/api/ai-guide`) - Chat-based meditation guidance
5. **AI Recommendations** (`/api/ai/recommendations`) - Personalized practice recommendations
6. **Flow Suggestion** (`/api/flow-suggest`) - AI-generated yoga sequences

## Setup Instructions

### 1. Environment Configuration

**Option A: Use `.env.local` (Recommended for local development)**

Create a `.env.local` file in the project root:

```bash
# Local development - this file should NOT be committed to git
OPENAI_API_KEY=sk-proj-your-actual-openai-api-key-here
USE_MOCK=false
```

**Option B: Modify `.env` directly**

Uncomment and set the API key in the existing `.env` file:

```bash
# OpenAI Configuration - Set this in your environment variables
OPENAI_API_KEY=your_openai_api_key_here  # Uncomment and set your key
USE_MOCK=false
```

⚠️ **Important**: If you modify `.env` directly, never commit your actual API key to the repository.

### 2. Getting an OpenAI API Key

1. Visit [OpenAI's API platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your `.env.local` file

### 3. Testing the Integration

Run the comprehensive test script:

```bash
./test-ai-endpoints.sh
```

Or use the detailed integration test:

```bash
chmod +x /tmp/test-openai-integration.sh
/tmp/test-openai-integration.sh
```

### 4. Running Tests

```bash
# Run all AI-related tests
npm test -- src/__tests__/ai-flow-generation.test.ts src/__tests__/ai-sequence-validation.test.ts src/__tests__/api/ai-recommendations.test.ts

# Run specific AI tests
npm test -- src/__tests__/api/ai-recommendations.test.ts
```

## Fallback Mode

When OpenAI API is not available (missing key, API down, etc.), the system automatically falls back to:

- Pre-generated content for script generation
- Default meditation style recommendations
- Static guidance responses
- Safe meditation recommendations

This ensures the application remains functional even without OpenAI access.

## Security Features

- Content filtering to remove medical claims
- Rate limiting configuration
- Safe meditation guidance only
- Error handling with appropriate fallbacks
- No sensitive data exposure

## Debugging

If you encounter issues:

1. **Check API Key Configuration**:
   - Verify `OPENAI_API_KEY` is uncommented in `.env` or set in `.env.local`
   - Check server logs for "OPENAI_API_KEY missing" warnings
   - Ensure the API key starts with `sk-` and is valid

2. **Test Health Endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```
   - Should return `{"status": "healthy", "openai": true}` when configured correctly
   - Returns `{"status": "unhealthy", "openai": false}` when API key is missing

3. **Common Issues**:
   - **"AI validation encountered an error"**: Usually means API key is missing or invalid
   - **Fallback responses**: Indicates the system is using mock mode or API calls are failing
   - **Server restart required**: After changing environment variables, restart the dev server

4. **Environment Variable Priority**:
   - `.env.local` overrides `.env`
   - Use `.env.local` for your actual API key (never commit this file)
   - Keep `.env` with placeholder values for the repository

5. **Network Issues**:
   - Ensure you can reach `api.openai.com` from your environment
   - Check firewall or proxy settings if API calls fail

## Model Selection

The system uses different OpenAI models based on complexity:
- Simple queries: `gpt-4o-mini`
- Medium complexity: `gpt-4o-mini`
- Complex analysis: `gpt-4-turbo`

## API Usage Guidelines

- All AI responses are filtered for appropriate content
- Medical claims and therapeutic advice are automatically removed
- Responses focus on mindfulness, relaxation, and general wellness
- Rate limiting is configured to prevent excessive API usage