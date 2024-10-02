import Axios from 'axios';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_KEY_NAME, API_BASE_URL } from './constants';

const axios = Axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    const cookieStore = cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY_NAME)?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
