import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { OnboardingLayout } from '../../components/OnboardingLayout';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';

type RouteName = keyof OnboardingStackParamList;
type Config = { step: number; title: string; description: string; next?: RouteName };

function createStep<Name extends RouteName>(name: Name, config: Config) {
  return function Step({ navigation }: NativeStackScreenProps<OnboardingStackParamList, Name>) {
    return <OnboardingLayout description={config.description} nextDisabled={!config.next} onBack={config.step > 1 ? navigation.goBack : undefined} onNext={() => config.next && navigation.navigate(config.next)} step={config.step} title={config.title}><Text>Completa la información para continuar.</Text></OnboardingLayout>;
  };
}

export const ActivityPlaceholder = createStep('Activity', { step: 1, title: 'Actividad física', description: 'Cuéntanos cuánto te mueves durante la semana.', next: 'Conditions' });
export const ConditionsPlaceholder = createStep('Conditions', { step: 2, title: 'Condiciones médicas', description: 'Selecciona las condiciones que debemos considerar.', next: 'Allergies' });
export const AllergiesPlaceholder = createStep('Allergies', { step: 3, title: 'Alergias e intolerancias', description: 'Ayúdanos a evitar alimentos que puedan afectarte.', next: 'Goal' });
export const GoalPlaceholder = createStep('Goal', { step: 4, title: 'Objetivo nutricional', description: 'Elige tu principal objetivo.', next: 'Sports' });
export const SportsPlaceholder = createStep('Sports', { step: 5, title: 'Deporte habitual', description: 'Selecciona tus actividades habituales.', next: 'Preferences' });
export const PreferencesPlaceholder = createStep('Preferences', { step: 6, title: 'Preferencias', description: 'Selecciona los alimentos que disfrutas.', next: 'Restrictions' });
export const RestrictionsPlaceholder = createStep('Restrictions', { step: 7, title: 'Restricciones', description: 'Indica qué alimentos deseas evitar.' });
