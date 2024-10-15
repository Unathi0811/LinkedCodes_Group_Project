import axios from 'axios';

const API_KEY = '98be89b47590252be5d9082fa0b35df3778f2a35a74e56d0d8b3ab1fa42f189a'; 
const BASE_URL = 'https://serpapi.com/search.json';

export const NewsFromGoogleSerpApi = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: 'traffic OR road OR incident AND South Africa',
        api_key: API_KEY,
        engine: 'google_news',
        num: 100,
      },
    });
    return response.data.news_results || []; 
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
};
