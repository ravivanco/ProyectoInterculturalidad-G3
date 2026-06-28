import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingProvider } from '../context/OnboardingContext';
import { ActivityPlaceholder, AllergiesPlaceholder, ConditionsPlaceholder, GoalPlaceholder, PreferencesPlaceholder, RestrictionsPlaceholder, SportsPlaceholder } from '../screens/onboarding/PlaceholderSteps';
import type { OnboardingStackParamList } from './onboardingTypes';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return <OnboardingProvider><Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen component={ActivityPlaceholder} name="Activity" /><Stack.Screen component={ConditionsPlaceholder} name="Conditions" /><Stack.Screen component={AllergiesPlaceholder} name="Allergies" /><Stack.Screen component={GoalPlaceholder} name="Goal" /><Stack.Screen component={SportsPlaceholder} name="Sports" /><Stack.Screen component={PreferencesPlaceholder} name="Preferences" /><Stack.Screen component={RestrictionsPlaceholder} name="Restrictions" /></Stack.Navigator></OnboardingProvider>;
}
