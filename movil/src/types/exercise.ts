export type ExerciseIntensity = 'Baja' | 'Media' | 'Alta';

export type ExerciseCategory = 'Cardio' | 'Fuerza' | 'Flexibilidad' | 'Movilidad';

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  durationMinutes: number;
  intensity: ExerciseIntensity;
  description: string;
  recommended?: boolean;
  recommendationReason?: string;
};

export type WeeklyExerciseRoutine = {
  day: string;
  dateLabel: string;
  exercises: Exercise[];
};
