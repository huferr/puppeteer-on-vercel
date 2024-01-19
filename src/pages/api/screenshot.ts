import { NextApiRequest, NextApiResponse } from 'next';
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright-core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const browser = await playwright.launch({
      executablePath:
        process.env.NODE_ENV === 'production'
          ? await chromium.executablePath
          : undefined,
      headless:
        process.env.NODE_ENV === 'production' ? chromium.headless : true,
    });

    const url = 'https://app.artemis.xyz/dashboard-builder/703';

    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForTimeout(1000);

    // Take the screenshot
    const buffer = await page.screenshot();

    const screenshot = buffer.toString('base64');

    await browser.close();

    return res.status(200).json({
      message: 'Screenshot taken and saved.',
      base64: 'data:image/png;base64,' + screenshot,
    });
  } else {
    // Handle any other HTTP method
  }
}
