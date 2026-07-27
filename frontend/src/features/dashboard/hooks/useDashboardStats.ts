import { useState, useEffect } from 'react';

import { foodApi } from '../../foods/services/foodApi';
import { exerciseApi } from '../../exercises/services/exerciseApi';
import { plansApi } from '../../plans/services/plansApi';
import { patientsAPI } from '../../patients/services/patientsApi';

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  pendingPatients: number;
  totalFoods: number;
  totalExercises: number;
  totalPlans: number;
  activePlans: number;
  isLoading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    pendingPatients: 0,
    totalFoods: 0,
    totalExercises: 0,
    totalPlans: 0,
    activePlans: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [patients, foods, exercises, plans] = await Promise.all([
          patientsAPI.getPatients().catch(() => []),
          foodApi.getFoods().catch(() => []),
          exerciseApi.getExercises().catch(() => []),
          plansApi.getPlans().catch(() => []),
        ]);

        const patientList = Array.isArray(patients) ? patients : [];
        const foodList = Array.isArray(foods) ? foods : [];
        const exerciseList = Array.isArray(exercises) ? exercises : [];
        const planList = Array.isArray(plans) ? plans : [];

        setStats({
          totalPatients: patientList.length,
          activePatients: patientList.filter((p: any) => p.treatmentState === 'Activo').length,
          pendingPatients: patientList.filter((p: any) => !p.treatmentState || p.treatmentState === 'Pendiente').length,
          totalFoods: foodList.filter((f: any) => f.isActive !== false).length,
          totalExercises: exerciseList.filter((e: any) => e.isActive !== false).length,
          totalPlans: planList.length,
          activePlans: planList.filter((p: any) => p.status === 'active').length,
          isLoading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchAll();
  }, []);

  return stats;
}
