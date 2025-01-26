import axios from 'axios';

const apiCall = async (url, country, instance, apiKey) => {
    try {
      const response = await axios.post(
        // 'https://mobile-proxy-premium-backend.onrender.com/api/proxy',
        'http://localhost:3000/api/proxy',

        { url, country, instance },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 500,
        error: error.response?.data?.error || 'Unknown error',
        url,
        provider: error.response?.data?.provider || 'Unknown provider',
        redirectedTo: null,
        instance,
      };
    }
  };

  export default apiCall