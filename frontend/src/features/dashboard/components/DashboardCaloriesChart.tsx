import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MOCK_CALORIES_DATA = [
  { day: 'Lun', recom: 2200, cons: 2150 },
  { day: 'Mar', recom: 2200, cons: 2300 },
  { day: 'Mié', recom: 2200, cons: 1900 },
  { day: 'Jue', recom: 2200, cons: 2100 },
  { day: 'Vie', recom: 2200, cons: 2500 },
  { day: 'Sáb', recom: 2500, cons: 2400 },
  { day: 'Dom', recom: 2500, cons: 2800 },
];

export function DashboardCaloriesChart() {
  const [filter, setFilter] = useState('3/3');

  return (
    <div className="col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <p className="text-[13px] font-bold text-foreground">Calorías: Recomendadas vs Consumidas</p>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[11px] border border-border bg-surface text-foreground rounded-lg px-2 py-1 outline-none"
        >
          <option value="3/3">Promedio Semanal</option>
        </select>
      </div>
      <p className="text-[11px] text-muted mb-6 -mt-4">Comparación diaria de ingesta calórica</p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_CALORIES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
              domain={[0, 3000]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
              cursor={{ fill: 'transparent' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="recom" name="Recomendadas (kcal)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cons" name="Consumidas (kcal)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
