import type { AuthSession, LoginPayload, RegisterPayload } from '../types/auth';
import { apiRequest } from './api';

export const authService = {
  register(payload: RegisterPayload) {
    return apiRequest<AuthSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload: LoginPayload) {
    return apiRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
