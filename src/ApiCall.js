import axios from 'axios';

const apiCall = async (url, country, instance, apiKey, { signal }) => {
  try {
    const response = await axios.post(
      // 'http://localhost:3000/api/proxy', // Update to match your backend endpoint
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

    // Return the success response directly
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled via AbortController');
      return {
        success: false,
        status: 'cancelled', // Indicate that the request was canceled
        error: 'Request canceled by user',
        url,
        provider: 'N/A',
        screenshot: null, // No screenshot when canceled
        instance,
      };
    }

    console.error('Error in request:', error);

    // Return an error response with proper handling of missing fields
    return {
      success: false,
      status: error.response?.status || 500,
      error: error.response?.data?.error || 'Unknown error',
      url,
      provider: error.response?.data?.provider || 'Unknown provider',
      screenshot: null, // No screenshot in case of failure
      instance,
    };
  }
};

export default apiCall;
