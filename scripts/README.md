# Domain Accessibility & AdSense Verification Tools

This directory contains comprehensive tools for diagnosing and fixing domain accessibility and AdSense verification issues, specifically addressing the problems described for `fltwht.com`.

## Scripts Overview

### 1. `verify-domain-access.sh` - Comprehensive Domain Diagnostics
```bash
./scripts/verify-domain-access.sh [domain]
./scripts/verify-domain-access.sh https://fltwht.com
```

**What it checks:**
- DNS resolution (A, AAAA, CNAME records)
- SSL/HTTPS accessibility and certificate validity
- robots.txt configuration and bot access rules
- ads.txt accessibility for AdSense verification
- General site accessibility and response times
- AdSense implementation in page source
- CDN/hosting provider detection (Cloudflare, Netlify, Vercel)

**Use this when:**
- AI tools (ChatGPT, OpenAI) can't access your site
- Google AdSense verification fails
- Need comprehensive domain health check
- Troubleshooting crawler access issues

### 2. `check-fltwht-access.sh` - fltwht.com Specific Diagnostics
```bash
./scripts/check-fltwht-access.sh
```

**What it provides:**
- Runs comprehensive domain verification for fltwht.com
- Step-by-step troubleshooting checklist
- Specific solutions for common issues
- Cloudflare configuration guidance
- Next steps and monitoring recommendations

**Use this when:**
- Specifically troubleshooting fltwht.com
- Need guided troubleshooting steps
- Want a complete diagnostic workflow

### 3. `verify-adsense.sh` - Enhanced AdSense Verification
```bash
./scripts/verify-adsense.sh [domain]
./scripts/verify-adsense.sh https://fltwht.com
```

**What it checks:**
- Network connectivity to domain
- ads.txt accessibility and content validation
- robots.txt configuration for AdSense crawlers
- AdSense script implementation
- Publisher ID verification
- Enhanced error reporting with troubleshooting tips

**Use this when:**
- Verifying AdSense implementation
- Checking after AdSense code changes
- Debugging AdSense verification issues

## Common Issues & Solutions

### Issue: "Content is not publicly accessible" (AI Tools)
**Symptoms:** ChatGPT, OpenAI, and other AI tools cannot access the site

**Diagnostic:** Run `./scripts/verify-domain-access.sh https://fltwht.com`

**Common causes:**
- DNS not pointing to active server
- SSL certificate issues
- Firewall/CDN blocking crawlers
- Site behind login or in preview mode

### Issue: "AdSense verification failed"
**Symptoms:** Google AdSense cannot verify domain ownership

**Diagnostic:** Run `./scripts/verify-adsense.sh https://fltwht.com`

**Common causes:**
- ads.txt file not accessible
- robots.txt blocking AdsBot-Google
- AdSense script not properly implemented
- Domain not properly configured

## Quick Troubleshooting Workflow

1. **Start with comprehensive check:**
   ```bash
   ./scripts/verify-domain-access.sh https://fltwht.com
   ```

2. **If issues found, follow specific guidance:**
   ```bash
   ./scripts/check-fltwht-access.sh
   ```

3. **For AdSense-specific issues:**
   ```bash
   ./scripts/verify-adsense.sh https://fltwht.com
   ```

4. **Read detailed troubleshooting guide:**
   See `DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md`

## External Tools Integration

The scripts provide guidance for using external diagnostic tools:

- **DNS Checker:** https://dnschecker.org
- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **Google Search Console:** For monitoring crawler access
- **Cloudflare Dashboard:** For CDN/firewall configuration

## Environment Configuration

For domain-specific testing, set the domain in your environment:

```bash
# For fltwht.com
export NEXT_PUBLIC_BASE_URL=https://fltwht.com

# Then run scripts
./scripts/verify-adsense.sh
```

Or pass domain directly:
```bash
./scripts/verify-adsense.sh https://fltwht.com
```

## Script Features

- **Color-coded output** for easy reading
- **Timeout handling** for network issues
- **Detailed error messages** with specific causes
- **Actionable troubleshooting steps**
- **Integration guidance** for external tools
- **Progress indicators** and status checks

## Making Scripts Executable

All scripts should be executable:
```bash
chmod +x scripts/*.sh
```

## Testing After Changes

After making configuration changes:

1. Wait for DNS propagation (up to 48 hours)
2. Clear browser caches
3. Test from different networks/devices
4. Re-run verification scripts
5. Monitor Google AdSense console
6. Check Google Search Console for crawler issues

## Support & Documentation

- **Complete troubleshooting guide:** `DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md`
- **AdSense implementation guide:** `ADSENSE_IMPLEMENTATION.md`
- **Domain configuration guide:** `ADSENSE_DOMAIN_CONFIG.md`

These tools address the specific issues mentioned in the problem statement and provide comprehensive solutions for domain accessibility and AdSense verification challenges.