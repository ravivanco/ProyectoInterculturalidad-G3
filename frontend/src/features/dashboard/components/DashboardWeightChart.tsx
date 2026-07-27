import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_WEIGHT_DATA = [
  { date: '29-may', weight: 73.1 },
  { date: '07-jun', weight: 81.1 },
  { date: '11-jun', weight: 87.0 },
  { date: '17-jun', weight: 84.5 },
  { date: '19-jun', weight: 82.3 },
];

export function DashboardWeightChart() {
  const [filter, setFilter] = useState('3/3');

  return (
    <div className="col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <p className="text-[13px] font-bold text-foreground">Evolución del Peso Promedio</p>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[11px] border border-border bg-surface text-foreground rounded-lg px-2 py-1 outline-none"
        >
          <option value="3/3">Todos los pacientes</option>
          <option value="1">Selección Activos</option>
        </select>
      </div>
      <p className="text-[11px] text-muted mb-6 -mt-4">Registros recientes de evolución</p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_WEIGHT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
            <XAxis 
              dataKey="date" 
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
            <Line 
              type="monotone" 
              dataKey="weight" 
              name="Peso (kg)" 
              stroke="#eab308" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
