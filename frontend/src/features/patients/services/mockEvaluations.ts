import type { ClinicalEvaluation } from '../types';

export const MOCK_EVALUATIONS: Record<string, ClinicalEvaluation[]> = {
  'p-1': [
    {
      id: 'eval-1',
      date: '2026-06-15T10:00:00Z',
      weight: 85.5,
      height: 175,
      bodyFat: 22.5,
      muscleMass: 40.2
    },
    {
      id: 'eval-2',
      date: '2026-07-01T10:00:00Z',
      weight: 83.2,
      height: 175,
      bodyFat: 21.0,
      muscleMass: 40.5
    },
    {
      id: 'eval-3',
      date: '2026-07-25T10:00:00Z',
      weight: 81.0,
      height: 175,
      bodyFat: 19.5,
      muscleMass: 41.0
    }
  ],
  'p-2': [
    {
      id: 'eval-4',
      date: '2026-07-10T15:30:00Z',
      weight: 65.0,
      height: 160,
      bodyFat: 28.0,
      muscleMass: 35.0
    }
  ]
};
