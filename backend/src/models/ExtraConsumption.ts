// PG3-344 — Consumos adicionales (API-S4, Bryan Gualpa)
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExtraConsumptionAttributes {
  id: string;
  patientId: string;
  description: string;
  calories: number;
  imageUrl?: string;
  loggedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type ExtraConsumptionCreation = Optional<
  ExtraConsumptionAttributes,
  'id' | 'imageUrl' | 'createdAt' | 'updatedAt'
>;

class ExtraConsumption
  extends Model<ExtraConsumptionAttributes, ExtraConsumptionCreation>
  implements ExtraConsumptionAttributes {
  public id!: string;
  public patientId!: string;
  public description!: string;
  public calories!: number;
  public imageUrl?: string;
  public loggedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExtraConsumption.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
    description: { type: DataTypes.STRING(500), allowNull: false },
    calories: { type: DataTypes.FLOAT, allowNull: false },
    imageUrl: { type: DataTypes.STRING(1024), allowNull: true, field: 'image_url' },
    loggedAt: { type: DataTypes.DATE, allowNull: false, field: 'logged_at' },
  },
  { sequelize, tableName: 'extra_consumptions', timestamps: true }
);

export default ExtraConsumption;
