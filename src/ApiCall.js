import axios from 'axios';

const apiCall = async (url, country, instance, apiKey, { signal }) => {
  try {
    console.log('Signal state before request:', { signal, aborted: signal.aborted });
    const response = await axios.post(
      'https://mobile-proxy-premium-backend-xx9m.onrender.com/api/proxy',
      { url, country, instance },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal, // Pass the abort signal here
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled via AbortController');
      return {
        success: false,
        status: 'cancelled', // Indicate that the request was canceled
        error: 'Request cancelled by user',
        url,
        provider: 'N/A',
        redirectedTo: null,
        instance,
      };
    }
    console.error('Error in request:', error);
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

export default apiCall;
