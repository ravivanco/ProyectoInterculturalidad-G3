import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { mealSlotLabels } from '../../constants/mealSlots';
import type { RootStackParamList } from '../../navigation/types';
import { nutritionPlanService } from '../../services/nutritionPlanService';
import { colors } from '../../theme/colors';
import type { MenuMeal, WeeklyNutritionPlan } from '../../types/nutritionPlan';
import { completeRecipe } from '../../utils/recipeFallback';

export function MealDetailScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'MealDetail'>) {
  const [plan, setPlan] = useState<WeeklyNutritionPlan>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nutritionPlanService.getActiveWeeklyMenu()
      .then(setPlan)
      .finally(() => setLoading(false));
  }, []);

  const meal = useMemo(() => {
    const foundMeal = plan?.days
      .find((day) => day.id === route.params.dayId)
      ?.meals.find((item) => item.id === route.params.mealId);

    return foundMeal ? completeRecipe(foundMeal) : undefined;
  }, [plan?.days, route.params.dayId, route.params.mealId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Cargando receta...</Text>
        </View>
      ) : meal ? (
        <RecipeContent meal={meal} />
      ) : (
        <Text style={styles.empty}>No encontramos el detalle de esta comida.</Text>
      )}

      <PrimaryButton onPress={() => navigation.goBack()} title="Volver al menú" />
    </ScrollView>
  );
}

function RecipeContent({ meal }: { meal: MenuMeal }) {
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>{mealSlotLabels[meal.slot]}</Text>
        <Text style={styles.title}>{meal.title}</Text>
        <Text style={styles.subtitle}>{meal.calories} kcal planificadas · {meal.tags.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes y cantidades</Text>
        {meal.safeForPatient ? <Text style={styles.safeText}>✓ Receta compatible con tus alergias, condiciones y restricciones.</Text> : undefined}
        {meal.ingredients.map((ingredient) => (
          <View key={`${ingredient.name}-${ingredient.quantity}`} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
          </View>
        ))}
      </View>

      {meal.restrictionNotes?.length ? (
        <View style={styles.safetyBox}>
          <Text style={styles.safetyTitle}>Validación de seguridad</Text>
          {meal.restrictionNotes.map((note) => <Text key={note} style={styles.safeText}>✓ {note}</Text>)}
        </View>
      ) : undefined}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preparación</Text>
        {meal.preparation.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: 20, padding: 24, paddingTop: 56 },
  content: { gap: 20 },
  empty: { color: colors.muted, textAlign: 'center' },
  header: { backgroundColor: colors.primaryDark, borderRadius: 24, gap: 8, padding: 22 },
  ingredientName: { color: colors.text, flex: 1, fontSize: 15, fontWeight: '800' },
  ingredientQuantity: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' },
  ingredientRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: 10, paddingVertical: 12 },
  kicker: { color: colors.primarySoft, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  loadingCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, gap: 12, padding: 28 },
  loadingText: { color: colors.muted, fontWeight: '700' },
  section: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, padding: 18 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  safeText: { color: colors.primaryDark, fontSize: 14, lineHeight: 20, marginBottom: 6 },
  safetyBox: { backgroundColor: colors.primarySoft, borderRadius: 18, gap: 4, padding: 16 },
  safetyTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  stepNumber: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 999, height: 30, justifyContent: 'center', width: 30 },
  stepNumberText: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  stepRow: { flexDirection: 'row', gap: 12, paddingVertical: 10 },
  stepText: { color: colors.text, flex: 1, fontSize: 15, lineHeight: 21 },
  subtitle: { color: colors.primarySoft, fontSize: 15, lineHeight: 21 },
  title: { color: colors.surface, fontSize: 30, fontWeight: '900' },
});
