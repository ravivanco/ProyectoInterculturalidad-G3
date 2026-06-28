import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { FormField } from '../../components/FormField';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { ToggleChip } from '../../components/ToggleChip';
import { useOnboarding } from '../../context/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
import { profileService } from '../../services/profileService';
import { saveProfileCompleted } from '../../services/tokenStorage';
import { colors } from '../../theme/colors';
import { isOnboardingComplete } from '../../validation/onboardingValidation';
const catalog = ['Azúcar', 'Sal', 'Frituras', 'Cerdo', 'Mariscos', 'Lácteos', 'Gluten', 'Huevos'];
export function RestrictionsScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Restrictions'>) {
  const { data, updateField } = useOnboarding();
  const [query, setQuery] = useState('');
  const [withoutRestrictions, setWithoutRestrictions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestions = useMemo(() => query.trim() ? catalog.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()) && !data.restricciones_alimenticias.includes(item)) : [], [data.restricciones_alimenticias, query]);
  const add = (value: string) => { const normalized = value.trim(); if (!normalized || data.restricciones_alimenticias.includes(normalized)) return; updateField('restricciones_alimenticias', [...data.restricciones_alimenticias, normalized]); setWithoutRestrictions(false); setQuery(''); };
  const finish = async () => { if (!isOnboardingComplete(data, withoutRestrictions)) { Alert.alert('Faltan datos', 'Completa todos los campos obligatorios antes de finalizar.'); return; } setLoading(true); try { await profileService.updateMyProfile({ ...data, restricciones_alimenticias: withoutRestrictions ? [] : data.restricciones_alimenticias }); await saveProfileCompleted(true); navigation.replace('Success'); } catch { Alert.alert('No pudimos guardar tu perfil', 'Verifica tu conexión y presiona Finalizar para reintentar.'); } finally { setLoading(false); } };
  return <OnboardingLayout description="Agrega los alimentos que no deseas o no puedes consumir." loading={loading} nextDisabled={!isOnboardingComplete(data, withoutRestrictions)} nextTitle="Finalizar" onBack={navigation.goBack} onNext={finish} step={7} title="Restricciones alimenticias"><FormField label="Buscar o agregar alimento" onChangeText={setQuery} onSubmitEditing={() => add(query)} placeholder="Ej. azúcar" returnKeyType="done" value={query} /><View style={styles.suggestions}>{suggestions.map((item) => <Pressable key={item} onPress={() => add(item)} style={styles.suggestion}><Text style={styles.suggestionText}>Agregar {item}</Text></Pressable>)}</View><Pressable onPress={() => { setWithoutRestrictions(true); updateField('restricciones_alimenticias', []); }} style={[styles.none, withoutRestrictions ? styles.noneSelected : undefined]}><Text style={[styles.noneText, withoutRestrictions ? styles.noneTextSelected : undefined]}>Sin restricciones</Text></Pressable><View style={styles.chips}>{data.restricciones_alimenticias.map((item) => <ToggleChip key={item} label={`${item} ×`} onPress={() => updateField('restricciones_alimenticias', data.restricciones_alimenticias.filter((value) => value !== item))} selected />)}</View></OnboardingLayout>;
}
const styles = StyleSheet.create({ suggestions: { gap: 6, marginTop: 8 }, suggestion: { backgroundColor: colors.surface, borderRadius: 8, padding: 12 }, suggestionText: { color: colors.primary, fontWeight: '700' }, none: { alignItems: 'center', borderColor: colors.primary, borderRadius: 12, borderWidth: 1, marginTop: 18, padding: 14 }, noneSelected: { backgroundColor: colors.primary }, noneText: { color: colors.primary, fontWeight: '700' }, noneTextSelected: { color: colors.surface }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 } });
