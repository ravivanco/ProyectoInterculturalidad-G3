import type { Exercise, WeeklyExerciseRoutine } from '../types/exercise';
import { apiRequest } from './api';
import { getToken } from './tokenStorage';

const exerciseCatalog: Exercise[] = [
  { id: 'walk-30', name: 'Caminata controlada', category: 'Cardio', durationMinutes: 30, intensity: 'Baja', description: 'Caminata a ritmo constante para mejorar adherencia cardiovascular.', recommended: true, recommendationReason: 'Adecuada para iniciar o retomar actividad física.' },
  { id: 'bike-25', name: 'Bicicleta estática', category: 'Cardio', durationMinutes: 25, intensity: 'Media', description: 'Trabajo aeróbico moderado con bajo impacto articular.' },
  { id: 'squat-basic', name: 'Sentadillas asistidas', category: 'Fuerza', durationMinutes: 15, intensity: 'Media', description: 'Ejercicio de tren inferior con apoyo para cuidar la técnica.', recommended: true, recommendationReason: 'Fortalece piernas sin requerir equipo especializado.' },
  { id: 'core-basic', name: 'Plancha modificada', category: 'Fuerza', durationMinutes: 10, intensity: 'Media', description: 'Activación de zona media con progresión segura.' },
  { id: 'stretch-full', name: 'Estiramiento general', category: 'Flexibilidad', durationMinutes: 12, intensity: 'Baja', description: 'Rutina suave para liberar tensión muscular.', recommended: true, recommendationReason: 'Complementa días de mayor carga o recuperación.' },
  { id: 'mobility-hips', name: 'Movilidad de cadera', category: 'Movilidad', durationMinutes: 10, intensity: 'Baja', description: 'Movimientos guiados para mejorar rango articular.' },
];

function getExercise(id: string) {
  const exercise = exerciseCatalog.find((item) => item.id === id);
  if (!exercise) throw new Error(`Ejercicio no disponible: ${id}`);
  return exercise;
}

const weeklyRoutine: WeeklyExerciseRoutine[] = [
  { day: 'Lunes', dateLabel: 'Día 1', exercises: [getExercise('walk-30'), getExercise('stretch-full')] },
  { day: 'Martes', dateLabel: 'Día 2', exercises: [getExercise('squat-basic'), getExercise('mobility-hips')] },
  { day: 'Miércoles', dateLabel: 'Día 3', exercises: [] },
  { day: 'Jueves', dateLabel: 'Día 4', exercises: [getExercise('bike-25'), getExercise('stretch-full')] },
  { day: 'Viernes', dateLabel: 'Día 5', exercises: [getExercise('core-basic'), getExercise('mobility-hips')] },
];

export const exerciseService = {
  async getExercises() {
    const token = await getToken();
    if (!token) return exerciseCatalog;

    try {
      return await apiRequest<Exercise[]>('/exercises', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return exerciseCatalog;
    }
  },

  async getWeeklyRoutine() {
    const token = await getToken();
    if (!token) return weeklyRoutine;

    try {
      return await apiRequest<WeeklyExerciseRoutine[]>('/exercises/me/weekly-routine', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return weeklyRoutine;
    }
  },
};
