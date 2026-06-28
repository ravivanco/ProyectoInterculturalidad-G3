import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormField } from '../../components/FormField';
import { PrimaryButton } from '../../components/PrimaryButton';
import type { RootStackParamList } from '../../navigation/types';
import { ApiError } from '../../services/api';
import { authService } from '../../services/authService';
import { saveTokens } from '../../services/tokenStorage';
import { colors } from '../../theme/colors';
import type { RegisterPayload, Sex } from '../../types/auth';
import { type RegisterErrors, validateRegister } from '../../validation/registerValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const initialForm: RegisterPayload = {
  nombres: '', apellidos: '', correo: '', password: '', sexo: '' as Sex, fecha_nacimiento: '',
};

export function RegisterScreen({ navigation }: Props) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedDate = useMemo(() => form.fecha_nacimiento ? new Date(`${form.fecha_nacimiento}T12:00:00`) : new Date(2000, 0, 1), [form.fecha_nacimiento]);

  const update = <K extends keyof RegisterPayload>(field: K, value: RegisterPayload[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleDate = (_event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (value) update('fecha_nacimiento', value.toISOString().slice(0, 10));
  };

  const submit = async () => {
    const validation = validateRegister(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      const session = await authService.register({
        ...form,
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim().toLowerCase(),
      });
      await saveTokens(session.access_token, session.refresh_token);
      navigation.replace('Onboarding');
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors((current) => ({ ...current, correo: 'Este correo ya está registrado.' }));
      } else if (error instanceof ApiError && error.status === 400) {
        Alert.alert('Revisa tus datos', 'Algunos datos no son válidos. Corrígelos e inténtalo otra vez.');
      } else {
        Alert.alert('No pudimos registrarte', 'Verifica tu conexión e inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>DK-FITT</Text>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Empieza tu seguimiento nutricional personalizado.</Text>
        <View style={styles.form}>
          <FormField autoCapitalize="words" error={errors.nombres} label="Nombres" onChangeText={(value) => update('nombres', value)} value={form.nombres} />
          <FormField autoCapitalize="words" error={errors.apellidos} label="Apellidos" onChangeText={(value) => update('apellidos', value)} value={form.apellidos} />
          <FormField autoCapitalize="none" autoComplete="email" error={errors.correo} keyboardType="email-address" label="Correo" onChangeText={(value) => update('correo', value)} value={form.correo} />
          <FormField
            autoCapitalize="none"
            error={errors.password}
            label="Contraseña"
            onChangeText={(value) => update('password', value)}
            rightAccessory={<Pressable accessibilityRole="button" onPress={() => setShowPassword((value) => !value)}><Text style={styles.link}>{showPassword ? 'Ocultar' : 'Ver'}</Text></Pressable>}
            secureTextEntry={!showPassword}
            value={form.password}
          />
          <View style={styles.group}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.options}>
              {([['F', 'Femenino'], ['M', 'Masculino'], ['OTRO', 'Otro']] as const).map(([value, label]) => (
                <Pressable key={value} onPress={() => update('sexo', value)} style={[styles.option, form.sexo === value ? styles.optionSelected : undefined]}>
                  <Text style={form.sexo === value ? styles.optionTextSelected : styles.optionText}>{label}</Text>
                </Pressable>
              ))}
            </View>
            {errors.sexo ? <Text style={styles.error}>{errors.sexo}</Text> : null}
          </View>
          <View style={styles.group}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text style={form.fecha_nacimiento ? styles.dateText : styles.datePlaceholder}>{form.fecha_nacimiento || 'Seleccionar fecha'}</Text>
            </Pressable>
            {errors.fecha_nacimiento ? <Text style={styles.error}>{errors.fecha_nacimiento}</Text> : null}
            {showDatePicker ? <DateTimePicker display="default" maximumDate={new Date()} mode="date" onChange={handleDate} value={selectedDate} /> : null}
          </View>
          <PrimaryButton loading={loading} onPress={submit} title="Crear cuenta" />
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.login}>¿Ya tienes cuenta? Inicia sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { backgroundColor: colors.background, flexGrow: 1, padding: 24, paddingTop: 64 },
  brand: { color: colors.primary, fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 18 },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 8 },
  form: { gap: 18, marginTop: 28 },
  group: { gap: 7 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { color: colors.text },
  optionTextSelected: { color: colors.surface, fontWeight: '700' },
  dateButton: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 12, borderWidth: 1, justifyContent: 'center', minHeight: 50, paddingHorizontal: 14 },
  dateText: { color: colors.text, fontSize: 16 },
  datePlaceholder: { color: colors.muted, fontSize: 16 },
  error: { color: colors.danger, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '700', padding: 8 },
  login: { color: colors.primary, fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
