export interface AdherenceMetrics {
  patientId: string;
  caloricAdherence: number;
  macroAdherence: number;
  physicalAdherence: number;
  overallAdherence: number;
  lastUpdated: string;
}

export interface WeightRecord {
  id: string;
  patientId: string;
  date: string;
  weight: number;
  fatPercentage?: number;
  muscleMass?: number;
}

export interface ExtraConsumption {
  id: string;
  patientId: string;
  date: string;
  foodName: string;
  estimatedCalories: number;
  photoUrl?: string;
  status: 'PENDING' | 'REVIEWED';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}
