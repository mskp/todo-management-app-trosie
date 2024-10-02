'use server';

import axios from '@/lib/axios';
import { ACCESS_TOKEN_KEY_NAME } from '@/lib/constants';
import { StandardResponse } from '@/lib/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { handleError } from './utils';

function setAccessTokenCookie(accessToken: string): void {
  const cookieStore = cookies();
  cookieStore.set(ACCESS_TOKEN_KEY_NAME, accessToken);
}

export async function logout() {
  cookies().delete(ACCESS_TOKEN_KEY_NAME);
  redirect('/login');
}

type AuthCredentials = {
  email: string;
  password: string;
};

export async function login(authCredentials: AuthCredentials) {
  try {
    const response = await axios.post<
      StandardResponse<{ accessToken: string }>
    >('/auth/login', authCredentials);

    setAccessTokenCookie(response.data.data?.accessToken!);

    return {
      success: true,
      message: 'Logged in successfully',
    };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function signup(authCredentials: AuthCredentials) {
  try {
    const response = await axios.post<
      StandardResponse<{ accessToken: string }>
    >('/auth/signup', authCredentials);

    setAccessTokenCookie(response.data.data?.accessToken!);

    return {
      success: true,
      message: 'Logged in successfully',
    };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}
