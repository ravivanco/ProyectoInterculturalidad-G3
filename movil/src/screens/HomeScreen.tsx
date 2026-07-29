import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const planStatus = 'Activo';

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>DK-FITT</Text>
      <Text style={styles.title}>Tu espacio nutricional</Text>
      <Text style={styles.subtitle}>Consulta tu menú semanal, ejercicios y seguimiento diario desde un solo lugar.</Text>

      <View style={styles.planStatusCard}>
        <Text style={styles.planStatusLabel}>Estado de Mi Plan</Text>
        <Text style={styles.planStatusValue}>{planStatus}</Text>
        <Text style={styles.planStatusHint}>Puede mostrarse como bloqueado, pendiente o activo según la API.</Text>
      </View>

      <PrimaryButton onPress={() => navigation.navigate('WeeklyMenu')} title="Ver Mi Plan" />
      <PrimaryButton onPress={() => navigation.navigate('Exercises')} title="Ver Ejercicios" />
      <PrimaryButton onPress={() => navigation.navigate('DailyTracking')} title="Control Diario" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: 18, justifyContent: 'center', padding: 24 },
  brand: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  planStatusCard: { backgroundColor: colors.primarySoft, borderRadius: 18, gap: 5, padding: 16 },
  planStatusHint: { color: colors.primaryDark, fontSize: 13, lineHeight: 19 },
  planStatusLabel: { color: colors.primaryDark, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  planStatusValue: { color: colors.text, fontSize: 22, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
});
