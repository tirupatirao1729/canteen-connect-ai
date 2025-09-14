// Example usage of the configuration constants
import { CONFIG, getApiUrl, getFrontendUrl } from '@/config/constants';

// Example: Using the configuration in API calls
export const apiService = {
  // Get the current API URL based on environment
  getBaseUrl: () => getApiUrl(),
  
  // Example API call using the configured URL
  fetchData: async () => {
    const baseUrl = getApiUrl();
    const response = await fetch(`${baseUrl}/api/data`);
    return response.json();
  },
  
  // Example: Using Netlify URL specifically
  fetchFromNetlify: async () => {
    const response = await fetch(`${CONFIG.NETLIFY_URL}/api/endpoint`);
    return response.json();
  }
};

// Example: Using in components
export const useApiConfig = () => {
  return {
    apiUrl: getApiUrl(),
    frontendUrl: getFrontendUrl(),
    netlifyUrl: CONFIG.NETLIFY_URL,
    supabaseUrl: CONFIG.SUPABASE.URL
  };
};

