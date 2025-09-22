# OpenAI API Troubleshooting Guide for Netlify

This guide helps diagnose and fix OpenAI API issues in the Yoga University MVP hosted on Netlify.

## Quick Diagnosis

Run the automated troubleshooting script:

```bash
# In your project directory
./troubleshoot-openai.sh
```

This script will test all endpoints and provide specific recommendations.

## Common Issues and Solutions

### 1. "API unavailable" Error

**Symptoms:**
- Health endpoint shows `"openai": false`
- AI endpoints return fallback responses
- Error message: "API unavailable"

**Causes & Solutions:**

#### Missing API Key
```bash
# Check if API key is configured
curl https://your-site.netlify.app/api/debug/environment
```

**Fix:** Set `OPENAI_API_KEY` in Netlify environment variables:
1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Add `USE_MOCK=false` to enable live API calls
4. Redeploy the site

#### Invalid API Key
**Symptoms:** Error code 401 or "Unauthorized"

**Fix:** 
1. Verify your API key at https://platform.openai.com/api-keys
2. Ensure the key has sufficient credits
3. Replace the key in Netlify environment variables

#### Rate Limiting
**Symptoms:** Error code 429 or "rate limit exceeded"

**Fix:**
1. Check your OpenAI usage at https://platform.openai.com/usage
2. Upgrade your OpenAI plan if needed
3. Implement request throttling (already included in the code)

### 2. Network/Timeout Issues

**Symptoms:**
- Requests timeout
- Intermittent connectivity issues

**Solutions:**
1. Check Netlify function logs for timeout errors
2. Verify Netlify Functions are properly configured
3. Check if `@netlify/plugin-nextjs` is installed

### 3. Environment Variable Issues

**Common Problems:**

#### Variables Not Available at Runtime
```bash
# Test environment availability
curl https://your-site.netlify.app/api/debug/environment
```

**Fix:**
1. Ensure variables are set in Netlify (not just in your local .env)
2. Redeploy after adding environment variables
3. Check that variable names match exactly (case-sensitive)

#### Mock Mode Enabled in Production
**Symptoms:** API returns mock/fallback responses

**Fix:** Set `USE_MOCK=false` in Netlify environment variables

## Debugging Tools

### 1. Health Check Endpoint
```bash
curl https://your-site.netlify.app/api/health
```

Returns:
- `openai: true/false` - API availability
- `status: healthy/unhealthy` - Overall status
- Debug info (in development mode)

### 2. Environment Debug Endpoint
```bash
curl https://your-site.netlify.app/api/debug/environment
```

Returns (in development or with DEBUG_MODE=true):
- Environment configuration
- API key status (without exposing the key)
- Runtime information

### 3. Test AI Endpoints

```bash
# Test AI selection
curl -X POST https://your-site.netlify.app/api/ai-select \
  -H "Content-Type: application/json" \
  -d '{"userText": "I feel stressed", "preferredDuration": 10}'

# Test AI chat
curl -X POST https://your-site.netlify.app/api/ai-guide \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Help with breathing"}]}'
```

## Netlify-Specific Configuration

### Required Environment Variables

In Netlify Dashboard > Site Settings > Environment Variables:

```
OPENAI_API_KEY=sk-proj-your-actual-openai-api-key-here
USE_MOCK=false
```

### Optional Debug Variables

For troubleshooting:
```
DEBUG_MODE=true  # Enables debug endpoint in production
```

### Build Configuration

Ensure `netlify.toml` is configured correctly:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Error Message Reference

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "API key not configured" | Missing OPENAI_API_KEY | Set API key in Netlify env vars |
| "Invalid API key" | Wrong/expired API key | Update API key |
| "Rate limit exceeded" | Too many requests | Check OpenAI usage/upgrade plan |
| "Request timeout" | Network/server issues | Check Netlify function logs |
| "API connection failed" | General connection issue | Check API key and network |

## Monitoring in Production

### Server-Side Logging

All API errors are logged with detailed information:

```javascript
console.error('AI Guide error details:', {
  message: errorMessage,
  code: errorCode,
  timestamp: new Date().toISOString(),
  isOpenAIAvailable: isOpenAIAvailable(),
  nodeEnv: process.env.NODE_ENV
});
```

### Client-Side Error Handling

Enhanced error messages are shown to users based on error type:
- Network issues: "Check your connection"
- Server errors: "Temporary server issue"
- API issues: "Service temporarily unavailable"

### Netlify Function Logs

Check Netlify function logs for detailed error information:
1. Go to Netlify Dashboard > Functions
2. Click on the failing function
3. Check the logs for error details

## Best Practices

### Security
- ✅ API keys are never exposed to client-side code
- ✅ All API calls happen server-side via Netlify Functions
- ✅ Error messages don't expose sensitive information in production

### Reliability
- ✅ Graceful fallbacks when API is unavailable
- ✅ Detailed logging for debugging
- ✅ Rate limiting and error handling
- ✅ Health monitoring endpoints

### Development vs Production
- Development: Detailed error messages and debug info
- Production: User-friendly messages, detailed server-side logs

## Getting Help

1. Run `./troubleshoot-openai.sh` for automated diagnosis
2. Check `/api/health` endpoint for system status
3. Review Netlify function logs for detailed errors
4. Test individual endpoints to isolate issues

## Contact Information

For additional support:
- Check OpenAI API status: https://status.openai.com/
- Netlify documentation: https://docs.netlify.com/functions/overview/
- OpenAI API docs: https://platform.openai.com/docs/api-reference