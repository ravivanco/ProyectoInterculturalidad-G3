export interface Exercise {
  id: string;
  name: string;
  category: string;
  description?: string;
  met?: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  met?: number;
  isActive: boolean;
  muscleGroup: string;
  recommendedDurationMin: number;
  metValue: number;
}
