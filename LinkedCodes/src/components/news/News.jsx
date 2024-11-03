import axios from 'axios';

const API_KEY = '44d6680aa0fa0bd1fe0d36d1930c8c771b0eb72817fb09a8a791892614081e1f'; 
const BASE_URL = 'https://serpapi.com/search.json';

export const NewsFromGoogleSerpApi = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: 'traffic OR incident OR crush OR road OR roads AND South Africa',
        api_key: API_KEY,
        engine: 'google_news',
        num: 100,
        Location:'south africa'
      },
    });

      // Check for rate limit error
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    return response.data.news_results || []; 
  } catch (error) {
    throw error; 
  }
};
