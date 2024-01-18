import { NextApiRequest, NextApiResponse } from 'next';
import chromium from 'chrome-aws-lambda';

export const takeScreenshot = async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await chromium.puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
        }
      : {}
  );

  const url = 'https://app.artemis.xyz/dashboard-builder/703';

  console.log('resssss', url);

  const page = await browser.newPage();

  // Change the URL as needed
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Set the page view as needed
  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForTimeout(1000);

  // Take the screenshot and save it to a file
  const screenshot = await page.screenshot({ encoding: 'base64' });

  await browser.close();

  // Send the screenshot as a response
  return res
    .status(200)
    .json({
      message: 'Screenshot taken and saved.',
      base64: 'data:image/png;base64,' + screenshot,
    });
};
