import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import type { RootStackParamList } from '../../navigation/types';
import type { OnboardingStackParamList } from '../../navigation/onboardingTypes';
import { colors } from '../../theme/colors';
export function SuccessScreen({ navigation }: NativeStackScreenProps<OnboardingStackParamList, 'Success'>) {
  const goHome = () => navigation.getParent<NativeStackScreenProps<RootStackParamList>['navigation']>()?.replace('Home');
  return <View style={styles.container}><View style={styles.icon}><Text style={styles.check}>✓</Text></View><Text style={styles.title}>Tu perfil está completo</Text><Text style={styles.body}>La nutricionista revisará tu información pronto.</Text><View style={styles.button}><PrimaryButton onPress={goHome} title="Ir a la aplicación" /></View></View>;
}
const styles = StyleSheet.create({ container: { alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 28 }, icon: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 99, height: 88, justifyContent: 'center', width: 88 }, check: { color: colors.surface, fontSize: 48, fontWeight: '900' }, title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 28, textAlign: 'center' }, body: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 12, textAlign: 'center' }, button: { marginTop: 36, width: '100%' } });
