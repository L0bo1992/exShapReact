import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00E5FF', // Electric Cyan
    onPrimary: '#002B36',
    secondary: '#2979FF', // Electric Blue
    onSecondary: '#FFFFFF',
    background: '#0F172A', // Deep Dark Blue/Slate
    surface: '#1E293B', // Lighter Slate for cards
    onSurface: '#E2E8F0', // Light Grey text
    text: '#E2E8F0',
    placeholder: '#94A3B8',
    backdrop: 'rgba(15, 23, 42, 0.8)',
    error: '#FF5252',
    success: '#00E676',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarBackground: '#0B1120',
  },
  roundness: 16,
  fonts: {
    ...DefaultTheme.fonts,
    // Using default system fonts but could be customized
  },
};