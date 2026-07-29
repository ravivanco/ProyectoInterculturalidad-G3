import type { ClinicalEvaluation, ClinicalEvaluationInput } from '../types';

const evaluationsDb: ClinicalEvaluation[] = [
  {
    id: 'ev-1',
    patientId: '1',
    weight: 78,
    height: 175,
    bodyFat: 22,
    muscleMass: 38,
    bmi: 25.5,
    bmr: 1750,
    recordedAt: '2026-05-10',
  },
  {
    id: 'ev-2',
    patientId: '1',
    weight: 76,
    height: 175,
    bodyFat: 20.5,
    muscleMass: 39,
    bmi: 24.8,
    bmr: 1720,
    recordedAt: '2026-06-01',
  },
];

function calcBmi(weight: number, heightCm: number) {
  const h = heightCm / 100;
  return Math.round((weight / (h * h)) * 10) / 10;
}

function calcBmr(weight: number, heightCm: number) {
  return Math.round(10 * weight + 6.25 * heightCm - 5 * 30 + 5);
}

export const clinicalEvaluationsAPI = {
  getByPatient: async (patientId: string): Promise<ClinicalEvaluation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          evaluationsDb
            .filter((e) => e.patientId === patientId)
            .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
        );
      }, 400);
    });
  },

  create: async (patientId: string, input: ClinicalEvaluationInput): Promise<ClinicalEvaluation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const evaluation: ClinicalEvaluation = {
          id: `ev-${Date.now()}`,
          patientId,
          ...input,
          bmi: calcBmi(input.weight, input.height),
          bmr: calcBmr(input.weight, input.height),
          recordedAt: new Date().toISOString().slice(0, 10),
        };
        evaluationsDb.push(evaluation);
        resolve(evaluation);
      }, 500);
    });
  },
};

export function validateEvaluationInput(input: ClinicalEvaluationInput): string | null {
  if (input.weight <= 0 || input.weight > 500) return 'El peso debe estar entre 1 y 500 kg.';
  if (input.height <= 0 || input.height > 300) return 'La estatura debe estar entre 1 y 300 cm.';
  if (input.bodyFat < 0 || input.bodyFat > 100) return 'La grasa corporal debe estar entre 0 y 100 %.';
  if (input.muscleMass < 0 || input.muscleMass > 100) return 'La masa muscular debe estar entre 0 y 100 %.';
  return null;
}
