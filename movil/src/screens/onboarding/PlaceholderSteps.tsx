import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
export function PreferencesPlaceholder({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Preferences'>) { return <OnboardingLayout description="Selecciona los alimentos que disfrutas." nextDisabled onBack={navigation.goBack} onNext={() => undefined} step={6} title="Preferencias"><Text>Completa la información para continuar.</Text></OnboardingLayout>; }
export function RestrictionsPlaceholder({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Restrictions'>) { return <OnboardingLayout description="Indica qué alimentos deseas evitar." nextDisabled onBack={navigation.goBack} onNext={() => undefined} step={7} title="Restricciones"><Text>Completa la información para continuar.</Text></OnboardingLayout>; }
