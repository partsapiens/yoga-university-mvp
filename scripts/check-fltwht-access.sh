#!/bin/bash

# fltwht.com Specific Verification Script
# This script addresses the specific issues mentioned for fltwht.com domain accessibility

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

DOMAIN="https://fltwht.com"

echo -e "${BOLD}${BLUE}=== fltwht.com Accessibility Diagnostic ===${NC}"
echo -e "Checking domain: ${YELLOW}$DOMAIN${NC}"
echo ""

echo -e "${BOLD}${CYAN}Running comprehensive domain verification...${NC}"
echo ""

# Run the main verification script
./scripts/verify-domain-access.sh "$DOMAIN"

echo ""
echo -e "${BOLD}${BLUE}=== fltwht.com Specific Issues & Solutions ===${NC}"
echo ""

echo -e "${BOLD}Issue 1: AI Tools Can't Access fltwht.com${NC}"
echo "• When OpenAI/ChatGPT says 'content is not publicly accessible'"
echo "• This affects search engine bots and AdSense crawlers too"
echo ""

echo -e "${BOLD}Issue 2: Google AdSense Cannot Verify Site${NC}"
echo "• AdSense must crawl your domain to confirm ownership"
echo "• If bot can't reach root URL or ads.txt, verification fails"
echo ""

echo -e "${BOLD}${YELLOW}Quick Checks Checklist:${NC}"
echo ""

echo -e "${BOLD}Step 1: DNS & Hosting${NC}"
echo "☐ Use dnschecker.org to test fltwht.com"
echo "☐ Verify A or CNAME record points to correct server"
echo "☐ Check if DNS has fully propagated globally"
echo ""

echo -e "${BOLD}Step 2: SSL/HTTPS${NC}"
echo "☐ Test https://fltwht.com in private browser window"
echo "☐ Visit from mobile/LTE to bypass local cache"
echo "☐ Check SSL certificate validity"
echo ""

echo -e "${BOLD}Step 3: robots.txt${NC}"
echo "☐ Visit https://fltwht.com/robots.txt"
echo "☐ Ensure it doesn't block Googlebot"
echo "☐ Ensure it doesn't block AdsBot-Google"
echo "☐ Check for AI bot access (GPTBot, ChatGPT-User)"
echo ""

echo -e "${BOLD}Step 4: ads.txt${NC}"
echo "☐ Visit https://fltwht.com/ads.txt"
echo "☐ Verify Google AdSense publisher ID is present"
echo "☐ Check file format is clean (no trailing whitespace)"
echo ""

echo -e "${BOLD}Step 5: Firewall/CDN${NC}"
echo "☐ If using Cloudflare, check firewall rules"
echo "☐ Ensure Googlebot and AdsBot-Google are allowed"
echo "☐ Check if any bot blocking is enabled"
echo ""

echo -e "${BOLD}${GREEN}Common Solutions:${NC}"
echo ""

echo -e "${BOLD}For DNS Issues:${NC}"
echo "• Update A record to point to your hosting server IP"
echo "• Or update CNAME to point to your hosting domain"
echo "• Wait for DNS propagation (can take up to 48 hours)"
echo ""

echo -e "${BOLD}For SSL Issues:${NC}"
echo "• Ensure SSL certificate is installed and valid"
echo "• Check with your hosting provider"
echo "• Test with SSL Labs: https://www.ssllabs.com/ssltest/"
echo ""

echo -e "${BOLD}For Cloudflare Users:${NC}"
echo "• Go to Cloudflare Dashboard → Security → WAF"
echo "• Add firewall rule to allow Googlebot:"
echo "  Field: User Agent, Operator: Contains, Value: Googlebot"
echo "  Action: Allow"
echo "• Add rule for AdsBot-Google:"
echo "  Field: User Agent, Operator: Contains, Value: AdsBot-Google"
echo "  Action: Allow"
echo ""

echo -e "${BOLD}For robots.txt Issues:${NC}"
echo "• Ensure robots.txt allows crawlers:"
echo "  User-agent: *"
echo "  Allow: /"
echo "• Or specifically allow Google bots:"
echo "  User-agent: Googlebot"
echo "  Allow: /"
echo "  User-agent: AdsBot-Google"
echo "  Allow: /"
echo ""

echo -e "${BOLD}${CYAN}Next Steps:${NC}"
echo "1. Run this script again after making changes"
echo "2. Test accessibility from multiple locations/networks"
echo "3. Wait 24-48 hours for changes to propagate"
echo "4. Check Google AdSense console for verification status"
echo "5. Monitor Google Search Console for crawling issues"
echo ""

echo -e "${BOLD}${BLUE}=== End of fltwht.com Diagnostic ===${NC}"