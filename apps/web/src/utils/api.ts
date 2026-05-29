/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { config } from './config';

export interface APIResponse<T> {
  success: boolean;
  message: string;
  error?: Record<string, any>;
  data?: T;
  request_id?: string;
  timestamp?: string;
}

export const api = async <T>(
  method: string,
  endpoint: string,
  body?: Record<string, any>,
  headers?: Record<string, any>,
  params?: Record<string, any>,
): Promise<APIResponse<T>> => {
  try {
    const { data } = await axios({
      baseURL: config.BASE_URL,
      withCredentials: true,
      url: endpoint,
      method,
      headers,
      params,
      data: body,
    });
    return data;
  } catch (error: any) {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      try {
        const { signOut } = await import('next-auth/react');
        signOut({ redirect: true, callbackUrl: '/auth' });
      } catch (signOutError) {
        console.error('Error during auto-signOut:', signOutError);
      }
    }
    return error?.response?.data;
  }
};
