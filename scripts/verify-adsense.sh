#!/bin/bash

# Google AdSense Verification Script
# This script helps verify that AdSense implementation is working correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Get domain from command line argument, environment, or use default
DOMAIN=${1:-${NEXT_PUBLIC_BASE_URL:-"https://yogaflowuniversity.com"}}
TIMEOUT=10

echo -e "${BOLD}${BLUE}=== Google AdSense Verification Script ===${NC}"
echo -e "Checking domain: ${YELLOW}$DOMAIN${NC}"
echo ""

# Function to check network connectivity
check_network() {
    echo -e "${BLUE}0. Network Connectivity Check${NC}"
    
    # Try to connect to the domain with a timeout
    if curl -s --connect-timeout $TIMEOUT -o /dev/null "$DOMAIN" 2>/dev/null; then
        echo -e "${GREEN}✓ Network connection to domain is working${NC}"
        return 0
    else
        echo -e "${RED}✗ Cannot connect to domain${NC}"
        echo -e "${YELLOW}This could indicate:${NC}"
        echo "  • DNS resolution issues"
        echo "  • Domain is not accessible"
        echo "  • Firewall or network restrictions"
        echo "  • SSL certificate problems"
        echo ""
        echo -e "${CYAN}Troubleshooting steps:${NC}"
        echo "  1. Check DNS: dig A $(echo $DOMAIN | sed 's|https\?://||' | sed 's|/.*||')"
        echo "  2. Test SSL: openssl s_client -connect $(echo $DOMAIN | sed 's|https\?://||' | sed 's|/.*||'):443"
        echo "  3. Try accessing in browser: $DOMAIN"
        echo "  4. Use domain verification script: ./scripts/verify-domain-access.sh $DOMAIN"
        echo ""
        return 1
    fi
}

# Run network check first
network_ok=0
check_network && network_ok=1

echo ""

# Check if ads.txt exists and is accessible
echo -e "${BLUE}1. Checking ads.txt accessibility...${NC}"
ads_txt_url="$DOMAIN/ads.txt"
echo "Testing URL: $ads_txt_url"

if [ $network_ok -eq 1 ] && curl -s -f --connect-timeout $TIMEOUT "$ads_txt_url" > /dev/null; then
    echo -e "${GREEN}✓ ads.txt is accessible${NC}"
    
    # Check content
    echo -e "${BLUE}2. Checking ads.txt content...${NC}"
    content=$(curl -s --connect-timeout $TIMEOUT "$ads_txt_url")
    echo "Content: $content"
    
    if [[ "$content" == *"google.com"* && "$content" == *"pub-"* ]]; then
        echo -e "${GREEN}✓ ads.txt contains Google AdSense entry${NC}"
    else
        echo -e "${RED}✗ ads.txt does not contain valid Google AdSense entry${NC}"
    fi
    
    # Check for trailing whitespace or BOM
    if [[ "$content" =~ [[:space:]]$ ]]; then
        echo -e "${YELLOW}⚠ Warning: ads.txt contains trailing whitespace${NC}"
    else
        echo -e "${GREEN}✓ ads.txt has clean format${NC}"
    fi
    
else
    echo -e "${RED}✗ ads.txt is not accessible at $ads_txt_url${NC}"
    if [ $network_ok -eq 0 ]; then
        echo "  Reason: Network connectivity issues (see above)"
    else
        echo "  Make sure the file exists in the public/ directory"
        echo "  Check that your hosting provider serves static files correctly"
    fi
fi

echo ""

# Check robots.txt
echo -e "${BLUE}3. Checking robots.txt...${NC}"
robots_url="$DOMAIN/robots.txt"
echo "Testing URL: $robots_url"

if [ $network_ok -eq 1 ] && curl -s -f --connect-timeout $TIMEOUT "$robots_url" > /dev/null; then
    echo -e "${GREEN}✓ robots.txt is accessible${NC}"
    
    robots_content=$(curl -s --connect-timeout $TIMEOUT "$robots_url")
    if [[ "$robots_content" == *"AdsBot-Google"* ]]; then
        echo -e "${GREEN}✓ robots.txt allows AdsBot-Google${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: robots.txt may not explicitly allow AdsBot-Google${NC}"
    fi
else
    echo -e "${RED}✗ robots.txt is not accessible${NC}"
    if [ $network_ok -eq 0 ]; then
        echo "  Reason: Network connectivity issues (see above)"
    else
        echo "  This may be generated dynamically - check src/app/robots.ts"
    fi
fi

echo ""

# Check if the site is accessible
echo -e "${BLUE}4. Checking site accessibility...${NC}"
if [ $network_ok -eq 1 ] && curl -s -f --connect-timeout $TIMEOUT "$DOMAIN" > /dev/null; then
    echo -e "${GREEN}✓ Site is accessible${NC}"
    
    # Check for AdSense script in page source
    echo -e "${BLUE}5. Checking for AdSense script in page source...${NC}"
    page_content=$(curl -s --connect-timeout $TIMEOUT "$DOMAIN")
    
    if [[ "$page_content" == *"pagead2.googlesyndication.com"* ]]; then
        echo -e "${GREEN}✓ AdSense script found in page source${NC}"
    else
        echo -e "${RED}✗ AdSense script not found in page source${NC}"
    fi
    
    if [[ "$page_content" == *"google-adsense-account"* ]]; then
        echo -e "${GREEN}✓ AdSense meta tag found${NC}"
    else
        echo -e "${RED}✗ AdSense meta tag not found${NC}"
    fi
    
else
    echo -e "${RED}✗ Site is not accessible${NC}"
    if [ $network_ok -eq 0 ]; then
        echo "  Reason: Network connectivity issues (see above)"
    else
        echo "  Check hosting status and domain configuration"
    fi
    echo ""
    echo -e "${CYAN}For comprehensive domain diagnostics, run:${NC}"
    echo "  ./scripts/verify-domain-access.sh $DOMAIN"
fi

echo ""
echo -e "${BLUE}=== Verification Complete ===${NC}"
echo ""
echo -e "${YELLOW}Tips:${NC}"
echo "• AdSense verification can take 24-48 hours after implementation"
echo "• Clear browser cache when testing locally"
echo "• Use incognito/private browsing to avoid cache issues"
echo "• Check Google AdSense console for verification status"
echo "• Ensure DNS is properly configured and propagated"
echo ""
echo -e "${CYAN}Additional diagnostic tools:${NC}"
echo "• Domain accessibility: ./scripts/verify-domain-access.sh $DOMAIN"
echo "• fltwht.com specific: ./scripts/check-fltwht-access.sh"
echo "• Troubleshooting guide: See DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md"
echo ""
echo -e "${CYAN}Usage: $0 [domain]${NC}"
echo -e "${CYAN}Example: $0 https://fltwht.com${NC}"