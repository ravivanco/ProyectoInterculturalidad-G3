import { AdherenceMetrics, WeightRecord, ExtraConsumption } from './types';

export const MOCK_ADHERENCE: AdherenceMetrics = {
  patientId: 'p-1',
  caloricAdherence: 85,
  macroAdherence: 78,
  physicalAdherence: 90,
  overallAdherence: 84.3,
  lastUpdated: new Date().toISOString(),
};

export const MOCK_WEIGHT_HISTORY: WeightRecord[] = [
  { id: 'w-1', patientId: 'p-1', date: '2026-05-01', weight: 85, fatPercentage: 22, muscleMass: 40 },
  { id: 'w-2', patientId: 'p-1', date: '2026-05-15', weight: 83.5, fatPercentage: 21.5, muscleMass: 40.2 },
  { id: 'w-3', patientId: 'p-1', date: '2026-06-01', weight: 82, fatPercentage: 20.8, muscleMass: 40.5 },
  { id: 'w-4', patientId: 'p-1', date: '2026-06-15', weight: 81.2, fatPercentage: 20.1, muscleMass: 40.8 },
  { id: 'w-5', patientId: 'p-1', date: '2026-07-01', weight: 80, fatPercentage: 19.5, muscleMass: 41 },
];

export const MOCK_EXTRA_CONSUMPTION: ExtraConsumption[] = [
  {
    id: 'ec-1',
    patientId: 'p-1',
    date: '2026-07-10T20:30:00Z',
    foodName: 'Hamburguesa doble con queso',
    estimatedCalories: 850,
    photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    status: 'PENDING',
    impact: 'HIGH'
  },
  {
    id: 'ec-2',
    patientId: 'p-1',
    date: '2026-07-15T16:00:00Z',
    foodName: 'Helado de chocolate',
    estimatedCalories: 350,
    status: 'REVIEWED',
    impact: 'MEDIUM'
  },
  {
    id: 'ec-3',
    patientId: 'p-1',
    date: '2026-07-20T10:30:00Z',
    foodName: 'Manzana verde extra',
    estimatedCalories: 95,
    status: 'REVIEWED',
    impact: 'LOW'
  }
];
