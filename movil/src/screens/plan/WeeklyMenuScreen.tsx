import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import type { RootStackParamList } from '../../navigation/types';
import { nutritionPlanService } from '../../services/nutritionPlanService';
import { colors } from '../../theme/colors';
import type { MenuDay, WeeklyNutritionPlan } from '../../types/nutritionPlan';

export function WeeklyMenuScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'WeeklyMenu'>) {
  const [plan, setPlan] = useState<WeeklyNutritionPlan>();
  const [selectedDayId, setSelectedDayId] = useState('monday');
  const [loading, setLoading] = useState(true);

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
              {selectedDay.meals.map((meal) => (
                <View key={meal.id} style={styles.mealRow}>
                  <View>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    <Text style={styles.mealMeta}>{meal.calories} kcal · {meal.tags.join(', ')}</Text>
                  </View>
                </View>
              ))}
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
  header: { gap: 8 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  loadingCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, gap: 12, padding: 28 },
  loadingText: { color: colors.muted, fontWeight: '700' },
  mealMeta: { color: colors.muted, fontSize: 13, marginTop: 3 },
  mealRow: { backgroundColor: colors.primarySoft, borderRadius: 16, padding: 14 },
  mealTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  summary: { backgroundColor: colors.primaryDark, borderRadius: 20, padding: 18 },
  summaryText: { color: colors.primarySoft, fontSize: 14, marginTop: 5 },
  summaryTitle: { color: colors.surface, fontSize: 18, fontWeight: '900' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900' },
});
