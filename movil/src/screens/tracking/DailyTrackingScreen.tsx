import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { mealSlotLabels } from '../../constants/mealSlots';
import type { RootStackParamList } from '../../navigation/types';
import { trackingService } from '../../services/trackingService';
import { colors } from '../../theme/colors';
import type { DailyTrackingSummary, MealCompletionStatus, PlannedMealTracking } from '../../types/tracking';

const todayIso = new Date().toISOString().slice(0, 10);

export function DailyTrackingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'DailyTracking'>) {
  const [summary, setSummary] = useState<DailyTrackingSummary>();
  const [weight, setWeight] = useState('');

  useEffect(() => {
    trackingService.getDailySummary().then(setSummary);
  }, []);

  const visibleMeals = useMemo(() => summary?.plannedMeals ?? [], [summary?.plannedMeals]);
  const progress = useMemo(() => {
    const records = summary?.weightHistory ?? [];
    const last = records.at(-1);
    const previous = records.at(-2);
    return {
      records,
      last,
      variation: last && previous ? Number((last.weightKg - previous.weightKg).toFixed(1)) : 0,
      min: Math.min(...records.map((record) => record.weightKg), 0),
      max: Math.max(...records.map((record) => record.weightKg), 1),
    };
  }, [summary?.weightHistory]);

  const changeMealStatus = async (meal: PlannedMealTracking, status: MealCompletionStatus) => {
    if (meal.date !== todayIso) {
      Alert.alert('Acción bloqueada', 'Solo puedes marcar comidas del día actual.');
      return;
    }

    const nextSummary = await trackingService.updateMealStatus(meal.id, status);
    setSummary(nextSummary);
  };

  const saveWeight = async () => {
    const parsedWeight = Number(weight.replace(',', '.'));
    try {
      const nextSummary = await trackingService.saveWeight(parsedWeight);
      setSummary(nextSummary);
      setWeight('');
      Alert.alert('Peso guardado', 'Tu peso diario fue registrado correctamente.');
    } catch (error) {
      Alert.alert('Dato inválido', error instanceof Error ? error.message : 'Ingresa un peso válido.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Control diario</Text>
        <Text style={styles.title}>Seguimiento alimenticio</Text>
        <Text style={styles.subtitle}>Marca tus comidas solo cuando correspondan al día actual.</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fecha actual</Text>
        <Text style={styles.infoText}>{todayIso}</Text>
        <Text style={styles.infoHint}>Los días futuros quedan bloqueados para mantener un seguimiento real.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comidas del plan</Text>
        {visibleMeals.map((meal) => (
          <MealTrackingCard meal={meal} key={meal.id} onChange={changeMealStatus} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registro de peso diario</Text>
        <View style={styles.weightCard}>
          <Text style={styles.infoHint}>Guarda tu peso una vez al día para seguir tu evolución.</Text>
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={setWeight}
            placeholder="Ej. 72.5"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={weight}
          />
          <PrimaryButton disabled={!weight.trim()} onPress={saveWeight} title="Guardar peso" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progreso y estadísticas</Text>
        <View style={styles.progressCard}>
          <Text style={styles.progressValue}>{progress.last ? `${progress.last.weightKg} kg` : 'Sin datos'}</Text>
          <Text style={[styles.progressVariation, progress.variation > 0 ? styles.progressUp : styles.progressDown]}>
            Variación: {progress.variation > 0 ? '+' : ''}{progress.variation} kg
          </Text>
          <View style={styles.chart}>
            {progress.records.map((record) => {
              const range = Math.max(progress.max - progress.min, 1);
              const height = 36 + ((record.weightKg - progress.min) / range) * 70;
              return (
                <View key={record.id} style={styles.chartItem}>
                  <View style={[styles.chartBar, { height }]} />
                  <Text style={styles.chartLabel}>{record.date.slice(5)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <PrimaryButton onPress={() => navigation.goBack()} title="Volver al inicio" />
    </ScrollView>
  );
}

type MealTrackingCardProps = {
  meal: PlannedMealTracking;
  onChange: (meal: PlannedMealTracking, status: MealCompletionStatus) => void;
};

function MealTrackingCard({ meal, onChange }: MealTrackingCardProps) {
  const disabled = meal.date !== todayIso;

  return (
    <View style={[styles.mealCard, disabled ? styles.mealCardDisabled : undefined]}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealSlot}>{mealSlotLabels[meal.slot]}</Text>
        <Text style={styles.mealDate}>{meal.date}</Text>
      </View>
      <Text style={styles.mealTitle}>{meal.title}</Text>
      <Text style={styles.mealMeta}>{meal.calories} kcal · Estado: {meal.status}</Text>
      {disabled ? <Text style={styles.blockedText}>Día futuro bloqueado</Text> : undefined}
      <View style={styles.actions}>
        <Pressable disabled={disabled} onPress={() => onChange(meal, 'completed')} style={[styles.actionButton, disabled ? styles.actionDisabled : undefined]}>
          <Text style={styles.actionText}>Realizada</Text>
        </Pressable>
        <Pressable disabled={disabled} onPress={() => onChange(meal, 'skipped')} style={[styles.actionButton, styles.secondaryAction, disabled ? styles.actionDisabled : undefined]}>
          <Text style={styles.actionText}>No realizada</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, flex: 1, paddingVertical: 11 },
  actionDisabled: { backgroundColor: colors.disabled },
  actionText: { color: colors.surface, fontWeight: '900' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  blockedText: { color: colors.danger, fontSize: 13, fontWeight: '800', marginTop: 8 },
  container: { backgroundColor: colors.background, flexGrow: 1, gap: 20, padding: 24, paddingTop: 56 },
  header: { gap: 8 },
  infoCard: { backgroundColor: colors.primarySoft, borderRadius: 20, gap: 6, padding: 16 },
  infoHint: { color: colors.primaryDark, fontSize: 13, lineHeight: 19 },
  infoText: { color: colors.text, fontSize: 17, fontWeight: '900' },
  infoTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, fontSize: 18, fontWeight: '800', paddingHorizontal: 14, paddingVertical: 12 },
  chart: { alignItems: 'flex-end', flexDirection: 'row', gap: 10, minHeight: 130 },
  chartBar: { backgroundColor: colors.primary, borderRadius: 999, width: 28 },
  chartItem: { alignItems: 'center', flex: 1, gap: 8, justifyContent: 'flex-end' },
  chartLabel: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  mealCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 16 },
  mealCardDisabled: { opacity: 0.65 },
  mealDate: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  mealHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  mealMeta: { color: colors.muted, fontSize: 14, marginTop: 4 },
  mealSlot: { color: colors.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  mealTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 8 },
  secondaryAction: { backgroundColor: colors.primaryDark },
  progressCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 12, padding: 16 },
  progressDown: { color: colors.primaryDark },
  progressUp: { color: colors.danger },
  progressValue: { color: colors.text, fontSize: 28, fontWeight: '900' },
  progressVariation: { fontSize: 14, fontWeight: '900' },
  section: { gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900' },
  weightCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 12, padding: 16 },
});
