import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_COMPOSITION_DATA = [
  { date: '29-may', fat: 25.1, muscle: 38.5 },
  { date: '07-jun', fat: 24.2, muscle: 39.0 },
  { date: '11-jun', fat: 23.5, muscle: 39.2 },
  { date: '17-jun', fat: 22.8, muscle: 39.8 },
  { date: '19-jun', fat: 22.1, muscle: 40.5 },
];

export function DashboardCompositionChart() {
  const [filter, setFilter] = useState('3/3');

  return (
    <div className="col-span-1 bg-surface rounded-2xl border border-border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <p className="text-[13px] font-bold text-foreground">Composición</p>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[11px] border border-border bg-surface text-foreground rounded-lg px-2 py-1 outline-none"
        >
          <option value="3/3">Promedio</option>
        </select>
      </div>
      <p className="text-[11px] text-muted mb-6 -mt-4">Grasa y músculo</p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_COMPOSITION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMuscle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey="muscle" name="Músculo (kg)" stroke="#10b981" fillOpacity={1} fill="url(#colorMuscle)" />
            <Area type="monotone" dataKey="fat" name="Grasa (%)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorFat)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
