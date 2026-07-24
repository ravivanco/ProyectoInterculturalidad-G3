import { api } from '../../../lib/axios';
import { endpoints } from '../../../lib/endpoints';
import type { ExerciseItem } from '../types';

export const exerciseApi = {
  getExercises: async (): Promise<ExerciseItem[]> => {
    try {
      const response = await api.get(endpoints.exercises.base);
      return response.data || [];
    } catch {
      return [
        {
          id: 'ex-1',
          name: 'Caminar a paso ligero',
          category: 'Cardio',
          isActive: true,
          muscleGroup: 'Cuerpo Completo',
          recommendedDurationMin: 30,
          metValue: 3.8,
        },
        {
          id: 'ex-2',
          name: 'Trotar suave',
          category: 'Cardio',
          isActive: true,
          muscleGroup: 'Cuerpo Completo',
          recommendedDurationMin: 20,
          metValue: 7.0,
        },
        {
          id: 'ex-3',
          name: 'Sentadillas con peso corporal',
          category: 'Fuerza',
          isActive: true,
          muscleGroup: 'Piernas',
          recommendedDurationMin: 15,
          metValue: 5.0,
        },
        {
          id: 'ex-4',
          name: 'Plancha abdominal',
          category: 'Fuerza',
          isActive: true,
          muscleGroup: 'Core',
          recommendedDurationMin: 10,
          metValue: 3.0,
        },
      ];
    }
  },
};
