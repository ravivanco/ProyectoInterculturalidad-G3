// PG3-341 — Tracking de comidas (API-S4, Bryan Gualpa)
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MealLogAttributes {
  id: string;
  patientId: string;
  mealType: 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'otro';
  description?: string;
  calories?: number;
  loggedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type MealLogCreation = Optional<
  MealLogAttributes,
  'id' | 'description' | 'calories' | 'createdAt' | 'updatedAt'
>;

class MealLog extends Model<MealLogAttributes, MealLogCreation> implements MealLogAttributes {
  public id!: string;
  public patientId!: string;
  public mealType!: MealLogAttributes['mealType'];
  public description?: string;
  public calories?: number;
  public loggedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MealLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
    mealType: { type: DataTypes.ENUM('desayuno', 'almuerzo', 'merienda', 'cena', 'otro'), allowNull: false, field: 'meal_type' },
    description: DataTypes.STRING(500),
    calories: DataTypes.FLOAT,
    loggedAt: { type: DataTypes.DATE, allowNull: false, field: 'logged_at' },
  },
  { sequelize, tableName: 'meal_logs', timestamps: true }
);

export default MealLog;
