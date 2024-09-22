import axios from 'axios';

const API_KEY = '6feb15d7ddfc467d93921c46b6ad8b71'; 
const BASE_URL = 'https://newsapi.org/v2/everything';

export const News = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: 'traffic OR road OR roadblock OR accident', 
        // q: 'news24', 
        sources: 'news24', 
        apiKey: API_KEY,
        pageSize: 100,
        sortBy: 'publishedAt',
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
};
