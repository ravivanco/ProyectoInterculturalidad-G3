import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';

const options = [
  ['sedentario', 'Sedentario', 'Poco o ningún ejercicio durante la semana.'], ['ligero', 'Ligeramente activo', 'Ejercicio ligero entre 1 y 3 días por semana.'],
  ['moderado', 'Moderadamente activo', 'Ejercicio moderado entre 3 y 5 días.'], ['muy_activo', 'Muy activo', 'Ejercicio intenso entre 6 y 7 días.'],
  ['extremo', 'Extremadamente activo', 'Actividad intensa diaria o trabajo físico.'],
] as const;

export function ActivityScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Activity'>) {
  const { data, updateField } = useOnboarding();
  return <OnboardingLayout description="Selecciona la opción que mejor describe tu rutina semanal." nextDisabled={!data.nivel_actividad} onNext={() => navigation.navigate('Conditions')} step={1} title="¿Cuál es tu nivel de actividad?"><View style={styles.list}>{options.map(([value, title, description]) => <SelectionCard description={description} key={value} onPress={() => updateField('nivel_actividad', value)} selected={data.nivel_actividad === value} title={title} />)}</View></OnboardingLayout>;
}

const styles = StyleSheet.create({ list: { gap: 12 } });
