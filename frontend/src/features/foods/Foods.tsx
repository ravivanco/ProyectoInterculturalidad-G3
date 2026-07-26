import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Food } from './types';
import { foodApi } from './services/foodApi';
import { FoodForm } from './FoodForm';

export const Foods = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | undefined>();

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await foodApi.getFoods();
      setFoods(data);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFood(undefined);
    setShowForm(true);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este alimento?')) {
      await foodApi.deleteFood(id);
      loadFoods();
    }
  };

  const handleSubmit = async (data: Omit<Food, 'id'>) => {
    if (editingFood) {
      await foodApi.updateFood(editingFood.id, data);
    } else {
      await foodApi.createFood(data);
    }
    setShowForm(false);
    loadFoods();
  };

  if (loading && !showForm) {
    return <div className="p-8 text-center text-gray-500">Cargando base de alimentos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Base de Alimentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los alimentos para incluirlos en los planes nutricionales.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Nuevo Alimento
          </button>
        )}
      </div>

      {showForm ? (
        <div className="max-w-2xl mx-auto">
          <FoodForm
            initialData={editingFood}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Calorías (kcal)</th>
                  <th className="px-6 py-4">Proteínas (g)</th>
                  <th className="px-6 py-4">Carbohidratos (g)</th>
                  <th className="px-6 py-4">Grasas (g)</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No hay alimentos registrados. Haz clic en "Nuevo Alimento" para agregar uno.
                    </td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{food.name}</td>
                      <td className="px-6 py-4 text-gray-600">{food.calories}</td>
                      <td className="px-6 py-4 text-gray-600">{food.proteins}</td>
                      <td className="px-6 py-4 text-gray-600">{food.carbs}</td>
                      <td className="px-6 py-4 text-gray-600">{food.fats}</td>
                      <td className="px-6 py-4">
                        {food.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle size={12} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <XCircle size={12} /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(food)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
