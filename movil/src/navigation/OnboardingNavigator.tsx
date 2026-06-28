import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingProvider } from '../context/OnboardingContext';
import { ActivityScreen } from '../screens/onboarding/ActivityScreen';
import { AllergiesScreen } from '../screens/onboarding/AllergiesScreen';
import { ConditionsScreen } from '../screens/onboarding/ConditionsScreen';
import { GoalScreen } from '../screens/onboarding/GoalScreen';
import { PreferencesScreen } from '../screens/onboarding/PreferencesScreen';
import { RestrictionsScreen } from '../screens/onboarding/RestrictionsScreen';
import { SportsScreen } from '../screens/onboarding/SportsScreen';
import type { OnboardingStackParamList } from './onboardingTypes';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return <OnboardingProvider><Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen component={ActivityScreen} name="Activity" /><Stack.Screen component={ConditionsScreen} name="Conditions" /><Stack.Screen component={AllergiesScreen} name="Allergies" /><Stack.Screen component={GoalScreen} name="Goal" /><Stack.Screen component={SportsScreen} name="Sports" /><Stack.Screen component={PreferencesScreen} name="Preferences" /><Stack.Screen component={RestrictionsScreen} name="Restrictions" /></Stack.Navigator></OnboardingProvider>;
}
