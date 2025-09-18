#!/bin/bash

# Google AdSense Verification Script
# This script helps verify that AdSense implementation is working correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get domain from environment or use default
DOMAIN=${NEXT_PUBLIC_BASE_URL:-"https://yogaflowuniversity.com"}

echo -e "${BLUE}=== Google AdSense Verification Script ===${NC}"
echo -e "Checking domain: ${YELLOW}$DOMAIN${NC}"
echo ""

# Check if ads.txt exists and is accessible
echo -e "${BLUE}1. Checking ads.txt accessibility...${NC}"
ads_txt_url="$DOMAIN/ads.txt"
echo "Testing URL: $ads_txt_url"

if curl -s -f "$ads_txt_url" > /dev/null; then
    echo -e "${GREEN}✓ ads.txt is accessible${NC}"
    
    # Check content
    echo -e "${BLUE}2. Checking ads.txt content...${NC}"
    content=$(curl -s "$ads_txt_url")
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
    echo "Make sure the file exists in the public/ directory"
fi

echo ""

# Check robots.txt
echo -e "${BLUE}3. Checking robots.txt...${NC}"
robots_url="$DOMAIN/robots.txt"
echo "Testing URL: $robots_url"

if curl -s -f "$robots_url" > /dev/null; then
    echo -e "${GREEN}✓ robots.txt is accessible${NC}"
    
    robots_content=$(curl -s "$robots_url")
    if [[ "$robots_content" == *"AdsBot-Google"* ]]; then
        echo -e "${GREEN}✓ robots.txt allows AdsBot-Google${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: robots.txt may not explicitly allow AdsBot-Google${NC}"
    fi
else
    echo -e "${RED}✗ robots.txt is not accessible${NC}"
fi

echo ""

# Check if the site is accessible
echo -e "${BLUE}4. Checking site accessibility...${NC}"
if curl -s -f "$DOMAIN" > /dev/null; then
    echo -e "${GREEN}✓ Site is accessible${NC}"
    
    # Check for AdSense script in page source
    echo -e "${BLUE}5. Checking for AdSense script in page source...${NC}"
    page_content=$(curl -s "$DOMAIN")
    
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