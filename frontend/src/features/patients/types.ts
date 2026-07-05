import type { TreatmentState } from '../../shared/types';

export type GeneralState = 'Alta Adherencia' | 'Media Adherencia' | 'Baja Adherencia';

export interface OnboardingProfile {
  nivel_actividad: string;
  condiciones: string[];
  alergias: string[];
  intolerancias: string[];
  otra_alergia?: string;
  objetivo_nutricional: string;
  deportes: string[];
  preferencias_alimenticias: string[];
  restricciones_alimenticias: string[];
}

export interface ClinicalEvaluation {
  id: string;
  patientId: string;
  weight: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
  bmi: number;
  bmr: number;
  recordedAt: string;
}

export type NutritionPlanStatus = 'borrador' | 'activo' | 'inactivo';

export interface NutritionPlan {
  id: string;
  patientId: string;
  status: NutritionPlanStatus;
  startDate: string | null;
  activatedAt: string | null;
  moduleLocked: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  generalState: GeneralState | 'Pendiente';
  treatmentState?: TreatmentState;
  lastVisit: string;
}

export interface PatientDetail extends Patient {
  phone: string;
  age: number;
  weight: number;
  height: number;
  isProfileCompleted: boolean;
  notes?: string;
  onboarding?: OnboardingProfile;
  nutritionPlan?: NutritionPlan;
}

export interface ClinicalEvaluationInput {
  weight: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
}
