import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface PatientProfileAttributes {
  id?: string;
  userId: string;
  estado_tratamiento: 'pendiente' | 'activo' | 'finalizado';
  createdAt?: Date;
  updatedAt?: Date;
}

export class PatientProfile extends Model<PatientProfileAttributes> implements PatientProfileAttributes {
  public id!: string;
  public userId!: string;
  public estado_tratamiento!: 'pendiente' | 'activo' | 'finalizado';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PatientProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    estado_tratamiento: {
      type: DataTypes.ENUM('pendiente', 'activo', 'finalizado'),
      defaultValue: 'pendiente',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'patient_profiles',
    timestamps: true,
  }
);

export default PatientProfile;
