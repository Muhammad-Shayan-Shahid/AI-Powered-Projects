import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
for (const [route, name] of [['/', 'm-home'], ['/menu', 'm-menu'], ['/booking', 'm-booking'], ['/admin', 'm-admin']]) {
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${name}.png` })
}
console.log('ERRORS', errors)
await browser.close()
