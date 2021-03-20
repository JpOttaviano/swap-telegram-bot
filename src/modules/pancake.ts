import puppeteer, { Page } from 'puppeteer'

const pancakeUrl = 'https://pancakeswap.finance/farms'

let page

async function goToPage(): Promise<Page> {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(pancakeUrl, { waitUntil: 'networkidle2' })
  //await page.waitFor(3000)
  await page.waitForSelector('img[src="/images/farms/trade-bnb.svg"]')
  //await page.waitForSelector('')
  return page
}

export async function startWatch(farmPool: string): Promise<number> {
  if (!page) {
    page = await goToPage()
  }
  const farmAPR = await page.evaluate((farmPool) => {
    return Array.from(document.querySelectorAll('div')).find((el) => el.innerText === farmPool)
      .parentElement.parentElement.children[2].textContent
  }, farmPool)
  //const browser = page.browser()
  //await browser.close()
  console.log(farmAPR)
  return +farmAPR.replace('APR', '').replace('%', '')
}
