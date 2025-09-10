from playwright.sync_api import sync_playwright, Page, expect

def handle_console_message(msg):
    print(f"Browser Console: {msg.type} {msg.text}")

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console messages
        page.on("console", handle_console_message)

        # 1. Navigate to the poses library page.
        page.goto("http://localhost:3000/poses")

        # 2. Wait for the pose cards to appear or for an error message.
        try:
            # Check for the successful loading of a pose
            expect(page.get_by_role("heading", name="Child's Pose")).to_be_visible(timeout=15000)
            print("Verification successful: Poses loaded.")
        except Exception as e:
            print(f"Verification failed: {e}")
            # If poses don't load, take a screenshot of the current state for debugging
            page.screenshot(path="jules-scratch/verification/poses_error.png")
            raise # Re-raise the exception to fail the script

        # 3. Take a screenshot for visual verification if successful.
        page.screenshot(path="jules-scratch/verification/poses_loaded.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
