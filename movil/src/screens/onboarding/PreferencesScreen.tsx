import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { ToggleChip } from '../../components/ToggleChip';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
const foods = ['Pollo', 'Res', 'Cerdo', 'Pescado', 'Mariscos', 'Vegetales', 'Frutas', 'Legumbres', 'Lácteos', 'Cereales integrales'];
export function PreferencesScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Preferences'>) {
 const { data, updateField } = useOnboarding();
 const toggle = (value: string) => updateField('preferencias_alimenticias', data.preferencias_alimenticias.includes(value) ? data.preferencias_alimenticias.filter((item) => item !== value) : [...data.preferencias_alimenticias, value]);
 return <OnboardingLayout description="Puedes elegir varias opciones según tus gustos." nextDisabled={data.preferencias_alimenticias.length === 0} onBack={navigation.goBack} onNext={() => navigation.navigate('Restrictions')} step={6} title="Preferencias alimenticias"><View style={styles.chips}>{foods.map((food) => <ToggleChip key={food} label={food} onPress={() => toggle(food)} selected={data.preferencias_alimenticias.includes(food)} />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } });
