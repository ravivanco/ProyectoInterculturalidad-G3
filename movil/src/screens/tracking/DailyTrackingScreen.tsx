import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { mealSlotLabels } from '../../constants/mealSlots';
import type { RootStackParamList } from '../../navigation/types';
import { calorieDashboardService, type CalorieDashboard } from '../../services/calorieDashboardService';
import { mealReminderService } from '../../services/mealReminderService';
import { trackingService } from '../../services/trackingService';
import { colors } from '../../theme/colors';
import type { DailyTrackingSummary, MealCompletionStatus, PlannedMealTracking } from '../../types/tracking';

const todayIso = new Date().toISOString().slice(0, 10);

const statusConfig: Record<MealCompletionStatus, { label: string; icon: string }> = {
  pending: { label: 'Pendiente', icon: '○' },
  completed: { label: 'Realizada', icon: '✓' },
  skipped: { label: 'No realizada', icon: '×' },
};

export function DailyTrackingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'DailyTracking'>) {
  const [summary, setSummary] = useState<DailyTrackingSummary>();
  const [weight, setWeight] = useState('');
  const [additionalName, setAdditionalName] = useState('');
  const [additionalCalories, setAdditionalCalories] = useState('');
  const [additionalImageUri, setAdditionalImageUri] = useState<string>();
  const [estimatedFood, setEstimatedFood] = useState<{ calories: number; protein: number; carbs: number; fat: number }>();
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderSummary, setReminderSummary] = useState<Array<{ label: string; time: string }>>([]);
  const [calorieDashboard, setCalorieDashboard] = useState<CalorieDashboard>();

  useEffect(() => {
    trackingService.getDailySummary().then(setSummary);
    calorieDashboardService.getDashboard().then(setCalorieDashboard);
  }, []);

  const visibleMeals = useMemo(() => summary?.plannedMeals ?? [], [summary?.plannedMeals]);
  const consumedCalories = useMemo(() => {
    const meals = summary?.plannedMeals
      .filter((meal) => meal.date === todayIso && meal.status === 'completed')
      .reduce((total, meal) => total + meal.calories, 0) ?? 0;
    const additional = summary?.additionalFoods
      .filter((food) => food.date === todayIso && food.status === 'confirmed')
      .reduce((total, food) => total + food.calories, 0) ?? 0;
    return meals + additional;
  }, [summary?.additionalFoods, summary?.plannedMeals]);
  const completedMeals = useMemo(
    () => visibleMeals.filter((meal) => meal.date === todayIso && meal.status === 'completed'),
    [visibleMeals],
  );
  const confirmedAdditionalCalories = useMemo(
    () => summary?.additionalFoods
      .filter((food) => food.date === todayIso && food.status === 'confirmed')
      .reduce((total, food) => total + food.calories, 0) ?? 0,
    [summary?.additionalFoods],
  );
  const calorieGoal = calorieDashboard?.calorieGoal ?? summary?.calorieGoal ?? 0;
  const remainingCalories = calorieGoal - consumedCalories;
  const calorieProgress = calorieGoal ? Math.min(consumedCalories / calorieGoal, 1) : 0;
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

  const confirmAdditionalFood = async () => {
    try {
      const nextSummary = await trackingService.addAdditionalFood({
        name: additionalName,
        calories: Number(additionalCalories.replace(',', '.')),
        imageUri: additionalImageUri,
      });
      setSummary(nextSummary);
      setAdditionalName('');
      setAdditionalCalories('');
      setAdditionalImageUri(undefined);
      setEstimatedFood(undefined);
      Alert.alert('Alimento registrado', 'El alimento adicional fue asociado al día actual.');
    } catch (error) {
      Alert.alert('No se pudo registrar', error instanceof Error ? error.message : 'Revisa los datos ingresados.');
    }
  };

  const discardAdditionalFood = () => {
    setAdditionalName('');
    setAdditionalCalories('');
    setAdditionalImageUri(undefined);
    setEstimatedFood(undefined);
    Alert.alert('Consumo descartado', 'El alimento no impactará tu balance diario.');
  };

  const estimateAdditionalFood = async () => {
    const estimate = await trackingService.estimateAdditionalFood({ name: additionalName, imageUri: additionalImageUri });
    setAdditionalName(estimate.name);
    setAdditionalCalories(String(estimate.calories));
    setEstimatedFood(estimate);
  };

  const activateMealReminders = async () => {
    try {
      const reminders = await mealReminderService.activateLocalMealReminders();
      setReminderSummary(reminders);
      setRemindersEnabled(true);
      Alert.alert('Alertas activadas', 'Se programaron recordatorios locales para tus cinco tiempos de comida.');
    } catch (error) {
      Alert.alert('No se pudieron activar', error instanceof Error ? error.message : 'Revisa los permisos de notificaciones.');
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para tomar la foto.');
        return;
      }
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAdditionalImageUri(result.assets[0].uri);
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

      <View style={styles.notificationCard}>
        <Text style={styles.infoTitle}>Alertas de comidas</Text>
        <Text style={styles.notificationTitle}>{remindersEnabled ? 'Notificaciones locales activas' : 'Activa recordatorios del plan'}</Text>
        <Text style={styles.infoHint}>Recibe avisos para desayuno, media ma?ana, almuerzo, media tarde y cena.</Text>
        <PrimaryButton onPress={activateMealReminders} title={remindersEnabled ? 'Reprogramar alertas' : 'Activar notificaciones'} />
        {reminderSummary.length ? reminderSummary.map((reminder) => (
          <Text key={reminder.label} style={styles.duplicateHint}>{reminder.label}: {reminder.time}</Text>
        )) : undefined}
      </View>


      <View style={styles.calorieCard}>
        <Text style={styles.infoTitle}>Calorías consumidas hoy</Text>
        <Text style={styles.calorieValue}>{consumedCalories} kcal</Text>
        <Text style={styles.infoHint}>Se actualiza automáticamente según comidas marcadas y alimentos confirmados.</Text>
        <Text style={styles.duplicateHint}>{completedMeals.length} comidas completadas · sin duplicar calorías</Text>
        <Text style={styles.duplicateHint}>Adicional confirmado: +{confirmedAdditionalCalories} kcal</Text>
      </View>

      {/* Daily calorie tracking card for HUM-33 */}
      <View
        accessibilityLabel={`Control de balance calórico diario. Meta diaria: ${calorieGoal} kcal. Restantes: ${remainingCalories} kcal. ${remainingCalories < 0 ? 'Superaste tu objetivo diario. Revisa tus registros adicionales.' : 'Aún tienes calorías disponibles para el día.'}`}
        style={[styles.balanceCard, remainingCalories < 0 ? styles.balanceCardDanger : undefined]}
      >
        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.infoTitle}>Meta diaria</Text>
            <Text style={styles.balanceValue}>{calorieGoal} kcal</Text>
          </View>
          <View>
            <Text style={styles.infoTitle}>Restantes</Text>
            <Text style={[styles.balanceValue, remainingCalories < 0 ? styles.balanceDangerText : undefined]}>{remainingCalories} kcal</Text>
          </View>
        </View>
        <View style={styles.remainingTrack}>
          <View style={[styles.remainingFill, remainingCalories < 0 ? styles.remainingFillDanger : undefined, { width: `${calorieProgress * 100}%` }]} />
        </View>
        <Text style={[styles.remainingLabel, remainingCalories < 0 ? styles.balanceDangerText : undefined]}>
          {remainingCalories < 0 ? `Exceso de ${Math.abs(remainingCalories)} kcal` : `${remainingCalories} kcal disponibles`}
        </Text>
        <Text style={styles.infoHint}>{remainingCalories < 0 ? 'Superaste tu objetivo diario. Revisa tus registros adicionales.' : 'Aún tienes calorías disponibles para el día.'}</Text>
        {!calorieDashboard?.hasClinicalEvaluation ? (
          <Text style={styles.warningText}>Necesitas una evaluación clínica para calcular tu meta personalizada.</Text>
        ) : undefined}
      </View>

      <View style={styles.macroCard}>
        <Text style={styles.infoTitle}>Distribución de macronutrientes</Text>
        <Text style={styles.infoHint}>Objetivo diario calculado desde tu evaluación clínica.</Text>
        {[
          { label: 'Proteínas', grams: calorieDashboard?.proteinGrams ?? 0 },
          { label: 'Carbohidratos', grams: calorieDashboard?.carbsGrams ?? 0 },
          { label: 'Grasas', grams: calorieDashboard?.fatGrams ?? 0 },
        ].map((macro) => (
          <View key={macro.label} style={styles.macroRow}>
            <Text style={styles.macroLabel}>{macro.label}</Text>
            <Text style={styles.macroValue}>{macro.grams} g</Text>
          </View>
        ))}
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
        <Text accessibilityRole="header" style={styles.sectionTitle}>Alimento adicional</Text>
        <View style={styles.weightCard}>
          <Text style={styles.infoHint}>Registra alimentos consumidos fuera del plan. Se asociarán a {todayIso}.</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => pickImage('camera')}
              accessibilityRole="button"
              accessibilityLabel="Tomar foto del alimento adicional usando la cámara"
              style={styles.imageButton}
            >
              <Text style={styles.imageButtonText}>Tomar foto</Text>
            </Pressable>
            <Pressable
              onPress={() => pickImage('gallery')}
              accessibilityRole="button"
              accessibilityLabel="Elegir foto del alimento adicional de la galería de imágenes"
              style={styles.imageButton}
            >
              <Text style={styles.imageButtonText}>Elegir galería</Text>
            </Pressable>
          </View>
          {additionalImageUri ? <Text style={styles.infoHint}>Imagen seleccionada para el análisis.</Text> : undefined}
          <TextInput
            onChangeText={setAdditionalName}
            placeholder="Nombre del alimento"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={additionalName}
          />
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={setAdditionalCalories}
            placeholder="Calor?as estimadas"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={additionalCalories}
          />
          <PrimaryButton disabled={!additionalName.trim() && !additionalImageUri} onPress={estimateAdditionalFood} title="Estimar calorías" />
          {estimatedFood ? (
            <View style={styles.estimateCard}>
              <Text style={styles.infoTitle}>Resultado estimado</Text>
              <Text style={styles.calorieValue}>{estimatedFood.calories} kcal</Text>
              <Text style={styles.infoHint}>Proteína {estimatedFood.protein} g · Carbohidratos {estimatedFood.carbs} g · Grasa {estimatedFood.fat} g</Text>
            </View>
          ) : undefined}
          {estimatedFood ? (
            <View style={styles.actions}>
              <Pressable onPress={confirmAdditionalFood} style={styles.confirmButton}>
                <Text style={styles.actionText}>Confirmar consumo</Text>
              </Pressable>
              <Pressable onPress={discardAdditionalFood} style={styles.discardButton}>
                <Text style={styles.actionText}>Descartar</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.infoHint}>Estima el alimento antes de confirmar su consumo.</Text>
          )}
        </View>
        {(summary?.additionalFoods ?? []).map((food) => (
          <View key={food.id} style={styles.additionalFoodCard}>
            <Text style={styles.mealTitle}>{food.name}</Text>
            <Text style={styles.mealMeta}>{food.calories} kcal · {food.date} · {food.status}{food.imageUri ? ' · con imagen' : ''}</Text>
            {food.status === 'confirmed' ? <Text style={styles.duplicateHint}>Sumado al total diario</Text> : undefined}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>Progreso y estad?sticas</Text>
        <View
          accessibilityLabel={`Progreso de peso: ${progress.last ? `${progress.last.weightKg} kg` : 'Sin datos registrados'}`}
          style={styles.progressCard}
        >
          <Text style={styles.progressValue}>{progress.last ? `${progress.last.weightKg} kg` : 'Sin datos'}</Text>
          <Text style={[styles.progressVariation, progress.variation > 0 ? styles.progressUp : styles.progressDown]}>
            Variación: {progress.variation > 0 ? '+' : ''}{progress.variation} kg
          </Text>
          <View style={styles.chart} accessibilityLabel="Gráfico de evolución de peso diario">
            {progress.records.map((record) => {
              const range = Math.max(progress.max - progress.min, 1);
              const height = 36 + ((record.weightKg - progress.min) / range) * 70;
              return (
                <View
                  key={record.id}
                  accessibilityLabel={`Registro del día ${record.date}: ${record.weightKg} kg`}
                  style={styles.chartItem}
                >
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
  const config = statusConfig[meal.status];

  return (
    <View
      accessibilityLabel={`Comida: ${meal.title}. Horario: ${mealSlotLabels[meal.slot]}. Calorías: ${meal.calories} kcal. Estado: ${config.label}.`}
      style={[styles.mealCard, styles[`mealCard_${meal.status}`], disabled ? styles.mealCardDisabled : undefined]}
    >
      <View style={styles.mealHeader}>
        <Text style={styles.mealSlot}>{mealSlotLabels[meal.slot]}</Text>
        <View style={[styles.statusBadge, styles[`statusBadge_${meal.status}`]]}>
          <Text style={styles.statusBadgeText}>{config.icon} {config.label}</Text>
        </View>
      </View>
      <Text style={styles.mealTitle}>{meal.title}</Text>
      <Text style={styles.mealMeta}>{meal.calories} kcal · {meal.date}</Text>
      {disabled ? <Text style={styles.blockedText}>Día futuro bloqueado</Text> : undefined}
      <View style={styles.actions}>
        <Pressable
          disabled={disabled}
          onPress={() => onChange(meal, 'completed')}
          accessibilityRole="button"
          accessibilityLabel="Marcar comida como realizada"
          style={[styles.actionButton, disabled ? styles.actionDisabled : undefined]}
        >
          <Text style={styles.actionText}>Realizada</Text>
        </Pressable>
        <Pressable
          disabled={disabled}
          onPress={() => onChange(meal, 'skipped')}
          accessibilityRole="button"
          accessibilityLabel="Marcar comida como no realizada"
          style={[styles.actionButton, styles.secondaryAction, disabled ? styles.actionDisabled : undefined]}
        >
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
  additionalFoodCard: { backgroundColor: colors.primarySoft, borderRadius: 16, padding: 14 },
  blockedText: { color: colors.danger, fontSize: 13, fontWeight: '800', marginTop: 8 },
  balanceCard: { backgroundColor: colors.primarySoft, borderRadius: 22, gap: 10, padding: 18 },
  balanceCardDanger: { backgroundColor: '#FEE4E2' },
  balanceDangerText: { color: colors.danger },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceValue: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 4 },
  container: { backgroundColor: colors.background, flexGrow: 1, gap: 20, padding: 24, paddingTop: 56 },
  duplicateHint: { color: colors.primaryDark, fontSize: 13, fontWeight: '900', marginTop: 4 },
  estimateCard: { backgroundColor: colors.primarySoft, borderRadius: 16, gap: 6, padding: 14 },
  header: { gap: 8 },
  infoCard: { backgroundColor: colors.primarySoft, borderRadius: 20, gap: 6, padding: 16 },
  infoHint: { color: colors.primaryDark, fontSize: 13, lineHeight: 19 },
  infoText: { color: colors.text, fontSize: 17, fontWeight: '900' },
  infoTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, fontSize: 18, fontWeight: '800', paddingHorizontal: 14, paddingVertical: 12 },
  imageButton: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 12, flex: 1, paddingVertical: 11 },
  imageButtonText: { color: colors.primaryDark, fontWeight: '900' },
  chart: { alignItems: 'flex-end', flexDirection: 'row', gap: 10, minHeight: 130 },
  chartBar: { backgroundColor: colors.primary, borderRadius: 999, width: 28 },
  chartItem: { alignItems: 'center', flex: 1, gap: 8, justifyContent: 'flex-end' },
  chartLabel: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  calorieCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, gap: 8, padding: 18 },
  calorieValue: { color: colors.primary, fontSize: 34, fontWeight: '900' },
  confirmButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, flex: 1, paddingVertical: 12 },
  discardButton: { alignItems: 'center', backgroundColor: colors.danger, borderRadius: 12, flex: 1, paddingVertical: 12 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  macroCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, gap: 10, padding: 18 },
  macroLabel: { color: colors.text, fontSize: 15, fontWeight: '800' },
  macroRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  macroValue: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  mealCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 16 },
  mealCard_completed: { borderColor: colors.primary },
  mealCard_pending: { borderColor: colors.border },
  mealCard_skipped: { borderColor: colors.danger },
  mealCardDisabled: { opacity: 0.65 },
  mealDate: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  mealHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  mealMeta: { color: colors.muted, fontSize: 14, marginTop: 4 },
  mealSlot: { color: colors.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  mealTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 8 },
  notificationCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, gap: 10, padding: 18 },
  notificationTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  secondaryAction: { backgroundColor: colors.primaryDark },
  progressCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 12, padding: 16 },
  progressDown: { color: colors.primaryDark },
  progressUp: { color: colors.danger },
  progressValue: { color: colors.text, fontSize: 28, fontWeight: '900' },
  progressVariation: { fontSize: 14, fontWeight: '900' },
  remainingFill: { backgroundColor: colors.primary, borderRadius: 999, height: '100%' },
  remainingFillDanger: { backgroundColor: colors.danger },
  remainingLabel: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' },
  remainingTrack: { backgroundColor: colors.surface, borderRadius: 999, height: 12, overflow: 'hidden' },
  section: { gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  statusBadge_completed: { backgroundColor: colors.primarySoft },
  statusBadge_pending: { backgroundColor: '#EEF2F6' },
  statusBadge_skipped: { backgroundColor: '#FEE4E2' },
  statusBadgeText: { color: colors.text, fontSize: 12, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900' },
  weightCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 12, padding: 16 },
  warningText: { color: colors.danger, fontSize: 13, fontWeight: '900', lineHeight: 19 },
});
