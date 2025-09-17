# Google AdSense Implementation Guide

## Overview
This document outlines the correct Google AdSense implementation for Yoga Flow University.

## Implementation Details

### 1. AdSense Script in Layout
The Google AdSense script is properly implemented in `src/app/layout.tsx` as the **first element** inside the `<head>` tag as per Google's guidelines:

```tsx
{/* Google AdSense - MUST be first element as per Google guidelines */}
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9900806169268429"
  crossOrigin="anonymous"
></script>
```

**IMPORTANT**: Using a direct `<script>` tag instead of Next.js `<Script>` component ensures the script is visible in the static HTML source, which is required for Google AdSense verification.

### 2. Required Meta Tags
- `<meta name="google-adsense-account" content="ca-pub-9900806169268429" />` - Account verification meta tag

### 3. Preconnect Links for Performance
The following preconnect links are included for optimal performance and are **always loaded** (not conditionally):

```tsx
{/* Ad network preconnects for performance */}
<link rel="preconnect" href="https://pagead2.googlesyndication.com" />
<link rel="preconnect" href="https://googleads.g.doubleclick.net" />
```

### 4. ads.txt File
**CRITICAL**: The `ads.txt` file MUST be accessible at the root URL (`/ads.txt`).

- File location: `public/ads.txt`
- Content: `google.com, pub-9900806169268429, DIRECT, f08c47fec0942fa0`
- Test accessibility: `curl https://yourdomain.com/ads.txt`

## Verification Steps

1. **Check ads.txt accessibility:**
   ```bash
   curl https://yogaflowuniversity.com/ads.txt
   ```

2. **Verify script in page source:**
   - View page source and search for "adsbygoogle"
   - Confirm the script is preloaded and loaded correctly

3. **Google AdSense Console:**
   - Check AdSense dashboard for site verification status
   - May take 24-48 hours for Google to detect changes

## Common Issues & Solutions

### ERR_BLOCKED_BY_CLIENT
- This error appears when ad blockers are active
- Normal in development environments
- Does not affect Google's ability to detect the implementation

### ads.txt Not Found (404)
- Ensure `ads.txt` is in the `public/` directory, not root
- Next.js serves static files from `public/` directory at root URL

### Script Not Loading
- Check Content Security Policy settings
- Ensure no conflicting service worker cache policies
- Verify correct publisher ID in script URL

### Crawler Access Issues  
- Ensure `robots.txt` allows `Googlebot` and `AdsBot-Google` access to the site
- The `robots.ts` file has been optimized to explicitly allow AdSense crawlers
- Static files like `ads.txt` should be accessible to all crawlers

## Publisher Information
- Publisher ID: `ca-pub-9900806169268429`
- Domain: `yogaflowuniversity.com`
- Implementation Date: 2025-01-17

## Notes
- The implementation follows Google AdSense best practices
- Script uses direct `<script>` tag for optimal verification by Google crawlers
- Script is positioned as the very first element in `<head>` as required by Google
- All required preconnect links are included for faster loading
- Script loads in both development and production environments for easier testing
- The `robots.txt` has been optimized to allow AdSense crawlers (`Googlebot` and `AdsBot-Google`)
- The `ads.txt` file has been cleaned of trailing whitespace for optimal parsing
- The implementation has been verified and tested successfully