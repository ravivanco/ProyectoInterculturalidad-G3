import type { Food } from '../types';

let mockFoodsDb: Food[] = [
  { id: '1', name: 'Manzana', calories: 52, proteins: 0.3, carbs: 14, fats: 0.2, isActive: true },
  { id: '2', name: 'Pollo (pechuga)', calories: 165, proteins: 31, carbs: 0, fats: 3.6, isActive: true },
  { id: '3', name: 'Arroz blanco', calories: 130, proteins: 2.7, carbs: 28, fats: 0.3, isActive: true },
];

export const foodApi = {
  getFoods: async (): Promise<Food[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockFoodsDb]), 500));
  },
  
  createFood: async (foodData: Omit<Food, 'id'>): Promise<Food> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFood: Food = {
          ...foodData,
          id: Math.random().toString(36).substr(2, 9),
        };
        mockFoodsDb.push(newFood);
        resolve(newFood);
      }, 500);
    });
  },

  updateFood: async (id: string, foodData: Partial<Food>): Promise<Food> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFoodsDb.findIndex(f => f.id === id);
        if (index > -1) {
          mockFoodsDb[index] = { ...mockFoodsDb[index], ...foodData };
          resolve(mockFoodsDb[index]);
        } else {
          reject(new Error('Food not found'));
        }
      }, 500);
    });
  },
  
  deleteFood: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockFoodsDb = mockFoodsDb.filter(f => f.id !== id);
        resolve();
      }, 500);
    });
  }
};
