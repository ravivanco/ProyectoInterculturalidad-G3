import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

import { initialOnboardingData, type OnboardingData } from '../types/onboarding';

type ContextValue = {
  data: OnboardingData;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  reset: () => void;
};

const OnboardingContext = createContext<ContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState(initialOnboardingData);
  const value = useMemo<ContextValue>(() => ({
    data,
    updateField: (field, fieldValue) => setData((current) => ({ ...current, [field]: fieldValue })),
    reset: () => setData(initialOnboardingData),
  }), [data]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error('useOnboarding debe usarse dentro de OnboardingProvider.');
  return value;
}
