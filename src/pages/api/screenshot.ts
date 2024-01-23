import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return;

  const url = req.query.url as string;

  const requestUrl = new URL('https://shot.screenshotapi.net/screenshot');

  requestUrl.searchParams.append('token', process.env.SCREENSHOT_API_KEY!);
  requestUrl.searchParams.append('url', url);
  requestUrl.searchParams.append('wait_for_event', 'networkidle');
  requestUrl.searchParams.append('width', '1920');
  requestUrl.searchParams.append('height', '1080');
  requestUrl.searchParams.append('fresh', 'true');
  requestUrl.searchParams.append('output', 'json');
  requestUrl.searchParams.append('file_type', 'png');
  requestUrl.searchParams.append('ttl', '360');
  requestUrl.searchParams.append('selector', '.react-grid-layout');

  try {
    const response = await fetch(requestUrl.toString()).then((res) =>
      res.json()
    );

    console.log('response', response);

    return res.status(200).json({ response });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error });
  }
}
