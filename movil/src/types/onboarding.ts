export type OnboardingData = {
  nivel_actividad: string;
  condiciones: string[];
  alergias: string[];
  intolerancias: string[];
  otra_alergia: string;
  objetivo_nutricional: string;
  deportes: string[];
  preferencias_alimenticias: string[];
  restricciones_alimenticias: string[];
};

export const initialOnboardingData: OnboardingData = {
  nivel_actividad: '', condiciones: [], alergias: [], intolerancias: [], otra_alergia: '',
  objetivo_nutricional: '', deportes: [], preferencias_alimenticias: [], restricciones_alimenticias: [],
};
