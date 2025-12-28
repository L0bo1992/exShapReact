import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from './src/theme/theme';

// Screens
import ExchangeScreen from './src/screens/ExchangeScreen';
import ProformaScreen from './src/screens/ProformaScreen';
import OpportunitiesScreen from './src/screens/OpportunitiesScreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
  },
};

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={navTheme}>
            <Tab.Navigator
              initialRouteName="Exchange"
              screenOptions={({ route }) => ({
                headerTitle: 'ShapShap',
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: theme.colors.background, // Match screen background
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTintColor: theme.colors.primary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                  fontSize: 24,
                },
                tabBarStyle: {
                  backgroundColor: theme.colors.background,
                  borderTopColor: theme.colors.cardBorder,
                  borderTopWidth: 1,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                  maxWidth: 600,
                  width: '100%',
                  alignSelf: 'center',
                  borderRadius: 30,
                  marginBottom: 10,
                  overflow: 'hidden',
                  borderColor: theme.colors.cardBorder,
                  borderWidth: 1,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.placeholder,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Exchange') {
                    iconName = 'swap-horizontal';
                  } else if (route.name === 'Proforma') {
                    iconName = 'file-document-outline';
                  } else if (route.name === 'Opportunities') {
                    iconName = 'lightbulb-on-outline';
                  }

                  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Exchange" component={ExchangeScreen} />
              <Tab.Screen name="Proforma" component={ProformaScreen} />
              <Tab.Screen name="Opportunities" component={OpportunitiesScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
}