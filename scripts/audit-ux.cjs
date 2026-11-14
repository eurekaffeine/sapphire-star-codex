const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const china = Object.hasOwn(require('../.vitepress/theme/store-links.json'), 'androidChina');
const base = china ? '/' : '/sapphire-star-codex/';
const localeMetadata = china ? null : require('../.vitepress/theme/locales.json');
const locales = china ? [''] : Object.values(localeMetadata).map(locale => locale.path.slice(1));
const topics = ['home', 'hitzones', 'weapon', 'builder', 'saved'];
const root = path.resolve('.vitepress/dist');
const output = path.resolve(process.env.SSC_UX_AUDIT_OUTPUT || `.codex/audit-evidence/${china ? 'china-' : ''}pocket-scaffold`);
const report = { states: [], checks: [], errors: [] };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    assert(url.pathname.startsWith(base));
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    assert(file === root || file.startsWith(root + path.sep));
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
const metadataFor = locale => china ? {dir:'ltr',lang:'zh-Hans',screenshotLanguage:'zh-Hans'} : Object.values(localeMetadata).find(item => item.path === '/' + locale);
const languageFor = locale => metadataFor(locale).screenshotLanguage;

async function inspect(page, name) {
  const state = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    background: document.querySelector('.ssc-site') ? getComputedStyle(document.querySelector('.ssc-site')).backgroundColor : null,
  }));
  assert(state.width <= state.viewport + 1, `${name}: horizontal overflow ${state.width}/${state.viewport}`);
  report.states.push({ name, ...state });
}

async function assertFeature(page, key, language) {
  await page.waitForFunction(key => document.querySelector('.ssc-story')?.getAttribute('data-active-feature') === key, key);
  if (await page.locator('.ssc-carousel-controls').isVisible()) {
    await page.waitForFunction(key => {
      const track = document.querySelector('.ssc-chapters').getBoundingClientRect();
      const card = document.getElementById(`feature-chapter-${key}`).getBoundingClientRect();
      return Math.abs(track.left - card.left) < 2;
    }, key);
  }
  const image = page.locator(`.ssc-phone img[data-feature-image="${key}"]`);
  assert(await image.isVisible());
  assert.equal(await page.locator('.ssc-phone img:visible').count(), 1);
  await image.evaluate(img => img.decode());
  assert.equal(await image.getAttribute('src'), `${base}screenshots/${language}/${key}.webp`);
  assert.equal(await image.getAttribute('data-device-frame'), 'iPhone 18 Pro');
  assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [660, 1317]);
}

async function centerChapter(page, key) {
  await page.locator(`#feature-chapter-${key}`).evaluate(el => {
    const box = el.getBoundingClientRect();
    scrollTo({ top: scrollY + box.top + box.height / 2 - innerHeight * 0.55, behavior: 'instant' });
  });
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}${base}`;
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce', colorScheme: 'light' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    for (const locale of locales) {
      const language = languageFor(locale);
      const rtl = metadataFor(locale).dir === 'rtl';
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: width > 1024 ? 1000 : 844 });
        await page.goto(origin + locale, { waitUntil: 'networkidle' });
        const name = `${language}/${width}`;
        assert.equal(await page.locator('html').getAttribute('dir'), rtl ? 'rtl' : 'ltr');
        assert.equal(await page.locator('.ssc-site').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
        assert.equal(await page.locator('.ssc-button.primary').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(184, 83, 58)');
        assert.equal(await page.locator('.ssc-hero-device img').count(), 3);
        assert.equal(await page.locator('.ssc-chapters article').count(), 5);
        assert.equal(await page.locator('.ssc-landing-page .VPLocalNav:visible').count(), 0);
        for (const image of await page.locator('.ssc-hero-device img').all()) {
          await image.evaluate(img => img.decode());
          assert.equal(await image.getAttribute('data-screenshot-language'), language);
          assert.equal(await image.getAttribute('data-device-frame'), 'iPhone 18 Pro');
          assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [660, 1317]);
        }
        const stack = await page.locator('.ssc-hero-visual').evaluate(el => {
          const box = el.getBoundingClientRect();
          const center = el.querySelector('.device-center').getBoundingClientRect();
          const left = el.querySelector('.device-left').getBoundingClientRect();
          const right = el.querySelector('.device-right').getBoundingClientRect();
          return { centered: Math.abs(box.left + box.width / 2 - innerWidth / 2) < 2,
            overlapped: left.right > center.left && center.right > right.left,
            foreground: center.top < left.top && center.top < right.top && center.width > left.width };
        });
        assert(stack.centered && stack.overlapped && stack.foreground, `${name}: three-phone composition changed`);
        if ([1440, 390].includes(width)) await page.locator('.ssc-hero').screenshot({ path: path.join(output, `${language}-hero-${width}.png`) });

        if (width > 1024) {
          assert.equal(await page.locator('.ssc-phone').evaluate(el => getComputedStyle(el).position), 'sticky');
          for (const key of topics) {
            await centerChapter(page, key);
            await assertFeature(page, key, language);
            await inspect(page, `${name}/scroll/${key}`);
          }
          await page.locator('#feature-chapter-home').focus();
          await assertFeature(page, 'home', language);
          await page.keyboard.press('Tab');
          await assertFeature(page, 'hitzones', language);
          await page.locator('#feature-chapter-hitzones').press('ArrowDown');
          await assertFeature(page, 'weapon', language);
          assert.equal(await page.evaluate(() => document.activeElement.id), 'feature-chapter-weapon');
          await centerChapter(page, 'hitzones');
          await page.screenshot({ path: path.join(output, `${language}-story-desktop.png`) });
        } else {
          const controls = page.locator('.ssc-carousel-controls');
          await controls.scrollIntoViewIfNeeded();
          const arrows = controls.locator('.ssc-carousel-arrow');
          const dots = controls.locator('.ssc-carousel-dots button');
          assert(await arrows.first().isDisabled());
          const before = await page.evaluate(() => scrollY);
          for (let index = 0; index < topics.length; index++) {
            await dots.nth(index).click();
            await assertFeature(page, topics[index], language);
            assert(Math.abs(await page.evaluate(() => scrollY) - before) <= 2, `${name}: selection moved page`);
            await inspect(page, `${name}/carousel/${topics[index]}`);
          }
          assert(await arrows.last().isDisabled());
          await arrows.first().click();
          await assertFeature(page, 'builder', language);
          await dots.first().press('Home');
          await assertFeature(page, 'home', language);
          await dots.first().press('End');
          await assertFeature(page, 'saved', language);
          await dots.last().press(rtl ? 'ArrowRight' : 'ArrowLeft');
          await assertFeature(page, 'builder', language);
          const sizes = await controls.locator('button').evaluateAll(elements => elements.map(el => {
            const box = el.getBoundingClientRect(); return [box.width, box.height];
          }));
          assert(sizes.every(([w, h]) => w >= 44 && h >= 44), `${name}: small carousel controls`);
          await dots.first().click();
          await assertFeature(page, 'home', language);
          if (width === 390) await page.locator('.ssc-story').screenshot({ path: path.join(output, `${language}-story-mobile.png`) });
        }
        await page.locator('#download').scrollIntoViewIfNeeded();
        await inspect(page, `${name}/downloads`);
        if (width === 390 || width === 1440) await page.locator('#download').screenshot({ path: path.join(output, `${language}-downloads-${width}.png`) });
        if (china) {
          assert.equal(await page.locator('.ssc-registration a').getAttribute('href'), 'https://beian.mps.gov.cn/#/query/webSearch?code=32059002005040');
        }
      }
    }
    report.checks.push('Five topics in every locale at 320/390/768/1024/1440: centered three-phone stack, white canvas, icon-derived rust, sticky desktop story, mobile controls, keyboard selection and no overflow or selection jumps.');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.getByRole('switch', { name: china ? '切换到深色模式' : 'Switch to dark theme' }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.ssc-site').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(0, 0, 0)');
    await page.screenshot({ path: path.join(output, 'dark-hero.png') });
    await inspect(page, 'dark/hero');
    await page.getByRole('switch', { name: china ? '切换到浅色模式' : 'Switch to light theme' }).click();
    const searchName = china ? '搜索帮助' : localeMetadata.root.search.label;
    await page.getByRole('button', { name: searchName, exact: true }).click();
    await page.locator('#localsearch-input').fill(china ? '离线' : 'offline');
    await page.locator('.VPLocalSearchBox [role=option]').first().waitFor();
    await page.locator('.VPLocalSearchBox [role=option]').first().click();
    await page.waitForURL('**/faq/**');
    await inspect(page, 'search/faq');
    if (!china) {
      await page.getByRole('button', { name: localeMetadata.root.languageMenuLabel }).click();
      await page.locator('.VPNavBarTranslations').getByRole('link', { name: '简体中文', exact: true }).click();
      await page.waitForURL(url => url.pathname.endsWith('/zh-hans/faq/'));
      await page.waitForFunction(() => document.querySelector('.VPNavBarTitle .title')?.textContent.trim() === '苍蓝星图鉴');
    }
    for (const route of ['faq/', 'others/', 'support/', 'privacy/']) {
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(origin + (china ? '' : 'zh-hans/') + route, { waitUntil: 'networkidle' });
        await inspect(page, `documents/${route}/${width}`);
        if (china) assert.equal(await page.locator('.ssc-registration').count(), 1);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'mobile navigation' }).click();
    await page.locator('.VPNavScreen').getByRole('link', { name: china ? '下载' : 'Download', exact: true }).click();
    await page.waitForURL('**/#download');
    assert.equal(await page.locator('.VPNavBarHamburger').getAttribute('aria-expanded'), 'false');
    report.checks.push('Theme persistence, local help search, global locale-preserving document routing, supporting pages, China registration and mobile download navigation.');

    for (const touchLocale of (china ? [''] : ['', 'ar/'])) {
    const rtlTouch = metadataFor(touchLocale).dir === 'rtl';
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const touchPage = await touchContext.newPage();
    touchPage.setDefaultTimeout(15000);
    touchPage.on('pageerror', error => report.errors.push(error.message));
    await touchPage.goto(origin + touchLocale, { waitUntil: 'networkidle' });
    const cdp = await touchContext.newCDPSession(touchPage);
    async function gesture(box, horizontal) {
      const x1 = box.x + box.width * (horizontal ? (rtlTouch ? 0.2 : 0.8) : 0.5);
      const x2 = box.x + box.width * (horizontal ? (rtlTouch ? 0.8 : 0.2) : 0.5);
      const y1 = box.y + box.height * (horizontal ? 0.5 : 0.65);
      const y2 = box.y + box.height * (horizontal ? 0.5 : 0.25);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
      for (let step = 1; step <= 6; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * step / 6, y: y1 + (y2 - y1) * step / 6 }] });
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    const phone = touchPage.locator('.ssc-phone');
    await phone.scrollIntoViewIfNeeded();
    await gesture(await phone.boundingBox(), true);
    await assertFeature(touchPage, 'hitzones', languageFor(touchLocale));
    await touchPage.locator('.ssc-chapters').scrollIntoViewIfNeeded();
    await gesture(await touchPage.locator('.ssc-chapters').boundingBox(), true);
    await assertFeature(touchPage, 'weapon', languageFor(touchLocale));
    await phone.scrollIntoViewIfNeeded();
    const before = await touchPage.evaluate(() => scrollY);
    await gesture(await phone.boundingBox(), false);
    await touchPage.waitForFunction(before => scrollY > before + 20, before);
    await assertFeature(touchPage, 'weapon', languageFor(touchLocale));
    assert((await phone.evaluate(el => getComputedStyle(el).touchAction)).includes('pinch-zoom'));
    await touchContext.close();
    }
    report.checks.push('Real browser touch gestures switch phone/text chapters, vertical phone swipes scroll normally, and pinch zoom remains enabled.');
    assert.deepEqual(report.errors, []);
    console.log(`UX audit passed: ${report.states.length} rendered states, ${report.checks.length} interaction groups, no page/asset errors.`);
  } finally {
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n');
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
