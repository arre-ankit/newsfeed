async function fetchNewsAPI(apiKey, query, category = '', country = 'us') {
    const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&category=${category}&country=${country}&apiKey=${apiKey}`;
    const data = await fetchFromAPI(url);
    return data && data.articles ? data.articles : [];
  }
  
  // lib/newsaggregator.js
  import { fetchNewsAPI, fetchHackerNews } from './apiHelpers';
  
  async function aggregateNews(userPreferences) {
    const { interests, location } = userPreferences;
    const newsPromises = [];
  
    // Add API calls based on user preferences
    if (interests.includes('general')) {
      newsPromises.push(fetchNewsAPI(process.env.NEWS_API_KEY, '', 'general', location.country));
    }
  
    if (interests.includes('technology')) {
      newsPromises.push(fetchHackerNews(20));
    }
  
    // Wait for all API calls to complete
    const newsArrays = await Promise.all(newsPromises);
  
    // Flatten the array of arrays into a single array of news articles
    const allNews = newsArrays.flat();
  
    // Here you can apply a recommendation algorithm if needed
    const personalizedNews = allNews.map(article => ({
      ...article,
      urlToImage: article.urlToImage || article.imageUrl || '/placeholder-image.jpg'
    }));
  
    return personalizedNews;
  }
  
  export default aggregateNews;