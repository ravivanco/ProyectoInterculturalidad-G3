import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FormField } from '../../components/FormField';
import { PrimaryButton } from '../../components/PrimaryButton';
import type { RootStackParamList } from '../../navigation/types';
import { ApiError } from '../../services/api';
import { authService } from '../../services/authService';
import { saveProfileCompleted, saveTokens } from '../../services/tokenStorage';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!correo.trim() || !password) {
      Alert.alert('Completa tus datos', 'Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const session = await authService.login({ correo: correo.trim().toLowerCase(), password });
      await Promise.all([
        saveTokens(session.access_token, session.refresh_token),
        saveProfileCompleted(session.perfil_completado),
      ]);
      navigation.replace(session.perfil_completado ? 'Home' : 'Onboarding');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        Alert.alert('No pudimos iniciar sesión', 'Correo o contraseña incorrectos.');
      } else {
        Alert.alert('Sin conexión', 'Verifica tu conexión e inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>DK-FITT</Text>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar con tu seguimiento.</Text>
        <View style={styles.form}>
          <FormField autoCapitalize="none" autoComplete="email" keyboardType="email-address" label="Correo" onChangeText={setCorreo} value={correo} />
          <FormField autoCapitalize="none" label="Contraseña" onChangeText={setPassword} rightAccessory={<Pressable onPress={() => setShowPassword((value) => !value)}><Text style={styles.link}>{showPassword ? 'Ocultar' : 'Ver'}</Text></Pressable>} secureTextEntry={!showPassword} value={password} />
          <PrimaryButton loading={loading} onPress={submit} title="Iniciar sesión" />
          <Pressable onPress={() => navigation.navigate('Register')}><Text style={styles.register}>¿No tienes cuenta? Regístrate</Text></Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, justifyContent: 'center' },
  content: { padding: 24 }, logo: { color: colors.primary, fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 28 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 8 },
  form: { gap: 18, marginTop: 32 }, link: { color: colors.primary, fontWeight: '700', padding: 8 },
  register: { color: colors.primary, fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
