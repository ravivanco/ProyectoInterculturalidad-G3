// PG3-343 — Registro de peso (API-S4, Bryan Gualpa)
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WeightLogAttributes {
  id: string;
  patientId: string;
  weightKg: number;
  loggedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type WeightLogCreation = Optional<WeightLogAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class WeightLog extends Model<WeightLogAttributes, WeightLogCreation> implements WeightLogAttributes {
  public id!: string;
  public patientId!: string;
  public weightKg!: number;
  public loggedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WeightLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
    weightKg: { type: DataTypes.FLOAT, allowNull: false, field: 'weight_kg' },
    loggedAt: { type: DataTypes.DATE, allowNull: false, field: 'logged_at' },
  },
  { sequelize, tableName: 'weight_logs', timestamps: true }
);

export default WeightLog;
