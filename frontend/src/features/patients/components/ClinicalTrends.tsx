import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { ClinicalEvaluation } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  evaluations: ClinicalEvaluation[];
}

export function ClinicalTrends({ evaluations }: Props) {
  const [activeTab, setActiveTab] = useState<'peso' | 'grasa' | 'musculo'>('peso');

  if (evaluations.length < 2) return null;

  // Preparar datos ordenados cronológicamente
  const data = [...evaluations]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(e => ({
      fecha: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      peso: e.weight,
      grasa: e.bodyFat,
      musculo: e.muscleMass
    }));

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-colors mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Tendencias Clínicas</h2>
            <p className="text-sm text-muted">Evolución del paciente en el tiempo.</p>
          </div>
        </div>

        <div className="flex p-1 bg-surface-hover rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('peso')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'peso' ? 'bg-white dark:bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            Peso
          </button>
          <button
            onClick={() => setActiveTab('grasa')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'grasa' ? 'bg-white dark:bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            Grasa %
          </button>
          <button
            onClick={() => setActiveTab('musculo')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'musculo' ? 'bg-white dark:bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            Músculo
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
            <XAxis 
              dataKey="fecha" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            {activeTab === 'peso' && (
              <Line 
                type="monotone" 
                dataKey="peso" 
                name="Peso (kg)" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            )}
            {activeTab === 'grasa' && (
              <Line 
                type="monotone" 
                dataKey="grasa" 
                name="Grasa Corp. (%)" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            )}
            {activeTab === 'musculo' && (
              <Line 
                type="monotone" 
                dataKey="musculo" 
                name="Masa Musc. (kg)" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
