import sequelize from '../config/database';

import User from './User';
import PatientProfile from './PatientProfile';
import NutritionistProfile from './NutritionistProfile';
import Exercise from './Exercise';
import AdditionalIntake from './AdditionalIntake';
import PlanExercise from './PlanExercise';
import ExerciseTracking from './ExerciseTracking';

// Relaciones de perfiles de usuario
User.hasOne(PatientProfile, {
  foreignKey: 'userId',
  as: 'patientProfile',
});

PatientProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(NutritionistProfile, {
  foreignKey: 'userId',
  as: 'nutritionistProfile',
});

NutritionistProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Relaciones de ejercicios asignados al plan
Exercise.hasMany(PlanExercise, {
  foreignKey: 'exerciseId',
  as: 'planAssignments',
});

PlanExercise.belongsTo(Exercise, {
  foreignKey: 'exerciseId',
  as: 'exercise',
});

// Relaciones de tracking
PlanExercise.hasMany(ExerciseTracking, {
  foreignKey: 'planExerciseId',
  as: 'trackingRecords',
});

ExerciseTracking.belongsTo(PlanExercise, {
  foreignKey: 'planExerciseId',
  as: 'planExercise',
});

User.hasMany(ExerciseTracking, {
  foreignKey: 'userId',
  as: 'exerciseTracking',
});

ExerciseTracking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Exportaciones
export {
  sequelize,
  User,
  PatientProfile,
  NutritionistProfile,
  Exercise,
  AdditionalIntake,
  PlanExercise,
  ExerciseTracking,
};