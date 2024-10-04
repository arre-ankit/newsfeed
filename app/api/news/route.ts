import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    const url = `https://newsapi.org/v2/everything?q=technology&sortBy=popularity&apiKey=86478c19e1e147a3ab881efa9e2ef662`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            return new Response(`Error fetching news: ${response.statusText}`, { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return new Response('An unexpected error occurred', { status: 500 });
    }
}
