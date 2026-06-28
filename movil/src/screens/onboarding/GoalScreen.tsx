import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { SelectionCard } from '../../components/SelectionCard';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
const goals = [['bajar_peso', 'Bajar de peso', 'Alcanzar un peso saludable de forma progresiva.'], ['mantener_peso', 'Mantener peso', 'Conservar tu peso y mejorar tus hábitos.'], ['ganar_masa', 'Ganar masa muscular', 'Apoyar el desarrollo muscular con nutrición.'], ['mejorar_alimentacion', 'Mejorar alimentación', 'Construir una rutina alimentaria equilibrada.']] as const;
export function GoalScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Goal'>) {
 const { data, updateField } = useOnboarding();
 return <OnboardingLayout description="Elige el objetivo principal que guiará tu plan." nextDisabled={!data.objetivo_nutricional} onBack={navigation.goBack} onNext={() => navigation.navigate('Sports')} step={4} title="Tu objetivo nutricional"><View style={styles.list}>{goals.map(([value, title, description]) => <SelectionCard description={description} key={value} onPress={() => updateField('objetivo_nutricional', value)} selected={data.objetivo_nutricional === value} title={title} />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ list: { gap: 12 } });
