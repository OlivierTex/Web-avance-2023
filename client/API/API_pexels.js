  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  export const getAPIKey = () => {
    return API_KEY;
  };
  
  export const getAPIBaseURL = () => {
    return API_BASE_URL;
  };