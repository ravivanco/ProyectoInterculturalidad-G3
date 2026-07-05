import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  clinicalEvaluationsAPI,
  validateEvaluationInput,
} from '../services/clinicalEvaluationsApi';
import type { ClinicalEvaluation, ClinicalEvaluationInput } from '../types';

type Props = {
  patientId: string;
  onCreated: (evaluation: ClinicalEvaluation) => void;
};

const emptyForm: ClinicalEvaluationInput = {
  weight: 0,
  height: 0,
  bodyFat: 0,
  muscleMass: 0,
};

export function ClinicalEvaluationForm({ patientId, onCreated }: Props) {
  const [form, setForm] = useState<ClinicalEvaluationInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (field: keyof ClinicalEvaluationInput, raw: string) => {
    const value = raw === '' ? 0 : Number(raw);
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEvaluationInput(form);
    if (validation) {
      setError(validation);
      return;
    }
    setIsSaving(true);
    try {
      const created = await clinicalEvaluationsAPI.create(patientId, form);
      onCreated(created);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      setError('No fue posible guardar la evaluación.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-foreground">Nueva evaluación clínica</h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-gray-900 font-semibold py-2 px-4 rounded-full text-sm"
          >
            <Plus size={16} /> Registrar
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            ['weight', 'Peso (kg)'],
            ['height', 'Estatura (cm)'],
            ['bodyFat', 'Grasa corporal (%)'],
            ['muscleMass', 'Masa muscular (%)'],
          ] as const).map(([field, label]) => (
            <div key={field}>
              <label className="block text-[11px] font-semibold text-muted mb-1">{label}</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>
          ))}
          {error && (
            <div className="col-span-full p-3 bg-red-50 dark:bg-red-500/10 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
          <div className="col-span-full flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary-hover text-gray-900 font-semibold py-2 px-5 rounded-full text-sm disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : 'Guardar evaluación'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(null); }}
              className="text-muted hover:text-foreground text-sm font-medium px-4"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
