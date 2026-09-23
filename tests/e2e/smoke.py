from playwright.sync_api import sync_playwright
import sys
url=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4173/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=b.new_page(viewport={"width":1440,"height":1000})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto(url,wait_until='networkidle')
    assert 'University for Exceptional Crypto Analysts' in page.locator('body').inner_text()
    page.click('button[data-route="curriculum"]'); page.wait_for_timeout(200)
    assert 'מפת הקורס' in page.locator('body').inner_text()
    page.click('button[data-route="level/0"]'); page.wait_for_timeout(200)
    assert 'LECTURE 0' in page.locator('body').inner_text()
    page.click('button[data-route="topic/0/0"]'); page.wait_for_timeout(200)
    assert 'PROFESSOR LECTURE' in page.locator('body').inner_text()
    page.click('button[data-route="cases"]'); page.wait_for_timeout(200)
    assert 'Practice Lab' in page.locator('body').inner_text()
    assert not errors, errors
    print('E2E OK')
    b.close()
