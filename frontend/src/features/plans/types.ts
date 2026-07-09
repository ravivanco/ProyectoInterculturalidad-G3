export type MealType = 'Desayuno' | 'Colaci├│n matutina' | 'Almuerzo' | 'Colaci├│n vespertina' | 'Cena';

export interface MealConfig {
  id: string;
  name: MealType | string;
  suggestedTime: string; // ej. "08:00 AM", "14:00 PM"
  targetCalories: number; // kcal sugeridas por toma
  isEnabled: boolean;
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Mi├⌐rcoles' | 'Jueves' | 'Viernes' | 'S├íbado' | 'Domingo';

export interface DayPlanStructure {
  day: DayOfWeek;
  meals: MealConfig[];
}

export interface WeeklyPlan {
  id: string;
  title: string;
  patientName?: string;
  objective: string;
  includeWeekends: boolean; // false -> Lunes a Viernes (5 d├¡as), true -> Lunes a Domingo (7 d├¡as)
  days: DayPlanStructure[];
  createdAt: string;
  updatedAt: string;
}