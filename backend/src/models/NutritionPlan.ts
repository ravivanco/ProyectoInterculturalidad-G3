import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NutritionPlanAttributes {
  id: number;
  patientId: number;
  modulo_habilitado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type NutritionPlanCreationAttributes = Optional<
  NutritionPlanAttributes,
  'id' | 'modulo_habilitado' | 'createdAt' | 'updatedAt'
>;

class NutritionPlan
  extends Model<NutritionPlanAttributes, NutritionPlanCreationAttributes>
  implements NutritionPlanAttributes {
  public id!: number;
  public patientId!: number;
  public modulo_habilitado!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NutritionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
    },
    modulo_habilitado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'nutrition_plans',
    timestamps: true,
    underscored: true,
  }
);

export default NutritionPlan;