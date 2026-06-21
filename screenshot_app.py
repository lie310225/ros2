from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:7777')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/workspace/finance_app_preview.png', full_page=True)
    print("Screenshot saved to /workspace/finance_app_preview.png")
    browser.close()
