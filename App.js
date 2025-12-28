import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from './src/theme/theme';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import SuppliersScreen from './src/screens/SuppliersScreen';
import ProformaScreen from './src/screens/ProformaScreen';
import IAmInScreen from './src/screens/IAmInScreen';
import OpportunitiesScreen from './src/screens/OpportunitiesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Welcome"
            screenOptions={({ route }) => ({
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
              },
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.cardBorder,
                borderTopWidth: 1,
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.placeholder,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Welcome') {
                  iconName = 'home-lightning-bolt-outline';
                } else if (route.name === 'Suppliers') {
                  iconName = 'dolly';
                } else if (route.name === 'Proforma') {
                  iconName = 'file-document-outline';
                } else if (route.name === 'IAmIn') {
                  iconName = 'rocket-launch-outline';
                } else if (route.name === 'Opportunities') {
                  iconName = 'lightbulb-on-outline';
                }

                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Welcome" component={WelcomeScreen} />
            <Tab.Screen name="Suppliers" component={SuppliersScreen} />
            <Tab.Screen name="Proforma" component={ProformaScreen} />
            <Tab.Screen name="IAmIn" component={IAmInScreen} options={{ title: 'I am in!' }} />
            <Tab.Screen name="Opportunities" component={OpportunitiesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}