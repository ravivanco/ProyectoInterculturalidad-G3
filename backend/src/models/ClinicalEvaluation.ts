import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClinicalEvaluationAttributes {
  id: number;
  patientId: number;
  weight: number;
  height: number;
  bmi: number;
  calories: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ClinicalEvaluationCreationAttributes = Optional<
  ClinicalEvaluationAttributes,
  'id' | 'bmi' | 'calories' | 'notes' | 'createdAt' | 'updatedAt'
>;

class ClinicalEvaluation
  extends Model<ClinicalEvaluationAttributes, ClinicalEvaluationCreationAttributes>
  implements ClinicalEvaluationAttributes {
  public id!: number;
  public patientId!: number;
  public weight!: number;
  public height!: number;
  public bmi!: number;
  public calories!: number;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClinicalEvaluation.init(
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
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bmi: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clinical_evaluations',
    timestamps: true,
  }
);

export default ClinicalEvaluation;