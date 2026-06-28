import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OnboardingWelcomeScreen } from '../screens/onboarding/OnboardingWelcomeScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={OnboardingWelcomeScreen} name="Onboarding" />
    </Stack.Navigator>
  );
}
