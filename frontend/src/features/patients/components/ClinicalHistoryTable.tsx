import type { ClinicalEvaluation } from '../types';

type Props = {
  evaluations: ClinicalEvaluation[];
  isLoading?: boolean;
};

export function ClinicalHistoryTable({ evaluations, isLoading }: Props) {
  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
      <h3 className="text-lg font-bold text-foreground mb-4">Historial de evaluaciones clínicas</h3>

      {isLoading && (
        <div className="py-10 text-center text-muted text-sm">Cargando historial...</div>
      )}

      {!isLoading && evaluations.length === 0 && (
        <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted font-medium">Sin evaluaciones registradas</p>
          <p className="text-muted text-sm mt-1">Registra la primera evaluación clínica del paciente.</p>
        </div>
      )}

      {!isLoading && evaluations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">Fecha</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">Peso</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">Estatura</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">Grasa</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">Músculo</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">IMC</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-muted uppercase">TMB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-surface-hover">
                  <td className="py-2.5 px-3 text-sm text-foreground">{ev.recordedAt}</td>
                  <td className="py-2.5 px-3 text-sm text-muted">{ev.weight} kg</td>
                  <td className="py-2.5 px-3 text-sm text-muted">{ev.height} cm</td>
                  <td className="py-2.5 px-3 text-sm text-muted">{ev.bodyFat}%</td>
                  <td className="py-2.5 px-3 text-sm text-muted">{ev.muscleMass}%</td>
                  <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{ev.bmi}</td>
                  <td className="py-2.5 px-3 text-sm text-muted">{ev.bmr} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
