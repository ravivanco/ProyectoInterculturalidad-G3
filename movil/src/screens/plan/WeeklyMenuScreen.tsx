import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { mealSlotLabels, mealSlotOrder } from '../../constants/mealSlots';
import type { RootStackParamList } from '../../navigation/types';
import { nutritionPlanService } from '../../services/nutritionPlanService';
import { colors } from '../../theme/colors';
import type { MealSlot, MenuDay, WeeklyNutritionPlan } from '../../types/nutritionPlan';

export function WeeklyMenuScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'WeeklyMenu'>) {
  const [plan, setPlan] = useState<WeeklyNutritionPlan>();
  const [selectedDayId, setSelectedDayId] = useState('monday');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    nutritionPlanService.getActiveWeeklyMenu()
      .then((weeklyPlan) => {
        setPlan(weeklyPlan);
        setSelectedDayId(weeklyPlan.days[0]?.id ?? 'monday');
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedDay = useMemo(
    () => plan?.days.find((day) => day.id === selectedDayId) ?? plan?.days[0],
    [plan?.days, selectedDayId],
  );

  const generateMenu = async () => {
    setGenerating(true);
    try {
      const generatedPlan = await nutritionPlanService.generateWeeklyMenu();
      setPlan(generatedPlan);
      setSelectedDayId(generatedPlan.days[0]?.id ?? selectedDayId);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Mi Plan Nutricional</Text>
        <Text style={styles.title}>Menú semanal</Text>
        <Text style={styles.subtitle}>Organiza tus comidas de lunes a viernes según tu plan activo.</Text>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Cargando tu plan activo...</Text>
        </View>
      ) : (
        <View>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>{plan?.name}</Text>
            <Text style={styles.summaryText}>{plan?.weekLabel} · Meta {plan?.energyTarget} kcal/día</Text>
            {plan?.generatedAt ? <Text style={styles.generatedText}>Generado automáticamente</Text> : undefined}
          </View>

          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Recomendación automática</Text>
            <Text style={styles.recommendationText}>Genera un menú semanal según tus necesidades energéticas y preferencias.</Text>
            <PrimaryButton loading={generating} onPress={generateMenu} title={generating ? 'Generando...' : 'Generar menús'} />
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>Menús seguros para tu perfil</Text>
            {(plan?.safetyNotes ?? ['Sin alimentos restringidos detectados.']).map((note) => (
              <Text key={note} style={styles.safetyText}>✓ {note}</Text>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
            {plan?.days.map((day) => (
              <DayPill day={day} key={day.id} onPress={() => setSelectedDayId(day.id)} selected={selectedDay?.id === day.id} />
            ))}
          </ScrollView>

          {selectedDay ? (
            <View style={styles.dayCard}>
              <Text style={styles.dayTitle}>{selectedDay.label}</Text>
              <Text style={styles.dayMeta}>{selectedDay.date} · {selectedDay.totalCalories} kcal planificadas</Text>
              {mealSlotOrder.map((slot) => {
                const meal = selectedDay.meals.find((item) => item.slot === slot);
                return (
                  <MealSlotCard
                    calories={meal?.calories}
                    key={slot}
                    onPress={meal ? () => navigation.navigate('MealDetail', { dayId: selectedDay.id, mealId: meal.id }) : undefined}
                    slot={slot}
                    tags={meal?.tags ?? []}
                    title={meal?.title ?? 'Pendiente de asignar'}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={styles.empty}>No hay menús disponibles para esta semana.</Text>
          )}
        </View>
      )}

      <PrimaryButton onPress={() => navigation.goBack()} title="Volver al inicio" />
    </ScrollView>
  );
}

type MealSlotCardProps = {
  slot: MealSlot;
  title: string;
  calories?: number;
  tags: string[];
  onPress?: () => void;
};

function MealSlotCard({ slot, title, calories, tags, onPress }: MealSlotCardProps) {
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.mealRow, pressed ? styles.mealRowPressed : undefined]}>
      <View style={styles.mealBadge}>
        <Text style={styles.mealBadgeText}>{mealSlotLabels[slot].slice(0, 2)}</Text>
      </View>
      <View style={styles.mealContent}>
        <Text style={styles.mealSlot}>{mealSlotLabels[slot]}</Text>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealMeta}>{calories ? `${calories} kcal` : 'Sin calorías registradas'}{tags.length ? ` · ${tags.join(', ')}` : ''}</Text>
      </View>
      {tags.includes('seguro') || tags.includes('recomendado') ? <Text style={styles.safeBadge}>Seguro</Text> : undefined}
      {onPress ? <Text style={styles.mealAction}>Ver receta</Text> : undefined}
    </Pressable>
  );
}

type DayPillProps = {
  day: MenuDay;
  selected: boolean;
  onPress: () => void;
};

function DayPill({ day, selected, onPress }: DayPillProps) {
  return (
    <Pressable onPress={onPress} style={[styles.dayPill, selected ? styles.dayPillSelected : undefined]}>
      <Text style={[styles.dayPillText, selected ? styles.dayPillTextSelected : undefined]}>{day.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: 20, padding: 24, paddingTop: 56 },
  dayCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, gap: 14, padding: 18 },
  dayMeta: { color: colors.muted, fontSize: 14, marginTop: 4 },
  dayPill: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, marginRight: 10, paddingHorizontal: 18, paddingVertical: 12 },
  dayPillSelected: { backgroundColor: colors.primary },
  dayPillText: { color: colors.text, fontWeight: '800' },
  dayPillTextSelected: { color: colors.surface },
  daySelector: { marginHorizontal: -4 },
  dayTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  empty: { color: colors.muted, textAlign: 'center' },
  generatedText: { color: colors.primarySoft, fontSize: 12, fontWeight: '900', marginTop: 10, textTransform: 'uppercase' },
  header: { gap: 8 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  loadingCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, gap: 12, padding: 28 },
  loadingText: { color: colors.muted, fontWeight: '700' },
  mealBadge: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  mealBadgeText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  mealContent: { flex: 1 },
  mealMeta: { color: colors.muted, fontSize: 13, marginTop: 4 },
  mealRow: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 16, flexDirection: 'row', gap: 12, padding: 14 },
  mealRowPressed: { opacity: 0.78 },
  mealSlot: { color: colors.primaryDark, fontSize: 12, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  mealTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  mealAction: { color: colors.primaryDark, fontSize: 12, fontWeight: '900' },
  recommendationCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, gap: 12, marginTop: 16, padding: 18 },
  recommendationText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  recommendationTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  safeBadge: { backgroundColor: colors.surface, borderRadius: 999, color: colors.primaryDark, fontSize: 11, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5 },
  safetyCard: { backgroundColor: colors.primarySoft, borderRadius: 20, gap: 8, marginTop: 16, padding: 16 },
  safetyText: { color: colors.primaryDark, fontSize: 14, lineHeight: 20 },
  safetyTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  summary: { backgroundColor: colors.primaryDark, borderRadius: 20, padding: 18 },
  summaryText: { color: colors.primarySoft, fontSize: 14, marginTop: 5 },
  summaryTitle: { color: colors.surface, fontSize: 18, fontWeight: '900' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900' },
});
