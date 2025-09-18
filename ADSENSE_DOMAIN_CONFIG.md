# AdSense Domain Configuration Guide

This guide explains how to configure the application for different domains and AdSense settings.

## Environment Configuration

Copy `.env.example` to `.env` and modify for your specific domain:

```bash
# === Primary Configuration ===
# Set your domain here (used for sitemap, robots.txt, and metadata)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# === AdSense Publisher Configuration ===
# Your Google AdSense Publisher ID (format: ca-pub-XXXXXXXXXXXXXXXXX)
# This is configured directly in src/app/layout.tsx
# GOOGLE_ADSENSE_PUBLISHER_ID=ca-pub-9900806169268429

# === Alternative Domain Examples ===
# For fitwht.com:
# NEXT_PUBLIC_BASE_URL=https://fitwht.com

# For yogaflowuniversity.com (current default):
# NEXT_PUBLIC_BASE_URL=https://yogaflowuniversity.com

# For local development:
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# === Supabase Configuration ===
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# === OpenAI Configuration ===
# Set this in production environment variables, not in this file
# OPENAI_API_KEY=your_openai_api_key_here
USE_MOCK=false
```

## Important Notes

### Domain Configuration Impact
The `NEXT_PUBLIC_BASE_URL` affects:
- Sitemap generation (`src/app/sitemap.ts`)
- Robots.txt generation (`src/app/robots.ts`)
- Metadata in layout.tsx
- Verification scripts

### AdSense Publisher ID Updates
When changing domains or AdSense accounts, update:
- `src/app/layout.tsx` (script src and meta tag)
- `public/ads.txt` (publisher ID)

### Domain Change Checklist
When changing domains, ensure:
- DNS is properly configured
- SSL certificate is valid
- Domain is verified in Google AdSense console
- ads.txt is accessible at new domain

## Verification

Run this command to verify your configuration:
```bash
./scripts/verify-adsense.sh
```

## Common Domain-Specific Issues

### fitwht.com Configuration
```bash
NEXT_PUBLIC_BASE_URL=https://fitwht.com
```

Then update:
1. Publisher ID in layout.tsx (if different)
2. Publisher ID in public/ads.txt (if different)
3. Verify domain in Google AdSense console

### Local Development
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Note: AdSense verification won't work locally, but the implementation can be tested.