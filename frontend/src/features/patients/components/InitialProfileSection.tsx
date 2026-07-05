import type { OnboardingProfile } from '../types';

type Props = { profile?: OnboardingProfile };

function ChipList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-muted text-sm italic">Ninguno registrado</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="px-2.5 py-1 rounded-full bg-surface-hover border border-border text-[12px] text-foreground">
          {item}
        </span>
      ))}
    </div>
  );
}

export function InitialProfileSection({ profile }: Props) {
  if (!profile) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <h3 className="text-lg font-bold text-foreground mb-2">Formulario inicial</h3>
        <p className="text-sm text-muted">El paciente aún no ha completado el formulario de ingreso en la app móvil.</p>
      </div>
    );
  }

  const rows: { label: string; value: string | string[] }[] = [
    { label: 'Nivel de actividad', value: profile.nivel_actividad },
    { label: 'Objetivo nutricional', value: profile.objetivo_nutricional },
    { label: 'Condiciones médicas', value: profile.condiciones },
    { label: 'Alergias', value: profile.alergias },
    { label: 'Intolerancias', value: profile.intolerancias },
    { label: 'Deportes habituales', value: profile.deportes },
    { label: 'Preferencias alimenticias', value: profile.preferencias_alimenticias },
    { label: 'Restricciones alimenticias', value: profile.restricciones_alimenticias },
  ];

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      <h3 className="text-lg font-bold text-foreground mb-6">Formulario inicial del paciente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{row.label}</p>
            {Array.isArray(row.value) ? (
              <ChipList items={row.value} />
            ) : (
              <p className="text-sm text-foreground font-medium">{row.value || '—'}</p>
            )}
          </div>
        ))}
      </div>
      {profile.otra_alergia && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Otra alergia</p>
          <p className="text-sm text-foreground">{profile.otra_alergia}</p>
        </div>
      )}
    </div>
  );
}
