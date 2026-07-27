import { Flame, Info } from 'lucide-react';

export function DashboardBalancePanel() {
  return (
    <div className="col-span-1 bg-surface rounded-2xl border border-border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <p className="text-[13px] font-bold text-foreground">Balance Calórico</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-4">
         <div className="relative w-32 h-32 flex items-center justify-center mb-2">
            {/* Círculo animado */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-border" />
               <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="180" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <Flame className="text-red-500 mb-1" size={24} />
               <span className="text-xl font-bold text-foreground">-350</span>
               <span className="text-[10px] text-muted font-medium">kcal/día</span>
            </div>
         </div>
         <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full mt-2">
           Déficit Promedio
         </span>
      </div>
      
      <div className="mt-4 bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20 flex gap-3 items-start">
         <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
         <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
           La mayoría de los pacientes en el sistema mantienen un <strong>déficit moderado</strong> de -350kcal, lo cual está alineado con los objetivos de pérdida de peso.
         </p>
      </div>
    </div>
  );
}
