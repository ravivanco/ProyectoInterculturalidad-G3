import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { ToggleChip } from '../../components/ToggleChip';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
const sports = ['Fútbol', 'Natación', 'Ciclismo', 'Yoga', 'Caminata', 'Gym/Pesas', 'Running', 'Ninguno'];
export function SportsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Sports'>) {
 const { data, updateField } = useOnboarding();
 const toggle = (value: string) => { if (value === 'Ninguno') return updateField('deportes', ['Ninguno']); const values = data.deportes.filter((item) => item !== 'Ninguno'); updateField('deportes', values.includes(value) ? values.filter((item) => item !== value) : [...values, value]); };
 return <OnboardingLayout description="Selecciona una o varias actividades, o indica que no practicas ninguna." nextDisabled={data.deportes.length === 0} onBack={navigation.goBack} onNext={() => navigation.navigate('Preferences')} step={5} title="Deporte habitual"><View style={styles.chips}>{sports.map((sport) => <ToggleChip key={sport} label={sport} onPress={() => toggle(sport)} selected={data.deportes.includes(sport)} />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 } });
