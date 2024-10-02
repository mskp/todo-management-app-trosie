import axios from './axios';

/**
 * Verifies the access token by making a request to the server.
 *
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the access token is valid.
 * @throws Will return false if the verification request fails.
 */
export async function verifyAccessToken(): Promise<boolean> {
  try {
    const {
      data: { success },
    } = await axios.get<{ success: boolean }>('/auth/verify-access-token');
    return success;
  } catch (error) {
    return false;
  }
}
