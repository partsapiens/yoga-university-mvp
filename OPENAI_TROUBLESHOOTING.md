# OpenAI API Troubleshooting Guide for Netlify

This guide helps diagnose and fix OpenAI API issues in the Yoga University MVP hosted on Netlify.

## Quick Diagnosis

First, run the automated troubleshooting script to check the status of all AI-related endpoints:

```bash
# In your project directory
./troubleshoot-openai.sh
```

This script tests connectivity, authentication, and individual endpoints, providing specific recommendations.

## 1. Configuration and Setup

Correct configuration is essential. Follow the instructions for your environment.

### For Local Development
For local development, you must provide your own OpenAI API key.

1.  **Create a local environment file**: If it doesn't exist, create a file named `.env.local` in the root of the project.
2.  **Add your API key**: Open `.env.local` and add your key:
    ```
    # Get your API key from https://platform.openai.com/api-keys
    OPENAI_API_KEY="your_openai_api_key_here"

    # Set to 'false' to use the live OpenAI API, 'true' for mock responses
    USE_MOCK=false
    ```
3.  **Restart the server**: Stop and restart the development server (`npm run dev`) for the changes to take effect.

> **Note**: The `.env.local` file is ignored by Git and should never be committed.

### For Netlify (Production & Previews)
For the live site and preview deploys, environment variables must be set in the Netlify dashboard.

1.  **Navigate to Environment Variables**: In your Netlify dashboard, go to `Site settings` > `Build & deploy` > `Environment`.
2.  **Add Required Variables**: Add the following variables:
    -   `OPENAI_API_KEY`: Your secret OpenAI API key.
    -   `USE_MOCK`: Set this to `false` to enable live API calls.
3.  **Redeploy**: Trigger a new deploy for the changes to apply.

## 2. Troubleshooting Common Errors

If you've configured the environment variables correctly and still have issues, consult this list.

### "Invalid API key" or 401 Error
**Symptoms:**
- The health endpoint (`/api/health`) shows `"openai": false` with an "Invalid API key" error.
- AI features return fallback content.
- The `troubleshoot-openai.sh` script reports a 401 error.

**Fix:**
1.  **Verify your API key** at https://platform.openai.com/api-keys.
2.  Ensure the key has **sufficient credits** and is not expired.
3.  Carefully **re-enter the key** in your `.env.local` file (for local) or Netlify environment variables (for production) and redeploy.

### "API unavailable" or "API key not configured"
**Symptoms:**
- The health endpoint shows `"openai": false`.
- The application uses mock/fallback responses.

**Fix:**
1.  Ensure `OPENAI_API_KEY` is set correctly for your environment (see section 1).
2.  Make sure `USE_MOCK` is set to `false`. If `USE_MOCK` is `true`, the application will intentionally use fallback data.

### Rate Limiting (429 Error)
**Symptoms:**
- AI features fail intermittently with a "rate limit exceeded" or 429 error.

**Fix:**
1.  Check your OpenAI usage at https://platform.openai.com/usage.
2.  Consider upgrading your OpenAI plan if you are consistently hitting rate limits.
3.  The application has built-in throttling, but high traffic can still exceed limits.

### Network/Timeout Issues
**Symptoms:**
- Requests to AI endpoints time out.

**Solutions:**
1.  Check Netlify function logs for timeout errors.
2.  Verify your internet connection and check the OpenAI API status page: https://status.openai.com/

## 3. Debugging Tools

Use these endpoints to get more information about the system's status.

### Health Check Endpoint
```bash
curl http://your-site-url/api/health
```
Returns a summary of the API status, including whether OpenAI is available.

### Environment Debug Endpoint
```bash
curl http://your-site-url/api/debug/environment
```
Returns detailed (but safe) information about the runtime environment, including whether an API key is present (without exposing the key itself). *Note: This endpoint may be disabled in production unless `DEBUG_MODE=true` is set.*

### Test AI Endpoints
Use `curl` to test the AI endpoints directly:
```bash
# Test AI selection
curl -X POST http://your-site-url/api/ai-select \
  -H "Content-Type: application/json" \
  -d '{"userText": "I feel stressed", "preferredDuration": 10}'

# Test AI chat
curl -X POST http://your-site-url/api/ai-guide \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Help with breathing"}]}'
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