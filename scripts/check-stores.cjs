const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const dist = path.resolve('.vitepress/dist');
const output = path.resolve(process.env.SSC_STORE_AUDIT_OUTPUT || '.codex/audit-evidence/website-china-stores');
const base = '/';
const expected = 'https://appgallery.huawei.com/app/detail?id=com.eurekaffeine.monsterhunterdex&channelId=SHARE&source=appshare';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const report = { states: [], errors: [] };
const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    assert(url.pathname.startsWith(base));
    let file = path.resolve(dist,decodeURIComponent(url.pathname.slice(base.length)));
    assert(file===dist || file.startsWith(dist+path.sep));
    if ((await fs.stat(file)).isDirectory()) file=path.join(file,'index.html');
    res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});

(async () => {
  await fs.mkdir(output,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}${base}`;
  const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome'});
  try {
    const context=await browser.newContext({reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400) report.errors.push(`${response.status()} ${response.url()}`);});
    for (const locale of ['']) {
      const available='现已上架', pending='尚未上架';
      for (const width of [320,390,768,1440]) {
        for (const theme of ['light','dark']) {
          await page.setViewportSize({width,height:900});
          const response=await page.goto(origin+locale,{waitUntil:'networkidle'});
          assert(response?.ok(),`Failed page response: ${locale||'zh-Hans/'}`);
          await page.evaluate(theme=>{
            document.documentElement.classList.toggle('dark',theme==='dark');
            localStorage.setItem('vitepress-theme-appearance',theme);
          },theme);
          const section=page.locator('#download');
          await section.scrollIntoViewIfNeeded();
          assert.equal(await section.locator('img').count(),2);
          assert.equal(await section.locator('a').count(),1);
          assert.equal(await section.locator('a').getAttribute('href'),expected);
          assert.equal(await section.locator('a').getAttribute('target'),'_blank');
          assert.equal(await section.locator('a').getAttribute('rel'),'noopener noreferrer');
          assert.equal(await page.locator('.ssc-updates').count(),0);
          assert.equal(await section.locator('.ssc-store-status').count(),0);
          const visibleText = await section.innerText();
          assert(visibleText.includes('Android 国内版') && visibleText.includes(pending));
          assert(!visibleText.includes('Google Play'));
          assert.equal(await section.locator('[data-store=android] a').count(),0);
          assert.equal(await section.locator('.pending[aria-disabled="true"]').count(),1);
          assert.equal(await section.locator('.pending a, .pending[tabindex]').count(),0);
          const images=section.locator('img');
          const names=['app-store-badge-zh-hans.svg','app-gallery-badge-en.png'];
          for (let i=0;i<2;i++) {
            const image=images.nth(i);
            await image.evaluate(img=>img.decode());
            assert.equal(await image.getAttribute('src'),`${base}badges/${names[i]}`);
            const geometry=await image.evaluate(img=>{
              const rect=img.getBoundingClientRect();
              return {left:rect.left,right:rect.right,width:rect.width,height:rect.height,nw:img.naturalWidth,nh:img.naturalHeight};
            });
            assert(geometry.nw>0 && geometry.nh>0);
            assert(geometry.left>=0 && geometry.right<=width+1);
            assert(Math.abs(geometry.width/geometry.height-geometry.nw/geometry.nh)<.02,'Badge distorted');
          }
          await section.locator('a').focus();
          assert.equal(await page.evaluate(()=>document.activeElement?.closest('[data-store]')?.getAttribute('data-store')),'harmony');
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.closest('.pending'))),false);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow');
          report.states.push({locale:locale||'zh-Hans/',width,theme,link:expected,available,pending});
          const save = [390,1440].includes(width);
          if (save) await section.screenshot({path:path.join(output,`${locale?locale.slice(0,-1):'zh-hans'}-${width}-${theme}.jpg`),type:'jpeg',quality:78});
        }
      }
      for (const route of ['faq/','others/']) {
        await page.goto(origin+locale+route,{waitUntil:'networkidle'});
        assert.equal(await page.locator(`.vp-doc a[href="${expected}"]`).count(),1);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      }
    }
    assert.deepEqual(report.errors,[]);
    await fs.writeFile(path.join(output,'results.json'),JSON.stringify(report,null,2));
    console.log(`Verified ${report.states.length} China responsive/theme store states and 2 availability pages.`);
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
