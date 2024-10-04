import { NextApiRequest, NextApiResponse } from 'next';
import { fetchNewsAPI } from '../../../lib/apihelper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newsArticles = await fetchNewsAPI(process.env.NEWS_API_KEY, '', 'general', 'us');
    res.status(200).json({ articles: newsArticles });
  } catch (error) {
    console.error('Error in general news API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
