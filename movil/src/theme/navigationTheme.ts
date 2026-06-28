import { DefaultTheme } from '@react-navigation/native';

import { colors } from './colors';

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
    notification: colors.danger,
  },
};
