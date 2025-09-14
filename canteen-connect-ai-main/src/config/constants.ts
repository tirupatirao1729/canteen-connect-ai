// Configuration file for API endpoints and server URLs
export const CONFIG = {
  // Server URLs
  NETLIFY_URL: 'https://dazzling-sunflower-a353a2.netlify.app',
  
  // API Endpoints
  API_BASE_URL: 'https://dazzling-sunflower-a353a2.netlify.app',
  
  // Environment-specific URLs
  DEVELOPMENT: {
    API_URL: 'http://localhost:8080',
    FRONTEND_URL: 'http://localhost:8080'
  },
  
  PRODUCTION: {
    API_URL: 'https://dazzling-sunflower-a353a2.netlify.app',
    FRONTEND_URL: 'https://dazzling-sunflower-a353a2.netlify.app'
  },
  
  // Supabase Configuration (keeping existing)
  SUPABASE: {
    URL: 'https://twwqflvwhauekjvtimho.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3d3FmbHZ3aGF1ZWtqdnRpbWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTQxMzcsImV4cCI6MjA3MjU3MDEzN30.udgL0Y_5pRggBjAu6st8x-xguyACQvcnYTOvcCKLUvQ'
  }
} as const;

// Helper function to get current environment
export const getCurrentEnvironment = () => {
  return import.meta.env.DEV ? 'DEVELOPMENT' : 'PRODUCTION';
};

// Helper function to get API URL based on environment
export const getApiUrl = () => {
  const env = getCurrentEnvironment();
  return CONFIG[env].API_URL;
};

// Helper function to get frontend URL based on environment
export const getFrontendUrl = () => {
  const env = getCurrentEnvironment();
  return CONFIG[env].FRONTEND_URL;
};

