# OpenAI API Troubleshooting Guide for Netlify

This guide helps diagnose and fix OpenAI API issues in the Yoga University MVP hosted on Netlify.

## Quick Diagnosis

First, run the automated troubleshooting script to check the status of all AI-related endpoints:

```bash
# In your project directory
./troubleshoot-openai.sh
```


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