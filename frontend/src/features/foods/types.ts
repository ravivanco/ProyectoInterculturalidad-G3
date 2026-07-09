export type FoodCategory = 'Prote├¡nas' | 'Carbohidratos' | 'Grasas' | 'Frutas' | 'Verduras' | 'L├ícteos';

export type NutritionalFilter = 'all' | 'high-protein' | 'low-carb' | 'low-fat' | 'low-cal';

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  servingSize: string; // ej. "100g", "1 pieza", "1 taza (200ml)"
  calories: number;    // kcal por raci├│n
  protein: number;     // gramos de prote├¡na
  carbs: number;       // gramos de carbohidratos
  fat: number;         // gramos de grasas
  isActive: boolean;
  createdAt: string;
}

export interface CreateFoodInput {
  name: string;
  category: FoodCategory;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}