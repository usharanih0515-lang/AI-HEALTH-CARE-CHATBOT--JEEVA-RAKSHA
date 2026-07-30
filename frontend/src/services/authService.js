/**
 * =============================================================================
 * Jeeva Raksha — Authentication API Service (services/authService.js)
 * =============================================================================
 */

import apiService from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class AuthService {
  async registerPatient(data) {
    const response = await apiService.post('/auth/register', data);
    return response.data;
  }

  async loginWithFirebase(firebaseToken, device = 'Mobile') {
    const response = await apiService.post('/auth/login', { firebaseToken, device });
    await this.setSession(response.data.data.token, response.data.data.user);
    return response.data;
  }

  async sendOtp(email) {
    const response = await apiService.post('/auth/send-otp', { email });
    return response.data;
  }

  async verifyOtp(email, otp) {
    const response = await apiService.post('/auth/verify-otp', { email, otp });
    return response.data; // May contain tempToken
  }

  async resetPassword(tempToken, newPassword) {
    const response = await apiService.post('/auth/reset-password', { tempToken, newPassword });
    return response.data;
  }

  async logout() {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed, proceeding to clear local session');
    }
    await this.clearSession();
  }

  async getProfile() {
    const response = await apiService.get('/auth/profile');
    return response.data;
  }

  async setSession(token, user) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
  }

  async clearSession() {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }
}

export default new AuthService();
