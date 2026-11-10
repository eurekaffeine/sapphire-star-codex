const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const dist = path.resolve('.vitepress/dist');
const output = path.resolve(process.env.SSC_UX_AUDIT_OUTPUT || '.codex/audit-evidence/website-china-ux');
const base = '/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml'};
const report = { pages: [], checks: [], errors: [] };

// Serve the current build without retaining an old preview server's asset index.
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) throw new Error('Outside site base');
    let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)));
    if (file !== dist && !file.startsWith(dist + path.sep)) throw new Error('Outside site root');
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

async function inspect(page, name) {
  const result = await page.evaluate(() => {
    const text = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      if (!node.textContent.trim() || !element?.checkVisibility({opacityProperty:true,visibilityProperty:true})) continue;
      const style = getComputedStyle(element);
      text.push({text: node.textContent.trim().slice(0, 70), size: parseFloat(style.fontSize), family: style.fontFamily, style: style.fontStyle});
    }
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight, sizes: [...new Set(text.map(t => t.size))], text };
  });
  report.pages.push({name, ...result});
  assert(result.scrollWidth <= result.width + 1, `${name}: horizontal overflow`);
  assert(result.sizes.length <= 4, `${name}: extra font sizes ${result.sizes}`);
  const invalid = result.text.filter(t => ![14, 16, 24, 40].includes(t.size) || t.style === 'italic' || /Instrument Serif|Space Grotesk|Bricolage|Georgia|monospace/i.test(t.family));
  assert.deepEqual(invalid, [], `${name}: inconsistent typography`);
}

async function assertSelected(page, key) {
  assert.equal(await page.locator('[role="tab"][aria-selected="true"]').count(), 1);
  assert.equal(await page.locator(`#feature-tab-${key}`).getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
  assert(await page.locator(`#feature-panel-${key}`).isVisible());
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}${base}`;
  const browser = await chromium.launch({headless:true, channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome'});
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    for (const locale of ['']) {
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({width, height: width > 900 ? 1000 : 844});
        await page.goto(origin + locale, {waitUntil:'networkidle'});
        const name = `${locale || 'zh-Hans/'}${width}`;
        assert.equal(await page.getByRole('tab').count(), 5);
        assert.equal(await page.locator('.VPNavBarTitle .title').innerText(), '苍蓝星图鉴');
        for (const key of ['home','hitzones','weapon','builder','saved']) {
          await page.locator(`#feature-tab-${key}`).click();
          await assertSelected(page, key);
          const captions = page.locator(`#feature-panel-${key} figcaption`);
          assert.equal(await captions.count(), 0, `${name}/${key}: unexpected screenshot caption`);
          const image = page.locator(`#feature-panel-${key} img`);
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(image => image.decode());
          const source = await image.getAttribute('src');
          const language = 'zh-Hans';
          assert.equal(source, `${base}screenshots/${language}/${key}.webp`);
          assert.equal(await image.getAttribute('data-screenshot-language'), language);
          assert.equal(await image.getAttribute('data-device-frame'), 'iPhone 18 Pro');
          assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [660, 1317]);
          for (const hero of await page.locator('.ssc-hero-device img').all()) {
            assert.equal(await hero.getAttribute('data-screenshot-language'), language);
            assert.equal(await hero.getAttribute('data-device-frame'), 'iPhone 18 Pro');
            assert((await hero.getAttribute('src')).startsWith(`${base}screenshots/${language}/`));
          }
          await inspect(page, `${name}/${key}`);
        }
        const tabSizes = await page.getByRole('tab').evaluateAll(tabs => tabs.map(tab => ({width:tab.getBoundingClientRect().width,height:tab.getBoundingClientRect().height})));
        assert(tabSizes.every(size => size.width >= 44 && size.height >= 44), `${name}: small tab target`);
        if (width <= 700) {
          await page.locator('#feature-tab-home').click();
          const controls = page.locator('.ssc-gallery-controls button');
          assert(await controls.nth(0).isDisabled());
          await controls.nth(1).scrollIntoViewIfNeeded();
          const scrollBefore = await page.evaluate(() => scrollY);
          for (const key of ['hitzones','weapon','builder','saved']) {
            await controls.nth(1).click(); await assertSelected(page,key);
            assert(Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) <= 2, `${name}/${key}: gallery navigation jumped the page`);
            const contained = await page.locator('[role="tab"][aria-selected="true"]').evaluate(tab => {
              const bounds=tab.getBoundingClientRect(), track=tab.parentElement.getBoundingClientRect();
              return bounds.left >= track.left - 1 && bounds.right <= track.right + 1;
            });
            assert(contained, `${name}: selected tab is clipped`);
          }
          assert(await controls.nth(1).isDisabled());
          assert(Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) <= 2, `${name}: gallery navigation jumped the page`);
          await controls.nth(0).click(); await assertSelected(page,'builder');
        }
        await page.locator('#feature-tab-home').click();
        await page.locator('#feature-tab-home').press('ArrowRight');
        await assertSelected(page, 'hitzones');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'feature-tab-hitzones');
        await page.keyboard.press('End'); await assertSelected(page, 'saved');
        await page.keyboard.press('ArrowRight'); await assertSelected(page, 'home');
        await page.keyboard.press('ArrowLeft'); await assertSelected(page, 'saved');
        await page.keyboard.press('Home'); await assertSelected(page, 'home');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'feature-panel-home');
        await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
        await assertSelected(page, 'home');
        await page.locator('h1').click();
        await page.evaluate(() => scrollTo(0, 0));
        if ([1440, 390].includes(width)) {
          const file = `${locale ? locale.slice(0,-1) : 'zh-hans'}-${width}.png`;
          await page.screenshot({path:path.join(output,file),fullPage:true});
        }
      }
    }
    report.checks.push('All five gallery topics, keyboard wrap/Home/End/Tab, uniform iPhone framing, matching-language iOS hero/gallery sources, no obsolete source captions and no scroll-driven selection in Simplified Chinese at 320, 390, 768 and 1440px.');

    for (const locale of ['']) {
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({width,height:width>900?1000:844});
        for (const route of ['faq/','others/','support/','privacy/']) {
          await page.goto(origin+locale+route,{waitUntil:'networkidle'});
          const name = `${locale}${route}${width}`;
          await inspect(page,name);
          const text = await page.locator('.vp-doc').innerText();
          assert(!/还不行|还没|看看|就能|不用重新找|伴侶應用程式|付費牆|回退至|这份政策|這份政策|你的|你寄/.test(text),`${name}: retired copy remains`);
          const overflow = await page.locator('.vp-doc :is(h1,h2,h3,p,li)').evaluateAll(elements => elements.filter(element=>element.scrollWidth>element.clientWidth+1).map(element=>element.textContent));
          assert.deepEqual(overflow,[],`${name}: overflowing document text`);
          if (route==='privacy/') {
            assert.match(text,/2026 年 10 月 31 日/);
            assert.match(text,/2026 年 11 月 10 日/);
            assert.match(text,/HTTPS/);
            assert.equal(await page.locator('.vp-doc a[href="mailto:eurekaffeine.work@gmail.com"]').count(),2);
          }
          if (width===390 && ['privacy/', 'support/'].includes(route)) await page.screenshot({path:path.join(output,`zh-hans-${route.slice(0,-1)}-mobile.png`),fullPage:true});
        }
      }
    }
    report.checks.push('Chinese FAQ, About, support and privacy pages at 320, 390, 768 and 1440px: professional copy, no document text overflow, policy effective/update dates and contact links preserved.');

    await page.setViewportSize({width:1440,height:1000});
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.getByRole('switch',{name:'切换到深色模式'}).click();
    await page.reload({waitUntil:'networkidle'});
    assert(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
    await inspect(page,'dark/desktop');
    await page.screenshot({path:path.join(output,'zh-hans-dark.png'),fullPage:true});
    await page.getByRole('switch',{name:'切换到浅色模式'}).click();
    report.checks.push('Light/dark switch and persistence across reload.');

    assert.equal(await page.locator('.VPNavBarTranslations, .VPNavScreenTranslations').count(), 0);
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-Hans');
    const globalLink = page.locator('.VPNavBarMenu').getByRole('link', {name:'国际版', exact:true});
    assert.equal(await globalLink.getAttribute('href'), 'https://eurekaffeine.github.io/sapphire-star-codex/');
    await page.locator('.VPNavBarMenu').getByRole('link', {name:'常见问题', exact:true}).click();
    await page.waitForURL('**/faq/');
    report.checks.push('Single Chinese locale, no language switcher, global site link and root FAQ navigation.');

    await page.goto(origin,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'搜索帮助',exact:true}).click();
    await page.locator('#localsearch-input').fill('离线');
    await page.locator('.VPLocalSearchBox [role="option"]').first().waitFor();
    await inspect(page,'search/results');
    await page.screenshot({path:path.join(output,'search.png')});
    await page.locator('.VPLocalSearchBox [role="option"]').first().click();
    await page.waitForURL('**/faq/**');
    await page.getByRole('button',{name:'搜索帮助',exact:true}).click();
    await page.locator('#localsearch-input').fill('装饰品');
    await page.locator('.VPLocalSearchBox [role="option"]').first().waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#localsearch-input').count(),0);
    report.checks.push('Chinese local search finds 离线 and 装饰品 within prose, opens the FAQ result and closes with Escape.');

    await page.setViewportSize({width:390,height:844});
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'mobile navigation'}).click();
    assert.equal(await page.getByRole('button',{name:'mobile navigation'}).getAttribute('aria-expanded'),'true');
    await page.waitForFunction(() => { const menu = document.querySelector('.VPNavScreen'); return menu && getComputedStyle(menu).opacity === '1'; });
    await inspect(page,'mobile/menu');
    await page.screenshot({path:path.join(output,'mobile-menu.png')});
    assert.equal(await page.locator('.VPNavScreenTranslations').count(), 0);
    assert(await page.locator('.VPNavScreen').getByRole('link',{name:'国际版',exact:true}).isVisible());
    await page.locator('.VPNavScreen').getByRole('link',{name:'下载',exact:true}).click();
    await page.waitForURL('**/#download');
    await page.locator('.VPNavBarHamburger[aria-expanded="false"]').waitFor();
    report.checks.push('Chinese mobile menu opens/closes, links to the global site and navigates to downloads.');

    await page.setViewportSize({width:1440,height:1000});
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.emulateMedia({reducedMotion:'no-preference'});
    const feedback = await page.locator('#feature-tab-home').evaluate(tab => getComputedStyle(tab).transitionDuration);
    assert(feedback.split(',').every(value => parseFloat(value) <= .16));
    assert(feedback.split(',').some(value => parseFloat(value) > 0));
    await page.emulateMedia({reducedMotion:'reduce'});
    const reduced = await page.locator('#feature-tab-home').evaluate(tab => getComputedStyle(tab).transitionDuration);
    assert(reduced.split(',').every(value => parseFloat(value) === 0));
    report.checks.push('Grouped tab targets are at least 44px; mobile arrows honor bounds, keep selection visible and do not jump the page; brief control feedback respects reduced motion.');

    const touchContext = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    const touchPage = await touchContext.newPage();
    touchPage.on('pageerror', error => report.errors.push(error.message));
    await touchPage.goto(origin,{waitUntil:'networkidle'});
    const cdp = await touchContext.newCDPSession(touchPage);
    async function gesture(x1,y1,x2,y2) {
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});
      for (let step=1;step<=6;step++) {
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*step/6,y:y1+(y2-y1)*step/6}]});
        await new Promise(resolve=>setTimeout(resolve,25));
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }
    const phone = touchPage.locator('#feature-panel-home .ssc-phone');
    await phone.scrollIntoViewIfNeeded();
    let box = await phone.boundingBox();
    const beforeSwipe = await touchPage.evaluate(()=>scrollY);
    await gesture(box.x+box.width*.8,box.y+box.height*.45,box.x+box.width*.2,box.y+box.height*.45);
    await touchPage.locator('#feature-panel-hitzones').waitFor({state:'visible'});
    await assertSelected(touchPage,'hitzones');
    assert(Math.abs((await touchPage.evaluate(()=>scrollY))-beforeSwipe)<=2);
    box = await touchPage.locator('#feature-panel-hitzones .ssc-phone').boundingBox();
    await gesture(box.x+box.width*.2,box.y+box.height*.45,box.x+box.width*.8,box.y+box.height*.45);
    await touchPage.locator('#feature-panel-home').waitFor({state:'visible'});
    await assertSelected(touchPage,'home');
    box = await phone.boundingBox();
    const beforeScroll = await touchPage.evaluate(()=>scrollY);
    await gesture(box.x+box.width*.5,box.y+box.height*.65,box.x+box.width*.5,box.y+box.height*.25);
    await touchPage.waitForFunction(before=>scrollY>before+20,beforeScroll);
    await assertSelected(touchPage,'home');
    assert((await phone.evaluate(element=>getComputedStyle(element).touchAction)).includes('pinch-zoom'));
    await inspect(touchPage,'touch/gallery');
    await touchContext.close();
    report.checks.push('Native browser touch input: left/right screenshot swipes switch features, vertical swipes scroll the page without changing selection, and pinch zoom remains allowed.');

    const paymentManifest = JSON.parse(await fs.readFile(path.join(dist, 'support/manifest.json'), 'utf8'));
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(origin+'support/',{waitUntil:'networkidle'});
    for (const payment of paymentManifest.assets) {
      const card = page.locator(`[data-payment="${payment.provider}"]`);
      const image = card.locator('img');
      await image.evaluate(img=>img.decode());
      assert.deepEqual(await image.evaluate(img=>[img.naturalWidth,img.naturalHeight]),[payment.width,payment.height]);
      const downloadPromise = page.waitForEvent('download');
      await card.locator('a[download]').click();
      const download = await downloadPromise;
      assert.equal(download.suggestedFilename(), payment.file);
      assert.deepEqual(await fs.readFile(await download.path()), await fs.readFile(path.join(dist,'support',payment.file)));
    }
    await page.screenshot({path:path.join(output,'zh-hans-support-desktop.png'),fullPage:true});
    await page.getByRole('switch',{name:'切换到深色模式'}).click();
    await page.setViewportSize({width:390,height:844});
    await inspect(page,'support/dark/mobile');
    await page.screenshot({path:path.join(output,'zh-hans-support-dark.png'),fullPage:true});
    report.checks.push('Both China QR images decode at original dimensions and browser download returns identical JPEG bytes; support reviewed on desktop/mobile and in dark mode.');

    assert.deepEqual(report.errors,[]);
    console.log(`UX audit passed: ${report.pages.length} rendered states. ${report.checks.length} interaction groups. No page or asset errors.`);
  } finally {
    const compact = { ...report, pages: report.pages.map(({ text, ...state }) => ({ ...state, families: [...new Set(text.map(item => item.family))] })) };
    await fs.writeFile(path.join(output,'results.json'),JSON.stringify(compact,null,2)+'\n');
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
