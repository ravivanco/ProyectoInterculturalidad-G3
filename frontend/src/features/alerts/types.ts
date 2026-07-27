export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  createdAt: string;
  isRead: boolean;
}
