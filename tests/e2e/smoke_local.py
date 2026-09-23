from playwright.sync_api import sync_playwright
from pathlib import Path
import mimetypes, urllib.parse
ROOT=Path('.').resolve()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=b.new_page(viewport={"width":1440,"height":1000})
    errors=[]; page.on('pageerror',lambda e: errors.append(str(e)))
    def handler(route):
        u=urllib.parse.urlparse(route.request.url)
        path=urllib.parse.unquote(u.path.lstrip('/')) or 'index.html'
        f=(ROOT/path).resolve()
        if ROOT not in f.parents and f!=ROOT: return route.abort()
        if f.is_dir(): f=f/'index.html'
        if not f.exists(): return route.fulfill(status=404,body='not found')
        ctype=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
        return route.fulfill(status=200,body=f.read_bytes(),content_type=ctype)
    page.route('**/*',handler)
    page.goto('https://wave.local/',wait_until='networkidle')
    assert 'University for Exceptional Crypto Analysts' in page.locator('body').inner_text()
    page.click('button[data-route="curriculum"]'); page.wait_for_timeout(150)
    assert 'מפת הקורס' in page.locator('body').inner_text()
    page.click('button[data-route="level/0"]'); page.wait_for_timeout(150)
    assert 'LECTURE 0' in page.locator('body').inner_text()
    page.click('button[data-route="topic/0/0"]'); page.wait_for_timeout(150)
    assert 'PROFESSOR LECTURE' in page.locator('body').inner_text()
    page.click('button[data-route="cases"]'); page.wait_for_timeout(150)
    assert 'Practice Lab' in page.locator('body').inner_text()
    assert not errors, errors
    print('E2E OK')
    b.close()
