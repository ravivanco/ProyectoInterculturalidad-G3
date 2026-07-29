import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>DK-FITT</Text>
      <Text style={styles.title}>Tu espacio nutricional</Text>
      <Text style={styles.subtitle}>Consulta tu menú semanal, ejercicios y seguimiento diario desde un solo lugar.</Text>
      <PrimaryButton onPress={() => navigation.navigate('WeeklyMenu')} title="Ver Mi Plan" />
      <PrimaryButton onPress={() => navigation.navigate('Exercises')} title="Ver Ejercicios" />
      <PrimaryButton onPress={() => navigation.navigate('DailyTracking')} title="Control Diario" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: 18, justifyContent: 'center', padding: 24 },
  brand: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
});
