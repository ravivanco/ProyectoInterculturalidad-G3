import { useState, useMemo } from 'react';
import { BarChart2, Scale, AlertTriangle, TrendingUp, TrendingDown, Target, Camera, CheckCircle, Clock } from 'lucide-react';
import { MOCK_ADHERENCE, MOCK_WEIGHT_HISTORY, MOCK_EXTRA_CONSUMPTION } from './mockTracking';

export function Tracking() {
  const [activeTab, setActiveTab] = useState<'adherence' | 'weight' | 'extras'>('adherence');

  const { adherence, weightHistory, extras } = useMemo(() => ({
    adherence: MOCK_ADHERENCE,
    weightHistory: MOCK_WEIGHT_HISTORY,
    extras: MOCK_EXTRA_CONSUMPTION
  }), []);

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const firstWeight = weightHistory[0]?.weight || 0;
  const weightDiff = latestWeight - firstWeight;

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
          <BarChart2 size={16} />
          <span>Módulo de Seguimiento</span>
        </div>
        <h1 className="text-[30px] font-bold text-foreground">Seguimiento de Paciente</h1>
        <p className="text-muted text-[13px] mt-1">
          Monitoriza el progreso, adherencia al plan y consumos adicionales de tu paciente.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar">
        {[
          { id: 'adherence', label: 'Adherencia (HU24-HU25)', icon: <Target size={16} /> },
          { id: 'weight', label: 'Evolución de Peso (HU26)', icon: <Scale size={16} /> },
          { id: 'extras', label: 'Consumos Extra (HU27-HU30)', icon: <AlertTriangle size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted hover:text-foreground hover:bg-surface-hover/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'adherence' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Target className="text-primary" /> Índice de Adherencia General
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="text-surface-hover"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                    <path
                      className={adherence.overallAdherence >= 80 ? 'text-emerald-500' : 'text-amber-500'}
                      strokeDasharray={`${adherence.overallAdherence}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-4xl font-extrabold text-foreground">{adherence.overallAdherence}%</span>
                    <span className="block text-[11px] text-muted font-bold mt-1 uppercase tracking-wider">
                      {adherence.overallAdherence >= 80 ? 'Excelente' : 'Necesita Mejora'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm flex flex-col justify-center gap-6">
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Desglose Específico</h3>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Cumplimiento Calórico</span>
                  <span className="text-primary">{adherence.caloricAdherence}%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${adherence.caloricAdherence}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Cumplimiento de Macros</span>
                  <span className="text-blue-500">{adherence.macroAdherence}%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${adherence.macroAdherence}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Cumplimiento Físico</span>
                  <span className="text-emerald-500">{adherence.physicalAdherence}%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${adherence.physicalAdherence}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weight' && (
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Scale className="text-primary" /> Historial de Peso
              </h3>
              <div className="bg-surface-hover px-4 py-2 rounded-2xl flex items-center gap-3 border border-border text-sm font-bold">
                <span className="text-muted">Progreso Total:</span>
                <span className={`flex items-center gap-1 ${weightDiff < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {weightDiff < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  {Math.abs(weightDiff).toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Simulación visual del gráfico */}
            <div className="h-64 flex items-end justify-between gap-2 border-l border-b border-border p-4 relative">
              {weightHistory.map((record, index) => {
                const height = `${((record.weight - 75) / 15) * 100}%`; // Normalización simple
                return (
                  <div key={record.id} className="w-full flex flex-col items-center gap-3 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-opacity pointer-events-none z-10">
                      {record.weight} kg (Grasa: {record.fatPercentage}%)
                    </div>
                    {/* Barra */}
                    <div 
                      className="w-12 bg-primary/20 hover:bg-primary/40 rounded-t-xl transition-all cursor-pointer border-t-2 border-primary" 
                      style={{ height }}
                    ></div>
                    {/* Etiqueta */}
                    <span className="text-[10px] font-bold text-muted uppercase">
                      {new Date(record.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'extras' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <AlertTriangle className="text-amber-500" /> Consumos Fuera de Plan
                </h3>
                <p className="text-muted text-sm">El paciente ha reportado comidas adicionales que impactan su adherencia calórica.</p>
              </div>
              <div className="text-center md:text-right bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-2xl">
                <span className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Desviación Total</span>
                <span className="text-2xl font-extrabold text-amber-600">+{extras.reduce((acc, curr) => acc + curr.estimatedCalories, 0)} kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {extras.map((extra) => (
                <div key={extra.id} className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  {extra.photoUrl && (
                    <div className="h-48 w-full bg-surface-hover relative overflow-hidden group">
                      <img src={extra.photoUrl} alt={extra.foodName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Camera size={12} /> Evidencia Adjunta
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{extra.foodName}</h4>
                        <span className="text-xs text-muted font-semibold mt-1 block">
                          {new Date(extra.date).toLocaleString()}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        extra.impact === 'HIGH' ? 'bg-rose-500/10 text-rose-500' :
                        extra.impact === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        Impacto {extra.impact}
                      </span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                        <Flame size={16} className="text-amber-500" /> +{extra.estimatedCalories} kcal
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted">
                        {extra.status === 'PENDING' ? (
                          <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded"><Clock size={14}/> Pendiente de Revisión</span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded"><CheckCircle size={14}/> Revisado</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
