import { useState, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Info, Filter, CheckCircle2 } from 'lucide-react';
import { MOCK_ALERTS } from './mockAlerts';
import type { AlertSeverity } from './types';

export function Alerts() {
  const [filter, setFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const filteredAlerts = useMemo(() => {
    if (filter === 'ALL') return alerts;
    return alerts.filter(a => a.severity === filter);
  }, [alerts, filter]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="text-rose-500" />;
      case 'WARNING': return <AlertTriangle className="text-amber-500" />;
      case 'INFO': return <Info className="text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'INFO': return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 relative animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
          <AlertCircle size={16} />
          <span>Gestión Clínica</span>
        </div>
        <h1 className="text-[30px] font-bold text-foreground">Centro de Alertas</h1>
        <p className="text-muted text-[13px] mt-1">
          Monitorea desviaciones y riesgos de los pacientes en tiempo real.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted" />
          <span className="font-bold text-sm text-foreground">Filtros:</span>
        </div>
        <div className="flex items-center gap-2">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === sev
                  ? 'bg-primary text-gray-900 shadow-sm'
                  : 'bg-surface-hover text-muted hover:text-foreground border border-border'
              }`}
            >
              {sev === 'ALL' ? 'Todas' : sev === 'CRITICAL' ? 'Críticas' : sev === 'WARNING' ? 'Advertencias' : 'Informativas'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted font-semibold bg-surface rounded-3xl border border-border shadow-sm">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500 opacity-50" />
            No hay alertas para mostrar en esta categoría.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className={`bg-surface rounded-2xl border transition-all shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
              alert.isRead ? 'border-border opacity-75' : 'border-border border-l-4 border-l-primary shadow-md'
            }`}>
              <div className="flex items-start gap-4 flex-1">
                <div className="shrink-0 mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-foreground text-base">{alert.patientName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                      {alert.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted font-medium mb-2">{alert.message}</p>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    Generada: {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!alert.isRead && (
                <button
                  onClick={() => markAsRead(alert.id)}
                  className="shrink-0 bg-surface-hover hover:bg-border text-foreground font-bold text-xs px-4 py-2 rounded-xl transition-all border border-border flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Marcar Revisado
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
