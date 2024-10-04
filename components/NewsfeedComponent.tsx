'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from 'next/image';

interface NewsArticle {
    source: {
        id: string; // Allow null values for id
        name: string; // Allow null values for name
    };
    author: string; // Allow null values for author
    title: string; // Allow null values for title
    description: string; // Allow null values for description
    url: string; // Allow null values for url
    urlToImage: string; // Allow null values for urlToImage
    publishedAt: string; // Allow null values for publishedAt
    content: string; // Allow null values for content
}

export default function NewsfeedComponent() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch('/api/news'); // Call the Next.js API route
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: any = await response.json();
                console.log('API Response:', data);
                if (data.articles.length === 0) {
                    setError('No articles found. Try adjusting your search criteria.');
                    setArticles([]); // Ensure articles is empty
                } else {
                    setArticles(data.articles);
                }
            } catch (err) {
                console.error('Error fetching news:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchNews();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Filter articles to only include those with no null fields
    const filteredArticles = articles.filter(article => 
        article.source.id && 
        article.source.name &&
        article.author && 
        article.title && 
        article.description && 
        article.url && 
        article.urlToImage && 
        article.publishedAt
    );

    if (filteredArticles.length === 0) return <div>No articles found. Try again later.</div>;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4">Latest News</h2>
            <div className="grid gap-4">
                {filteredArticles.map((article) => (
                    <Card key={article.url} className="rounded-lg overflow-hidden">
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1 relative h-60 md:h-full">
                                <Image
                                    src={article.urlToImage}
                                    alt={article.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="md:col-span-2 p-4 md:p-6 bg-background">
                                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                                <p className="text-muted-foreground mb-2">{article.description}</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        Read More
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
