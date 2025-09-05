// lib/api.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Base URL configurable via env with a safe fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.parthamanunggal.com';
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('API Base URL:', API_BASE_URL);
}

// 1. Buat Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false, // Tidak perlu credentials untuk API
  timeout: 30000, // Menambahkan timeout 30 detik
  // Tambahkan proxy untuk bypass CORS issue
  proxy: false
});

// 2. Interceptor: tambahkan Bearer token jika ada
api.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// 3. Helper function apiRequest<T>
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: Record<string, unknown> | FormData,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Making ${method} request to ${url}`);
      console.log('Request config:', { method, url, data, config });
      console.log('API Base URL:', API_BASE_URL);
    }
    
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Successful response from ${url}`, response.status);
      console.log('Response data:', response.data);
    }
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { 
      message?: string; 
      response?: { status?: number }; 
      config?: unknown 
    };
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error in apiRequest to ${url}:`, axiosError.message || 'Unknown error');
      console.error('Full error object:', error);
      console.error('Error response:', axiosError.response);
      console.error('Error config:', axiosError.config);
    }
    
    // If we get a 500 error, try alternative approaches
    if (axiosError.response?.status === 500) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Received 500 error, trying alternative approaches...');
      }
      
      // Try 1: Direct fetch without axios
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Attempting direct fetch...');
        }
        const fullUrl = `${API_BASE_URL}${url}`;
        const fetchResponse = await fetch(fullUrl, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        });
        
        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json();
          if (process.env.NODE_ENV !== 'production') {
            console.log('Direct fetch successful:', fetchData);
          }
        return fetchData as T;
      } else {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Direct fetch failed:', fetchResponse.status, fetchResponse.statusText);
          }
        }
      } catch (fetchError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Direct fetch error:', fetchError);
        }
      }
      
      // Try 2: XHR fallback
      if (method === 'GET') {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Attempting XHR fallback...');
        }
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const fullUrl = `${API_BASE_URL}${url}`;
          
          xhr.open(method, fullUrl, true);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          
          xhr.timeout = 30000;
          
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (process.env.NODE_ENV !== 'production') {
                  console.log('XHR fallback successful', response);
                }
                resolve(response as T);
              } catch (e) {
                reject(new Error(`JSON parse error: ${e}`));
              }
            } else {
              reject(new Error(`HTTP error status: ${xhr.status}`));
            }
          };
          
          xhr.onerror = function() {
            console.error('XHR error occurred');
            reject(new Error('Network error occurred'));
          };
          
          xhr.ontimeout = function() {
            reject(new Error('Request timed out'));
          };
          
          xhr.send();
        });
      }
    }
    
    // If axios fails and no fallback worked, try with native fetch as fallback
    if (!axiosError.response && method === 'GET') {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Attempting fallback with XHR');
      }
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const fullUrl = `${API_BASE_URL}${url}`;
        
        xhr.open(method, fullUrl, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        
        xhr.timeout = 30000;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log('XHR fallback successful', response);
              resolve(response as T);
            } catch (e) {
              reject(new Error(`JSON parse error: ${e}`));
            }
          } else {
            reject(new Error(`HTTP error status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = function() {
            if (process.env.NODE_ENV !== 'production') {
              console.error('XHR error occurred');
            }
            reject(new Error('Network error occurred'));
        };
        
        xhr.ontimeout = function() {
          reject(new Error('Request timed out'));
        };
        
        xhr.send();
      });
    }
    
    throw error;
  }
}

// 4. Error handler global untuk menangani token expired
api.interceptors.response.use(
  (response) => response,
  (error: { response?: { status?: number; data?: unknown }; code?: string; message?: string; config?: unknown }) => {
    // Log error details for debugging
    console.error('API Error:', {
      message: error.message,
      config: error.config,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Bersihkan data dari localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      
      // Redirect ke halaman login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - consider increasing the timeout value');
    }
    
    if (!error.response) {
      console.error('Network error - check your internet connection or API endpoint availability');
    }
    
    return Promise.reject(error);
  }
);

// 5. Export default instance dan apiRequest
export default api;
