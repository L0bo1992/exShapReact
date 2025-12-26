import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import Sidebar from './src/components/Sidebar';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import SuppliersScreen from './src/screens/SuppliersScreen';
import ProformaScreen from './src/screens/ProformaScreen';
import IAmInScreen from './src/screens/IAmInScreen';
import OpportunitiesScreen from './src/screens/OpportunitiesScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Welcome"
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{
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
              drawerStyle: {
                  width: 280,
                  backgroundColor: theme.colors.sidebarBackground,
              },
              drawerActiveTintColor: theme.colors.primary,
              drawerInactiveTintColor: theme.colors.onSurface,
            }}
          >
            <Drawer.Screen name="Welcome" component={WelcomeScreen} />
            <Drawer.Screen name="Suppliers" component={SuppliersScreen} />
            <Drawer.Screen name="Proforma" component={ProformaScreen} />
            <Drawer.Screen name="IAmIn" component={IAmInScreen} options={{ title: 'I am in!' }} />
            <Drawer.Screen name="Opportunities" component={OpportunitiesScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}