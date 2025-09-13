# OpenAI Security Implementation & Production Setup

## 🎯 Production Mode Enabled

This repository is now configured for **production use with live OpenAI API calls**. The mock/demo mode has been disabled.

### Current Configuration
- ✅ `USE_MOCK=false` - Production mode enabled
- ✅ All API endpoints use real OpenAI calls when `OPENAI_API_KEY` is provided
- ✅ Graceful fallback to rule-based responses when API is unavailable
- ✅ Centralized OpenAI client management for consistency

## 🎯 Original Problem Solved

### Original Issues
1. **Netlify Build Failure**: Configuration expected static export (`out` directory) but Next.js was configured for server-side rendering
2. **Security Vulnerability**: OpenAI API key was committed to the repository
3. **Missing Security Guardrails**: No rate limiting, secret scanning, or proper error handling

### Root Cause
- `netlify.toml` was configured for static export (`publish = "out"`) 
- Next.js had `output: 'export'` commented out but Netlify still expected static files
- App uses API routes (serverless functions) which are incompatible with static export

## ✅ Solution Implemented

### 1. Fixed Netlify Configuration
```toml
[build]
  command = "npm run build"
  publish = ".next"  # Changed from "out"

[[plugins]]
  package = "@netlify/plugin-nextjs"  # Added for proper Next.js support
```

### 2. Secure OpenAI Client (`/src/lib/openai.ts`)
- ✅ Centralized OpenAI client with proper null checking
- ✅ Environment variable validation
- ✅ Graceful fallbacks when API key is missing
- ✅ Content filtering for safety
- ✅ Health check function without exposing secrets

### 3. Security Guardrails

#### Pre-commit Secret Scanning
```bash
npm run precommit  # Runs scripts/scan-secrets.cjs
```

#### Rate Limiting Middleware (`/src/middleware.ts`)
- 60 requests per minute per IP for API routes
- Automatic IP detection and tracking
- Graceful 429 responses with retry headers

#### API Health Check (`/api/health`)
```json
{
  "status": "healthy|unhealthy",
  "openai": true|false,
  "timestamp": "2025-09-11T19:32:52.785Z"
}
```

### 4. Environment Variable Security

#### `.env` (committed - safe)
```env
# OpenAI Configuration - Set this in your environment variables
# OPENAI_API_KEY=your_openai_api_key_here
USE_MOCK=true
```

#### `.env.local` (NOT committed - for local dev)
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
USE_MOCK=false
```

#### Enhanced `.gitignore`
```gitignore
.env
.env.*
!.env.example
**/secrets/
**/*secret*
**/*key*
```

## 🚀 Production OpenAI Integration

### How It Works
1. **Centralized Client**: All OpenAI calls go through `/src/lib/openai.ts`
2. **Environment Detection**: Checks for `OPENAI_API_KEY` and `USE_MOCK` settings
3. **Graceful Fallbacks**: Uses rule-based responses when API is unavailable
4. **Security**: API key is never exposed to client-side code

### Affected Endpoints
All these endpoints now use live OpenAI API calls in production:

- `/api/ai-select` - Natural language meditation recommendations
- `/api/ai-script` - Generated meditation scripts  
- `/api/ai-recap` - Session summary and insights
- `/api/flow-suggest` - AI-generated yoga flows
- `/api/ai/affirmations` - Personalized affirmations
- `/api/ai/adapt-flow` - Adaptive flow modifications
- `/api/ai/ai-insights` - Deep insights and analytics
- `/api/ai/recommendations` - Enhanced recommendations

### Testing Production Setup
```bash
# Test health endpoint (should show openai: true)
curl https://your-app.netlify.app/api/health

# Test AI endpoint with real OpenAI call
curl -X POST https://your-app.netlify.app/api/ai-select \
  -H "Content-Type: application/json" \
  -d '{"userText": "I feel stressed", "preferredDuration": 10}'
```

## 🚀 Deployment Instructions

### 1. Netlify Environment Variables
Set these in your Netlify dashboard (or your hosting provider):
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx-your-actual-openai-api-key-here-xxxxxxxxxxxx
USE_MOCK=false
```

**Important**: The `USE_MOCK=false` setting ensures the application uses live OpenAI API calls instead of fallback responses.

### 2. Deploy Process
1. Push changes to your repository
2. Netlify will automatically:
   - Run `npm run build`
   - Use `@netlify/plugin-nextjs` for proper Next.js support
   - Deploy API routes as serverless functions
   - Serve static files from `.next` directory

### 3. Verification Steps
After deployment:

1. **Test Health Endpoint**
   ```bash
   curl https://your-app.netlify.app/api/health
   ```

2. **Test AI Endpoints**
   ```bash
   curl -X POST https://your-app.netlify.app/api/ai-script \
     -H "Content-Type: application/json" \
     -d '{"style":"mindfulness","duration":10}'
   ```

3. **Verify Rate Limiting**
   - Try making 65+ requests in a minute
   - Should get 429 responses after 60 requests

## 🔒 Security Features

### 1. Never Expose API Keys
- All OpenAI calls happen server-side only
- Client never receives API keys
- Fallback responses when API unavailable

### 2. Content Filtering
- Removes medical claims and therapeutic advice
- Filters inappropriate language
- Safe, inclusive meditation guidance only

### 3. Rate Limiting
- Prevents API abuse
- Per-IP tracking (use Redis in production)
- Graceful degradation

### 4. Secret Scanning
- Pre-commit hooks prevent accidental key commits
- Detects OpenAI keys, generic API keys, secrets
- Masks actual values in error messages

## 🎯 Key Changes Made

### Files Updated
- `netlify.toml` - Fixed build configuration
- `.env` - Removed API key, added security comments
- `.env.example` - Secure template with placeholder
- `.gitignore` - Enhanced secret protection
- `src/lib/openai.ts` - Secure client with null checking
- All API routes - Updated to use `isOpenAIAvailable()`

### Files Added
- `src/middleware.ts` - Rate limiting middleware  
- `src/app/api/health/route.ts` - Health check endpoint
- `scripts/scan-secrets.cjs` - Pre-commit secret scanning
- `.env.local` - Local development template

### Build Output
```
Route (app)                   Size    First Load JS
├ λ /api/ai-guide            0 B     0 B
├ λ /api/ai-script           0 B     0 B  
├ λ /api/ai-select           0 B     0 B
├ ○ /api/health              0 B     0 B
ƒ Middleware                 27.3 kB
```

The `λ` symbols indicate serverless functions (correct for Netlify).
The `ƒ` symbol shows middleware is compiled and working.

## 🚨 Important Notes

1. **API Key Rotation**: If key needs rotation again:
   - Generate new key in OpenAI dashboard
   - Update in Netlify environment variables only
   - Never commit to git

2. **Production Recommendations**:
   - Use separate dev/prod OpenAI keys
   - Implement Redis for rate limiting
   - Add monitoring and alerting
   - Consider API usage budgets

3. **Fallback Strategy**: 
   - All endpoints work without OpenAI (mock responses)
   - Graceful degradation maintains user experience
   - No user-facing errors when API is down

## ✨ Testing

All features tested and working:
- ✅ Build completes successfully  
- ✅ API routes use serverless functions
- ✅ Health endpoint reports status correctly
- ✅ Secret scanning prevents accidental commits
- ✅ Rate limiting protects endpoints
- ✅ Fallback responses work when API unavailable