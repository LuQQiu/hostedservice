declare global {
  interface Window {
    PUBLIC_DNS_NAME?: string;
  }
}

const getApiUrl = (): string => {
  return `http://${window.PUBLIC_DNS_NAME || window.location.hostname}:8080`;
};

export const API_BASE_URL = getApiUrl();

console.log('API_BASE_URL:', API_BASE_URL);

export default {
  API_BASE_URL
};