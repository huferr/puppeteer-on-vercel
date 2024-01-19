import { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const browser = await puppeteer.launch(
      process.env.NODE_ENV === 'production'
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
          }
        : {}
    );

    const url = 'https://app.artemis.xyz/dashboard-builder/703';

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Set the page view as needed
    await page.setViewport({ width: 1920, height: 1080 });

    await page.waitForTimeout(1000);

    // Take the screenshot
    const screenshot = await page.screenshot({ encoding: 'base64' });

    await browser.close();

    return res.status(200).json({
      message: 'Screenshot taken and saved.',
      base64: 'data:image/png;base64,' + screenshot,
    });
  } else {
    // Handle any other HTTP method
  }
}
