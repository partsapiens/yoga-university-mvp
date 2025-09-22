# Domain Accessibility & AdSense Verification Troubleshooting Guide

## Problem Statement

There are two main issues affecting `fltwht.com`:

1. **AI Tools Cannot Access the Site**: OpenAI, ChatGPT browsing, and other AI tools report "content is not publicly accessible"
2. **Google AdSense Cannot Verify the Site**: AdSense verification fails because Google's crawlers cannot access the domain

## Root Causes

When AI tools and AdSense crawlers cannot access a site, it's typically due to one or more of these issues:

### DNS & Hosting Issues
- Domain's DNS doesn't point to an active web host
- A/AAAA/CNAME records not set or still propagating
- DNS configuration errors

### SSL/TLS Issues
- Missing or invalid SSL certificate
- Certificate not properly configured
- Mixed content issues

### Access Restrictions
- Site behind login or in "preview" mode
- Firewall or CDN blocking crawlers
- robots.txt blocking bots
- Server misconfiguration

## Diagnostic Tools

This repository now includes comprehensive verification scripts:

### 1. Domain Accessibility Verification Script
```bash
./scripts/verify-domain-access.sh [domain]
```

This script performs comprehensive checks:
- DNS resolution (A, AAAA, CNAME records)
- SSL/HTTPS accessibility
- robots.txt configuration
- ads.txt accessibility
- General site accessibility
- AdSense implementation verification
- Provides detailed troubleshooting tips

### 2. fltwht.com Specific Diagnostic
```bash
./scripts/check-fltwht-access.sh
```

This script specifically targets fltwht.com and provides:
- Comprehensive domain verification
- Step-by-step checklist for fixing issues
- Specific solutions for common problems
- Cloudflare configuration tips

### 3. Enhanced AdSense Verification
```bash
./scripts/verify-adsense.sh
```

The existing AdSense script checks:
- ads.txt accessibility and content
- robots.txt configuration
- AdSense script presence
- Site accessibility

## Step-by-Step Troubleshooting

### Step 1: DNS & Hosting Check
**What to check:**
- Is the A or CNAME record pointing to the correct server?

**How to verify:**
- Use dnschecker.org to test fltwht.com
- Run: `dig A fltwht.com` or `dig CNAME fltwht.com`
- Check with your hosting provider for correct DNS settings

**Common solutions:**
- Update A record to point to hosting server IP
- Update CNAME to point to hosting domain (e.g., netlify.app)
- Wait for DNS propagation (up to 48 hours)

### Step 2: SSL/HTTPS Check
**What to check:**
- Does https://fltwht.com load in a private browser window?

**How to verify:**
- Visit from mobile/LTE to bypass local cache
- Use SSL Labs test: https://www.ssllabs.com/ssltest/
- Check certificate validity and configuration

**Common solutions:**
- Install valid SSL certificate
- Configure certificate properly with hosting provider
- Ensure certificate covers both www and non-www versions

### Step 3: robots.txt Check
**What to check:**
- Are bots blocked by robots.txt?

**How to verify:**
- Visit https://fltwht.com/robots.txt
- Check for overly restrictive rules

**Common solutions:**
```
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /
```

### Step 4: ads.txt Check
**What to check:**
- Is the AdSense ads.txt file reachable?

**How to verify:**
- Visit https://fltwht.com/ads.txt
- Verify content format

**Required content:**
```
google.com, pub-YOUR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

### Step 5: Firewall/CDN Check
**What to check:**
- Is Cloudflare or similar service blocking crawlers?

**How to verify:**
- Check Cloudflare settings → Security → WAF
- Look for bot blocking rules

**Cloudflare solutions:**
1. Go to Cloudflare Dashboard → Security → WAF
2. Add firewall rule to allow Googlebot:
   - Field: User Agent
   - Operator: Contains
   - Value: Googlebot
   - Action: Allow
3. Add rule for AdsBot-Google:
   - Field: User Agent
   - Operator: Contains
   - Value: AdsBot-Google
   - Action: Allow
4. Add rule for AI crawlers:
   - Field: User Agent
   - Operator: Contains
   - Value: GPTBot
   - Action: Allow

## Environment Configuration

For this project, ensure proper domain configuration:

```bash
# In .env file
NEXT_PUBLIC_BASE_URL=https://fltwht.com
```

Then update:
1. Publisher ID in `src/app/layout.tsx` (if different)
2. Publisher ID in `public/ads.txt` (if different)
3. Verify domain in Google AdSense console

## Testing After Changes

1. Run verification scripts:
   ```bash
   ./scripts/verify-domain-access.sh https://fltwht.com
   ./scripts/check-fltwht-access.sh
   ./scripts/verify-adsense.sh
   ```

2. Test from multiple locations:
   - Different networks (mobile/LTE)
   - Private/incognito browser windows
   - Different devices

3. Wait for propagation:
   - DNS changes: up to 48 hours
   - AdSense verification: 24-48 hours after implementation

4. Monitor:
   - Google AdSense console for verification status
   - Google Search Console for crawling issues
   - Server logs for bot access attempts

## Common Error Messages & Solutions

### "Content is not publicly accessible"
- **Cause**: DNS, SSL, or access restriction issues
- **Solution**: Follow steps 1-5 above

### "AdSense verification failed"
- **Cause**: ads.txt not accessible or incorrect format
- **Solution**: Ensure ads.txt is properly formatted and accessible

### "SSL certificate problem"
- **Cause**: Invalid or misconfigured SSL certificate
- **Solution**: Install valid SSL certificate or fix configuration

### "Connection timeout"
- **Cause**: Server not responding or DNS issues
- **Solution**: Check hosting status and DNS configuration

## Prevention & Best Practices

1. **Regular monitoring**: Run verification scripts regularly
2. **DNS management**: Use reliable DNS providers
3. **SSL maintenance**: Keep certificates updated
4. **Access policies**: Regularly review firewall and CDN settings
5. **Documentation**: Keep track of configuration changes

## Support Resources

- **DNS Checker**: https://dnschecker.org
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Google Search Console**: https://search.google.com/search-console
- **Google AdSense Help**: https://support.google.com/adsense
- **Cloudflare Support**: https://support.cloudflare.com