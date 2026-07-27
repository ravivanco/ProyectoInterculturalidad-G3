import sequelize from '../config/database';
import User from './User';
import PatientProfile from './PatientProfile';
import NutritionistProfile from './NutritionistProfile';

// Set up associations
User.hasOne(PatientProfile, { foreignKey: 'userId', as: 'patientProfile' });
PatientProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(NutritionistProfile, { foreignKey: 'userId', as: 'nutritionistProfile' });
NutritionistProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  PatientProfile,
  NutritionistProfile,
};
