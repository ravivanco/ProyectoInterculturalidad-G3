import type { OnboardingData } from '../types/onboarding';
import { apiRequest } from './api';
import { getToken } from './tokenStorage';

export const profileService = {
  async updateMyProfile(payload: OnboardingData) {
    const token = await getToken();
    if (!token) throw new Error('Sesión no disponible.');
    return apiRequest<{ perfil_completado: boolean }>('/patient-profile/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },
};
