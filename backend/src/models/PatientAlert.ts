// PG3-350 / PG3-354 — Alertas de adherencia (API-S5, Bryan Gualpa)
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PatientAlertAttributes {
  id: string;
  patientId: string;
  alertType: 'adherencia_baja' | 'peso_tendencia' | 'consumo_extra' | 'comida_pendiente';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  acknowledged: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type PatientAlertCreation = Optional<
  PatientAlertAttributes,
  'id' | 'severity' | 'acknowledged' | 'createdAt' | 'updatedAt'
>;

class PatientAlert
  extends Model<PatientAlertAttributes, PatientAlertCreation>
  implements PatientAlertAttributes {
  public id!: string;
  public patientId!: string;
  public alertType!: PatientAlertAttributes['alertType'];
  public message!: string;
  public severity!: PatientAlertAttributes['severity'];
  public acknowledged!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PatientAlert.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
    alertType: {
      type: DataTypes.ENUM('adherencia_baja', 'peso_tendencia', 'consumo_extra', 'comida_pendiente'),
      allowNull: false,
      field: 'alert_type',
    },
    message: { type: DataTypes.STRING(500), allowNull: false },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'critical'),
      defaultValue: 'warning',
    },
    acknowledged: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, tableName: 'patient_alerts', timestamps: true }
);

export default PatientAlert;
