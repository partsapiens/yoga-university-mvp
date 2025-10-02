# OpenAI API Troubleshooting Guide for Netlify

This guide helps diagnose and fix OpenAI API issues in the Yoga University MVP hosted on Netlify.

## Quick Diagnosis

First, run the automated troubleshooting script to check the status of all AI-related endpoints:

```bash
# In your project directory
./troubleshoot-openai.sh
```

This script tests connectivity, authentication, and individual endpoints, providing specific recommendations.

## 1. Build & Deployment Issues on Netlify

This is the most common and critical issue. If your AI features work locally but fail in production, start here.

**Symptoms:**
- API calls to endpoints like `/api/ai-guide` or `/api/ai-select` fail with a 404 "Not Found" error.
- The network tab shows the browser receiving an HTML page (your app's 404 page) instead of a JSON response.
- The "Functions" tab in your Netlify dashboard is empty or missing the AI-related functions.

**Cause:**
The Next.js build process on Netlify is not correctly bundling the API routes as Serverless Functions. This often happens because the routes default to the "Edge" runtime, but they contain Node.js-specific code that is not compatible with the Edge environment.

**Solution: Force the Node.js Runtime**
You must explicitly tell Next.js to use the Node.js runtime for each AI-related API route.

1.  **Locate your API routes**: They are in the `src/app/api/` directory (e.g., `src/app/api/ai-guide/route.ts`).
2.  **Add the runtime export**: In each `route.ts` file for your AI endpoints, add the following line at the top:
    ```typescript
    export const runtime = 'nodejs';
    ```
    For example:
    ```typescript
    // src/app/api/ai-guide/route.ts
    import { NextResponse } from "next/server";
    import { oa, isOpenAIAvailable } from "@/lib/openai";

    export const runtime = 'nodejs'; // <-- ADD THIS LINE
    export const dynamic = 'force-dynamic';

    export async function POST(req: Request) {
      // ... rest of the code
    }
    ```
3.  **Redeploy**: Commit and push the change to trigger a new build on Netlify.

**Verification:**
-   After the deploy finishes, go to the **Functions** tab in your Netlify project. You should now see a list of functions corresponding to your API routes.
-   Use `curl` or your browser's developer tools to make a POST request to an endpoint. It should now return a JSON response, not a 404.

## 2. Configuration & Environment Variables

If the build is correct, the next step is to check your environment variables.

### For Local Development
Create a file named `.env.local` in the project root and add your keys:
```
# Get your API key from https://platform.openai.com/api-keys
OPENAI_API_KEY="your_openai_api_key_here"

# Set to 'false' to use the live OpenAI API, 'true' for mock responses
USE_MOCK=false
```
> **Remember to restart your local server** (`npm run dev`) after changing this file.

### For Netlify (Production & Previews)
1.  In your Netlify dashboard, go to `Site settings` > `Build & deploy` > `Environment`.
2.  Ensure these variables are set:
    -   `OPENAI_API_KEY`: Your secret OpenAI API key.
    -   `USE_MOCK`: Set to `false` to enable live API calls.
3.  Trigger a new deploy for the changes to apply.

## 3. Troubleshooting Common Runtime Errors

If your functions are deployed and configured but you still see errors, check the following.

### "Invalid API key" or 401 Error
-   **Verify your API key** at https://platform.openai.com/api-keys.
-   Ensure the key has **sufficient credits**.
-   Carefully **re-enter the key** and redeploy.

### Rate Limiting (429 Error)
-   Check your OpenAI usage at https://platform.openai.com/usage.
-   Consider upgrading your OpenAI plan if you consistently hit rate limits.

### Network/Timeout Issues
-   Check your **Netlify function logs** for timeout errors.
-   Check the OpenAI API status page: https://status.openai.com/

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