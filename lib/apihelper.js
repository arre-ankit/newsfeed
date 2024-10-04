// Helper function for fetching and processing responses
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// NewsAPI (https://newsapi.org/)
async function fetchNewsAPI(apiKey, query, category = '', country = 'us') {
  const url = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&category=${category}&country=${country}&apiKey=${apiKey}`;
  const data = await fetchFromAPI(url);
  return data && data.articles ? data.articles : [];
}

// Currents API (https://currentsapi.services/)
async function fetchCurrentsAPI(apiKey, keywords, language = 'en') {
  const url = `https://api.currentsapi.services/v1/search?keywords=${keywords}&language=${language}&apiKey=${apiKey}`;
  const data = await fetchFromAPI(url);
  return data ? data.news : [];
}

// The Guardian API (https://open-platform.theguardian.com/)
async function fetchGuardianAPI(apiKey, query, section = '') {
  const url = `https://content.guardianapis.com/search?q=${query}&section=${section}&api-key=${apiKey}`;
  const data = await fetchFromAPI(url);
  return data ? data.response.results : [];
}

// Mediastack API (https://mediastack.com/)
async function fetchMediastackAPI(apiKey, keywords, countries = 'us', languages = 'en') {
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${keywords}&countries=${countries}&languages=${languages}`;
  const data = await fetchFromAPI(url);
  return data ? data.data : [];
}

// New York Times API (https://developer.nytimes.com/)
async function fetchNYTimesAPI(apiKey, query, section = '') {
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&fq=section_name:("${section}")&api-key=${apiKey}`;
  const data = await fetchFromAPI(url);
  return data ? data.response.docs : [];
}

// Hacker News API (https://github.com/HackerNews/API)
async function fetchHackerNews(limit = 30) {
  const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
  const topStoriesIds = await fetchFromAPI(topStoriesUrl);

  if (!topStoriesIds) return [];

  const storyPromises = topStoriesIds.slice(0, limit).map(async (id) => {
    const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    return fetchFromAPI(storyUrl);
  });

  const stories = await Promise.all(storyPromises);

  // Format the stories to match the general news structure
  return stories.filter(story => story).map(story => ({
    title: story.title,
    url: story.url,
    source: 'Hacker News',
    publishedAt: new Date(story.time * 1000).toISOString(),
    author: story.by,
    content: story.text || '',
    category: 'technology',
  }));
}

export {
  fetchNewsAPI,
  fetchCurrentsAPI,
  fetchGuardianAPI,
  fetchMediastackAPI,
  fetchNYTimesAPI,
  fetchHackerNews
};
