import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const url = req.query.url as string;

    const requestUrl = new URL('https://api.apiflash.com/v1/urltoimage');

    requestUrl.searchParams.append('access_key', process.env.API_FLASH_KEY!);
    requestUrl.searchParams.append('url', url);
    requestUrl.searchParams.append('wait_until', 'network_idle');
    requestUrl.searchParams.append('width', '1920');
    requestUrl.searchParams.append('height', '1080');
    requestUrl.searchParams.append('response_type', 'json');

    try {
      const response = await fetch(requestUrl.toString()).then((res) => {
        console.log('res', res);
        console.log('res to JSON', res.json());

        return res.json();
      });

      console.log('response', response);

      return res.status(200).json({ response });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
}
