import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { CheckOption } from '../../components/CheckOption';
import { FormField } from '../../components/FormField';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
import { colors } from '../../theme/colors';
const allergies = ['Mariscos', 'Frutos secos', 'Lácteos', 'Gluten', 'Huevos', 'Soya', 'Ninguna'];
const intolerances = ['Lactosa', 'Gluten', 'Fructosa'];
const toggleValue = (values: string[], value: string) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
export function AllergiesScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Allergies'>) {
  const { data, updateField } = useOnboarding();
  const toggleAllergy = (value: string) => { if (value === 'Ninguna') { updateField('alergias', ['Ninguna']); updateField('intolerancias', []); return; } updateField('alergias', toggleValue(data.alergias.filter((item) => item !== 'Ninguna'), value)); };
  return <OnboardingLayout description="Selecciona todas las opciones que correspondan." nextDisabled={data.alergias.length === 0} onBack={navigation.goBack} onNext={() => navigation.navigate('Goal')} step={3} title="Alergias e intolerancias"><Text style={styles.heading}>Alergias</Text><View style={styles.list}>{allergies.map((item) => <CheckOption key={item} label={item} onPress={() => toggleAllergy(item)} selected={data.alergias.includes(item)} />)}</View><Text style={styles.heading}>Intolerancias</Text><View style={styles.list}>{intolerances.map((item) => <CheckOption key={item} label={item} onPress={() => { updateField('alergias', data.alergias.filter((value) => value !== 'Ninguna')); updateField('intolerancias', toggleValue(data.intolerancias, item)); }} selected={data.intolerancias.includes(item)} />)}</View><View style={styles.other}><FormField label="Otra alergia" onChangeText={(value) => updateField('otra_alergia', value)} placeholder="Escribe otra alergia" value={data.otra_alergia} /></View></OnboardingLayout>;
}
const styles = StyleSheet.create({ heading: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 10, marginTop: 18 }, list: { gap: 10 }, other: { marginTop: 20 } });
