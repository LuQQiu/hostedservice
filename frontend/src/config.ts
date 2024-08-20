declare global {
  interface Window {
    PUBLIC_DNS_NAME?: string;
  }
}

const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the PUBLIC_DNS_NAME injected by the backend
    return `http://${window.PUBLIC_DNS_NAME || window.location.hostname}:8080`;
  }
  // In development, use localhost
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiUrl();

// If you need to export more configuration variables, you can do it like this:
// export const SOME_OTHER_CONFIG = 'value';

// Make sure there's at least one default export
export default {
  API_BASE_URL
};