# Netlify Secret Exposure Fix

## Problem
Netlify deployment was failing with error:
```
Secret env var "OPENAI_API_KEY"'s value detected:
  found value at line 71871 in .netlify/.next/cache/webpack/client-production/0.pack
  found value at line 946806 in .netlify/.next/cache/webpack/client-production/0.pack
  [... many more locations]
```

## Root Cause
The `next.config.js` was configured to expose `OPENAI_API_KEY` to client-side code:

```javascript
// BEFORE (INSECURE)
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,  // ❌ EXPOSES TO CLIENT
  },
  // ...
}
```

This caused the API key to be embedded in webpack bundles and accessible to client-side JavaScript.

## Solution
1. **Removed client-side exposure** in `next.config.js`:
```javascript
// AFTER (SECURE)
const nextConfig = {
  env: {
    // DO NOT expose OPENAI_API_KEY to client-side code
    // OpenAI calls should only happen server-side via API routes
  },
  // ...
}
```

2. **Enhanced .gitignore** to exclude build artifacts:
```
# Netlify build artifacts that may contain secrets
/.netlify/
.netlify/
```

3. **Added build secret scanning**:
```bash
npm run check-build-safety
```

## Verification
- ✅ Build succeeds without exposing secrets
- ✅ OpenAI functionality works server-side via API routes
- ✅ Client-side code has no access to API keys
- ✅ Secret scanning passes

## Security Impact
- **Before**: API key embedded in client bundles (CRITICAL vulnerability)
- **After**: API key only accessible server-side (SECURE)

The fix ensures that:
- Netlify secret scanner passes
- API keys remain secure
- All AI functionality continues to work
- Zero functional impact on the application