#!/bin/bash

# Domain Accessibility Verification Script
# This script performs comprehensive checks to verify if a domain is accessible to crawlers and AI tools
# Addresses the issues described in the problem statement for fltwht.com

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_DOMAIN="https://fltwht.com"
DOMAIN=${1:-$DEFAULT_DOMAIN}
TIMEOUT=10

# Remove protocol from domain for DNS checks
DOMAIN_NO_PROTOCOL=$(echo "$DOMAIN" | sed 's|https\?://||' | sed 's|/.*||')

echo -e "${BOLD}${BLUE}=== Domain Accessibility Verification Script ===${NC}"
echo -e "Checking domain: ${YELLOW}$DOMAIN${NC}"
echo -e "Domain (no protocol): ${YELLOW}$DOMAIN_NO_PROTOCOL${NC}"
echo ""

# Function to check DNS resolution
check_dns() {
    echo -e "${BOLD}${BLUE}1. DNS Resolution Check${NC}"
    echo "Testing DNS resolution for: $DOMAIN_NO_PROTOCOL"
    
    # Check A record
    a_record=$(dig +short A "$DOMAIN_NO_PROTOCOL" 2>/dev/null)
    if [ -n "$a_record" ]; then
        echo -e "${GREEN}✓ A record found: $a_record${NC}"
    else
        echo -e "${RED}✗ No A record found${NC}"
    fi
    
    # Check AAAA record (IPv6)
    aaaa_record=$(dig +short AAAA "$DOMAIN_NO_PROTOCOL" 2>/dev/null)
    if [ -n "$aaaa_record" ]; then
        echo -e "${GREEN}✓ AAAA record found: $aaaa_record${NC}"
    else
        echo -e "${YELLOW}⚠ No AAAA record found (IPv6)${NC}"
    fi
    
    # Check CNAME record
    cname_record=$(dig +short CNAME "$DOMAIN_NO_PROTOCOL" 2>/dev/null)
    if [ -n "$cname_record" ]; then
        echo -e "${GREEN}✓ CNAME record found: $cname_record${NC}"
    else
        echo -e "${YELLOW}⚠ No CNAME record found${NC}"
    fi
    
    echo ""
}

# Function to check SSL/HTTPS
check_ssl() {
    echo -e "${BOLD}${BLUE}2. SSL/HTTPS Check${NC}"
    echo "Testing HTTPS accessibility: $DOMAIN"
    
    # Check if HTTPS is accessible
    ssl_response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$DOMAIN" 2>/dev/null)
    
    if [ "$ssl_response" = "200" ]; then
        echo -e "${GREEN}✓ HTTPS accessible (HTTP $ssl_response)${NC}"
    elif [ "$ssl_response" = "000" ]; then
        echo -e "${RED}✗ Connection failed - domain not reachable${NC}"
    else
        echo -e "${YELLOW}⚠ HTTPS returns HTTP $ssl_response${NC}"
    fi
    
    # Check SSL certificate
    ssl_info=$(curl -s -I --connect-timeout $TIMEOUT "$DOMAIN" 2>&1)
    if echo "$ssl_info" | grep -q "SSL certificate problem"; then
        echo -e "${RED}✗ SSL certificate issue detected${NC}"
    elif echo "$ssl_info" | grep -q "HTTP/"; then
        echo -e "${GREEN}✓ SSL certificate appears valid${NC}"
    fi
    
    echo ""
}

# Function to check robots.txt
check_robots() {
    echo -e "${BOLD}${BLUE}3. Robots.txt Check${NC}"
    robots_url="$DOMAIN/robots.txt"
    echo "Testing URL: $robots_url"
    
    robots_response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$robots_url" 2>/dev/null)
    
    if [ "$robots_response" = "200" ]; then
        echo -e "${GREEN}✓ robots.txt is accessible${NC}"
        
        # Check content
        robots_content=$(curl -s --connect-timeout $TIMEOUT "$robots_url" 2>/dev/null)
        
        # Check for bot restrictions
        if echo "$robots_content" | grep -q "Disallow: /"; then
            echo -e "${YELLOW}⚠ Warning: robots.txt contains 'Disallow: /' which blocks all crawlers${NC}"
        fi
        
        # Check for specific bot allowances
        if echo "$robots_content" | grep -qi "Googlebot"; then
            echo -e "${GREEN}✓ robots.txt mentions Googlebot${NC}"
        else
            echo -e "${YELLOW}⚠ robots.txt does not explicitly mention Googlebot${NC}"
        fi
        
        if echo "$robots_content" | grep -qi "AdsBot-Google"; then
            echo -e "${GREEN}✓ robots.txt mentions AdsBot-Google${NC}"
        else
            echo -e "${YELLOW}⚠ robots.txt does not mention AdsBot-Google${NC}"
        fi
        
        if echo "$robots_content" | grep -qi "GPTBot\|ChatGPT"; then
            echo -e "${GREEN}✓ robots.txt mentions AI crawlers (GPTBot/ChatGPT)${NC}"
        else
            echo -e "${YELLOW}⚠ robots.txt does not mention AI crawlers${NC}"
        fi
        
    elif [ "$robots_response" = "404" ]; then
        echo -e "${YELLOW}⚠ robots.txt not found (404) - this is actually fine for most crawlers${NC}"
    else
        echo -e "${RED}✗ robots.txt not accessible (HTTP $robots_response)${NC}"
    fi
    
    echo ""
}

# Function to check ads.txt
check_ads_txt() {
    echo -e "${BOLD}${BLUE}4. AdSense ads.txt Check${NC}"
    ads_txt_url="$DOMAIN/ads.txt"
    echo "Testing URL: $ads_txt_url"
    
    ads_response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$ads_txt_url" 2>/dev/null)
    
    if [ "$ads_response" = "200" ]; then
        echo -e "${GREEN}✓ ads.txt is accessible${NC}"
        
        # Check content
        ads_content=$(curl -s --connect-timeout $TIMEOUT "$ads_txt_url" 2>/dev/null)
        echo "Content: $ads_content"
        
        if echo "$ads_content" | grep -q "google.com.*pub-"; then
            echo -e "${GREEN}✓ ads.txt contains valid Google AdSense entry${NC}"
        else
            echo -e "${RED}✗ ads.txt does not contain valid Google AdSense entry${NC}"
        fi
        
        # Check for trailing whitespace
        if echo "$ads_content" | grep -q '[[:space:]]$'; then
            echo -e "${YELLOW}⚠ Warning: ads.txt contains trailing whitespace${NC}"
        else
            echo -e "${GREEN}✓ ads.txt has clean format${NC}"
        fi
        
    elif [ "$ads_response" = "404" ]; then
        echo -e "${YELLOW}⚠ ads.txt not found (404) - required for AdSense verification${NC}"
    else
        echo -e "${RED}✗ ads.txt not accessible (HTTP $ads_response)${NC}"
    fi
    
    echo ""
}

# Function to check general site accessibility
check_site_accessibility() {
    echo -e "${BOLD}${BLUE}5. General Site Accessibility${NC}"
    echo "Testing main site: $DOMAIN"
    
    # Check if main site is accessible
    site_response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$DOMAIN" 2>/dev/null)
    site_time=$(curl -s -o /dev/null -w "%{time_total}" --connect-timeout $TIMEOUT "$DOMAIN" 2>/dev/null)
    
    if [ "$site_response" = "200" ]; then
        echo -e "${GREEN}✓ Site is accessible (HTTP $site_response) - Load time: ${site_time}s${NC}"
        
        # Check for common hosting/CDN headers
        headers=$(curl -s -I --connect-timeout $TIMEOUT "$DOMAIN" 2>/dev/null)
        
        if echo "$headers" | grep -qi "cloudflare"; then
            echo -e "${CYAN}ℹ Site appears to use Cloudflare${NC}"
        fi
        
        if echo "$headers" | grep -qi "netlify"; then
            echo -e "${CYAN}ℹ Site appears to use Netlify${NC}"
        fi
        
        if echo "$headers" | grep -qi "vercel"; then
            echo -e "${CYAN}ℹ Site appears to use Vercel${NC}"
        fi
        
    elif [ "$site_response" = "000" ]; then
        echo -e "${RED}✗ Site is not accessible - Connection failed${NC}"
    else
        echo -e "${YELLOW}⚠ Site returns HTTP $site_response${NC}"
    fi
    
    echo ""
}

# Function to check for AdSense implementation
check_adsense_implementation() {
    echo -e "${BOLD}${BLUE}6. AdSense Implementation Check${NC}"
    
    page_content=$(curl -s --connect-timeout $TIMEOUT "$DOMAIN" 2>/dev/null)
    
    if [ -n "$page_content" ]; then
        # Check for AdSense script
        if echo "$page_content" | grep -q "pagead2.googlesyndication.com"; then
            echo -e "${GREEN}✓ AdSense script found in page source${NC}"
        else
            echo -e "${RED}✗ AdSense script not found in page source${NC}"
        fi
        
        # Check for AdSense meta tag
        if echo "$page_content" | grep -q "google-adsense-account"; then
            echo -e "${GREEN}✓ AdSense meta tag found${NC}"
        else
            echo -e "${RED}✗ AdSense meta tag not found${NC}"
        fi
        
        # Check for publisher ID
        pub_id=$(echo "$page_content" | grep -o 'ca-pub-[0-9]*' | head -1)
        if [ -n "$pub_id" ]; then
            echo -e "${GREEN}✓ Publisher ID found: $pub_id${NC}"
        else
            echo -e "${RED}✗ No publisher ID found${NC}"
        fi
    else
        echo -e "${RED}✗ Could not retrieve page content${NC}"
    fi
    
    echo ""
}

# Function to provide troubleshooting tips
provide_troubleshooting_tips() {
    echo -e "${BOLD}${BLUE}7. Troubleshooting Tips${NC}"
    echo ""
    echo -e "${BOLD}If AI tools (ChatGPT, OpenAI) can't access your site:${NC}"
    echo "• Check if DNS A/AAAA/CNAME records are properly configured"
    echo "• Ensure HTTPS is working with a valid SSL certificate"
    echo "• Verify the site loads in a private/incognito browser window"
    echo "• Check if Cloudflare or CDN settings are blocking crawlers"
    echo "• Test from different networks (mobile/LTE to bypass local cache)"
    echo ""
    echo -e "${BOLD}If Google AdSense verification fails:${NC}"
    echo "• Ensure ads.txt is accessible at https://yourdomain.com/ads.txt"
    echo "• Check that robots.txt allows Googlebot and AdsBot-Google"
    echo "• Verify AdSense script is properly implemented in page source"
    echo "• Wait 24-48 hours after implementation for Google to detect changes"
    echo "• Check Google AdSense console for specific error messages"
    echo ""
    echo -e "${BOLD}Quick external checks you can do:${NC}"
    echo "• DNS checker: https://dnschecker.org"
    echo "• SSL checker: https://www.ssllabs.com/ssltest/"
    echo "• Site accessibility: Try accessing from mobile/LTE connection"
    echo "• Cloudflare settings: Check firewall rules if using Cloudflare"
    echo ""
}

# Main execution
main() {
    check_dns
    check_ssl
    check_robots
    check_ads_txt
    check_site_accessibility
    check_adsense_implementation
    provide_troubleshooting_tips
    
    echo -e "${BOLD}${BLUE}=== Verification Complete ===${NC}"
    echo ""
    echo -e "${CYAN}Usage: $0 [domain]${NC}"
    echo -e "${CYAN}Example: $0 https://fltwht.com${NC}"
    echo ""
}

# Run the script
main