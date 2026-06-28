import type { AuthSession, RegisterPayload } from '../types/auth';
import { apiRequest } from './api';

export const authService = {
  register(payload: RegisterPayload) {
    return apiRequest<AuthSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
