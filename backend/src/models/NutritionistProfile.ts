import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface NutritionistProfileAttributes {
  id?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NutritionistProfile extends Model<NutritionistProfileAttributes> implements NutritionistProfileAttributes {
  public id!: string;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NutritionistProfile.init(
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
  },
  {
    sequelize,
    tableName: 'nutritionist_profiles',
    timestamps: true,
  }
);

export default NutritionistProfile;
