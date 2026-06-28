import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { CheckOption } from '../../components/CheckOption';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
const conditions = ['Diabetes tipo 2', 'Hipertensión', 'Hipotiroidismo', 'Gastritis', 'Colesterol alto', 'Anemia', 'Ninguna'];
export function ConditionsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Conditions'>) {
  const { data, updateField } = useOnboarding();
  const toggle = (condition: string) => { if (condition === 'Ninguna') return updateField('condiciones', ['Ninguna']); const values = data.condiciones.filter((item) => item !== 'Ninguna'); updateField('condiciones', values.includes(condition) ? values.filter((item) => item !== condition) : [...values, condition]); };
  return <OnboardingLayout description="Puedes seleccionar varias opciones o indicar que no tienes ninguna." nextDisabled={data.condiciones.length === 0} onBack={navigation.goBack} onNext={() => navigation.navigate('Allergies')} step={2} title="Condiciones médicas"><View style={styles.list}>{conditions.map((condition) => <CheckOption key={condition} label={condition} onPress={() => toggle(condition)} selected={data.condiciones.includes(condition)} />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ list: { gap: 10 } });
