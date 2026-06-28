import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FormField } from '../../components/FormField';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { ToggleChip } from '../../components/ToggleChip';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
import { colors } from '../../theme/colors';
const catalog = ['Azúcar', 'Sal', 'Frituras', 'Cerdo', 'Mariscos', 'Lácteos', 'Gluten', 'Huevos'];
export function RestrictionsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Restrictions'>) {
  const { data, updateField } = useOnboarding();
  const [query, setQuery] = useState('');
  const [withoutRestrictions, setWithoutRestrictions] = useState(false);
  const suggestions = useMemo(() => query.trim() ? catalog.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()) && !data.restricciones_alimenticias.includes(item)) : [], [data.restricciones_alimenticias, query]);
  const add = (value: string) => { const normalized = value.trim(); if (!normalized || data.restricciones_alimenticias.includes(normalized)) return; updateField('restricciones_alimenticias', [...data.restricciones_alimenticias, normalized]); setWithoutRestrictions(false); setQuery(''); };
  return <OnboardingLayout description="Agrega los alimentos que no deseas o no puedes consumir." nextDisabled={!withoutRestrictions && data.restricciones_alimenticias.length === 0} nextTitle="Continuar" onBack={navigation.goBack} onNext={() => undefined} step={7} title="Restricciones alimenticias"><FormField label="Buscar o agregar alimento" onChangeText={setQuery} onSubmitEditing={() => add(query)} placeholder="Ej. azúcar" returnKeyType="done" value={query} /><View style={styles.suggestions}>{suggestions.map((item) => <Pressable key={item} onPress={() => add(item)} style={styles.suggestion}><Text style={styles.suggestionText}>Agregar {item}</Text></Pressable>)}</View><Pressable onPress={() => { setWithoutRestrictions(true); updateField('restricciones_alimenticias', []); }} style={[styles.none, withoutRestrictions ? styles.noneSelected : undefined]}><Text style={[styles.noneText, withoutRestrictions ? styles.noneTextSelected : undefined]}>Sin restricciones</Text></Pressable><View style={styles.chips}>{data.restricciones_alimenticias.map((item) => <ToggleChip key={item} label={`${item} ×`} onPress={() => updateField('restricciones_alimenticias', data.restricciones_alimenticias.filter((value) => value !== item))} selected />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ suggestions: { gap: 6, marginTop: 8 }, suggestion: { backgroundColor: colors.surface, borderRadius: 8, padding: 12 }, suggestionText: { color: colors.primary, fontWeight: '700' }, none: { alignItems: 'center', borderColor: colors.primary, borderRadius: 12, borderWidth: 1, marginTop: 18, padding: 14 }, noneSelected: { backgroundColor: colors.primary }, noneText: { color: colors.primary, fontWeight: '700' }, noneTextSelected: { color: colors.surface }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 } });
