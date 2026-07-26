import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import type { RootStackParamList } from '../../navigation/types';
import { exerciseService } from '../../services/exerciseService';
import { colors } from '../../theme/colors';
import type { Exercise, ExerciseCategory } from '../../types/exercise';

const categories: Array<ExerciseCategory | 'Todas'> = ['Todas', 'Cardio', 'Fuerza', 'Flexibilidad', 'Movilidad'];

export function ExercisesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Exercises'>) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [category, setCategory] = useState<ExerciseCategory | 'Todas'>('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    exerciseService.getExercises()
      .then(setExercises)
      .finally(() => setLoading(false));
  }, []);

  const filteredExercises = useMemo(
    () => category === 'Todas' ? exercises : exercises.filter((exercise) => exercise.category === category),
    [category, exercises],
  );
  const recommendedExercises = useMemo(
    () => exercises.filter((exercise) => exercise.recommended),
    [exercises],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Ejercicios físicos</Text>
        <Text style={styles.title}>Catálogo de ejercicios</Text>
        <Text style={styles.subtitle}>Filtra por categoría y revisa duración e intensidad de cada opción.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item ? styles.chipSelected : undefined]}>
            <Text style={[styles.chipText, category === item ? styles.chipTextSelected : undefined]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Cargando ejercicios...</Text>
        </View>
      ) : filteredExercises.length ? (
        <View style={styles.list}>
          {filteredExercises.map((exercise) => <ExerciseCard exercise={exercise} key={exercise.id} />)}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin ejercicios</Text>
          <Text style={styles.emptyText}>No hay ejercicios para esta categoría todavía.</Text>
        </View>
      )}

      {!loading && recommendedExercises.length ? (
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recomendados para tu perfil</Text>
          <Text style={styles.sectionText}>Rutinas sugeridas según tu actividad física, objetivo y condiciones registradas.</Text>
          {recommendedExercises.map((exercise) => <RecommendedCard exercise={exercise} key={exercise.id} />)}
        </View>
      ) : undefined}

      <PrimaryButton onPress={() => navigation.goBack()} title="Volver al inicio" />
    </ScrollView>
  );
}

function RecommendedCard({ exercise }: { exercise: Exercise }) {
  return (
    <View style={styles.recommendedCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{exercise.category}</Text>
        <Text style={styles.intensity}>{exercise.durationMinutes} min</Text>
      </View>
      <Text style={styles.cardTitle}>{exercise.name}</Text>
      <Text style={styles.cardText}>{exercise.recommendationReason ?? 'Recomendado por compatibilidad con tu perfil.'}</Text>
      <Text style={styles.meta}>Intensidad {exercise.intensity}</Text>
    </View>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{exercise.category}</Text>
        <Text style={styles.intensity}>{exercise.intensity}</Text>
      </View>
      <Text style={styles.cardTitle}>{exercise.name}</Text>
      <Text style={styles.cardText}>{exercise.description}</Text>
      <Text style={styles.meta}>{exercise.durationMinutes} min · Intensidad {exercise.intensity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 8, padding: 16 },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cardText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  category: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  chip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, marginRight: 10, paddingHorizontal: 16, paddingVertical: 11 },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '800' },
  chipTextSelected: { color: colors.surface },
  container: { backgroundColor: colors.background, flexGrow: 1, gap: 20, padding: 24, paddingTop: 56 },
  emptyCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, gap: 6, padding: 24 },
  emptyText: { color: colors.muted, textAlign: 'center' },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  header: { gap: 8 },
  intensity: { backgroundColor: colors.primarySoft, borderRadius: 999, color: colors.primaryDark, fontSize: 12, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  list: { gap: 14 },
  loadingCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 22, gap: 12, padding: 28 },
  loadingText: { color: colors.muted, fontWeight: '700' },
  meta: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  recommendedCard: { backgroundColor: colors.primarySoft, borderRadius: 18, gap: 8, padding: 16 },
  recommendedSection: { gap: 12 },
  sectionText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900' },
});
