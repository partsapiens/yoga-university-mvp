#!/bin/bash

# Domain Diagnostics Menu
# Interactive menu for running domain accessibility and AdSense verification tools

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default domain
DEFAULT_DOMAIN="https://fltwht.com"

show_menu() {
    clear
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║                  Domain Diagnostics Menu                    ║${NC}"
    echo -e "${BOLD}${BLUE}║              Troubleshoot fltwht.com Access Issues          ║${NC}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Choose a diagnostic tool:${NC}"
    echo ""
    echo -e "${YELLOW}1)${NC} ${GREEN}Comprehensive Domain Check${NC} - Full diagnostic (recommended first step)"
    echo -e "${YELLOW}2)${NC} ${GREEN}fltwht.com Specific Check${NC} - Tailored diagnostic with guided solutions"
    echo -e "${YELLOW}3)${NC} ${GREEN}AdSense Verification${NC} - Check AdSense implementation and accessibility"
    echo -e "${YELLOW}4)${NC} ${GREEN}Custom Domain Check${NC} - Check any domain you specify"
    echo -e "${YELLOW}5)${NC} ${CYAN}View Documentation${NC} - Open troubleshooting guides"
    echo -e "${YELLOW}6)${NC} ${CYAN}Test All Tools${NC} - Run integration test"
    echo -e "${YELLOW}7)${NC} ${RED}Exit${NC}"
    echo ""
    echo -e "${BLUE}Current default domain: ${YELLOW}$DEFAULT_DOMAIN${NC}"
    echo ""
}

get_custom_domain() {
    echo ""
    echo -e "${CYAN}Enter domain to check (include https://):${NC}"
    read -p "Domain: " custom_domain
    
    if [ -z "$custom_domain" ]; then
        echo -e "${RED}No domain entered. Using default: $DEFAULT_DOMAIN${NC}"
        custom_domain="$DEFAULT_DOMAIN"
    fi
    
    echo ""
}

run_comprehensive_check() {
    echo -e "${BOLD}${GREEN}Running Comprehensive Domain Check...${NC}"
    echo -e "${CYAN}This checks DNS, SSL, robots.txt, ads.txt, and more${NC}"
    echo ""
    ./scripts/verify-domain-access.sh "$DEFAULT_DOMAIN"
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

run_fltwht_check() {
    echo -e "${BOLD}${GREEN}Running fltwht.com Specific Diagnostic...${NC}"
    echo -e "${CYAN}This provides guided troubleshooting for fltwht.com issues${NC}"
    echo ""
    ./scripts/check-fltwht-access.sh
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

run_adsense_check() {
    echo -e "${BOLD}${GREEN}Running AdSense Verification...${NC}"
    echo -e "${CYAN}This checks AdSense implementation and crawler access${NC}"
    echo ""
    ./scripts/verify-adsense.sh "$DEFAULT_DOMAIN"
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

run_custom_check() {
    get_custom_domain
    echo -e "${BOLD}${GREEN}Running Comprehensive Check for: $custom_domain${NC}"
    echo ""
    ./scripts/verify-domain-access.sh "$custom_domain"
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

view_documentation() {
    echo -e "${BOLD}${GREEN}Available Documentation:${NC}"
    echo ""
    echo -e "${CYAN}1. DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md${NC} - Complete troubleshooting guide"
    echo -e "${CYAN}2. scripts/README.md${NC} - Script usage documentation"
    echo -e "${CYAN}3. ADSENSE_IMPLEMENTATION.md${NC} - AdSense implementation guide"
    echo -e "${CYAN}4. ADSENSE_DOMAIN_CONFIG.md${NC} - Domain configuration guide"
    echo ""
    echo -e "${YELLOW}Which document would you like to view? (1-4, or press Enter to return):${NC}"
    read doc_choice
    
    case $doc_choice in
        1)
            if command -v less >/dev/null 2>&1; then
                less DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md
            else
                cat DOMAIN_ACCESSIBILITY_TROUBLESHOOTING.md
                echo ""
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
            fi
            ;;
        2)
            if command -v less >/dev/null 2>&1; then
                less scripts/README.md
            else
                cat scripts/README.md
                echo ""
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
            fi
            ;;
        3)
            if command -v less >/dev/null 2>&1; then
                less ADSENSE_IMPLEMENTATION.md
            else
                cat ADSENSE_IMPLEMENTATION.md
                echo ""
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
            fi
            ;;
        4)
            if command -v less >/dev/null 2>&1; then
                less ADSENSE_DOMAIN_CONFIG.md
            else
                cat ADSENSE_DOMAIN_CONFIG.md
                echo ""
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
            fi
            ;;
        *)
            echo -e "${CYAN}Returning to main menu...${NC}"
            ;;
    esac
}

run_integration_test() {
    echo -e "${BOLD}${GREEN}Running Integration Test...${NC}"
    echo -e "${CYAN}This tests all verification tools to ensure they work correctly${NC}"
    echo ""
    ./scripts/test-verification-tools.sh
    
    echo ""
    echo -e "${YELLOW}Press Enter to continue...${NC}"
    read
}

main() {
    while true; do
        show_menu
        echo -e "${CYAN}Enter your choice (1-7):${NC}"
        read -p "Choice: " choice
        
        case $choice in
            1)
                run_comprehensive_check
                ;;
            2)
                run_fltwht_check
                ;;
            3)
                run_adsense_check
                ;;
            4)
                run_custom_check
                ;;
            5)
                view_documentation
                ;;
            6)
                run_integration_test
                ;;
            7)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please enter 1-7.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Check if scripts exist
if [ ! -f "scripts/verify-domain-access.sh" ] || [ ! -f "scripts/check-fltwht-access.sh" ] || [ ! -f "scripts/verify-adsense.sh" ]; then
    echo -e "${RED}Error: Required scripts not found in scripts/ directory${NC}"
    echo -e "${YELLOW}Please ensure you're running this from the project root directory${NC}"
    exit 1
fi

# Make sure scripts are executable
chmod +x scripts/*.sh 2>/dev/null

# Run main menu
main