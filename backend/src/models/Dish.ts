export interface Dish {
  id?: number;
  nombre: string;
  tipo_comida: string;
  calorias_total?: number;
  imagen_url?: string;
  preparacion?: string;
}

export interface DishIngredient {
  id?: number;
  dish_id?: number;
  food_id: number;
  cantidad: number;
  unidad: string;
}