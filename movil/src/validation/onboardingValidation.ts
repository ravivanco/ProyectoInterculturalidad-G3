import type { OnboardingData } from '../types/onboarding';

export function isOnboardingComplete(data: OnboardingData, withoutRestrictions: boolean) {
  return Boolean(
    data.nivel_actividad && data.condiciones.length && data.alergias.length &&
    data.objetivo_nutricional && data.deportes.length && data.preferencias_alimenticias.length &&
    (withoutRestrictions || data.restricciones_alimenticias.length),
  );
}
