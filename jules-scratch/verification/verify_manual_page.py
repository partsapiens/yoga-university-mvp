from playwright.sync_api import sync_playwright, Page

def run(page: Page):
    # This test verifies that the manual page is rendered correctly.

    # 1. Arrange: Go to the manual page.
    page.goto("http://localhost:3000/manual")

    # 2. Wait for the page to load
    page.wait_for_selector('h1')

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run(page)
        browser.close()

if __name__ == "__main__":
    main()
