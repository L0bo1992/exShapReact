import 'react-native-gesture-handler';
import React from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from './src/theme/theme';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

// Screens
import ExchangeScreen from './src/screens/ExchangeScreen';
import ProformaScreen from './src/screens/ProformaScreen';
import OpportunitiesScreen from './src/screens/OpportunitiesScreen';
import AccountScreen from './src/screens/AccountScreen';

const Tab = createBottomTabNavigator();

const FLAGS = {
  en: 'https://flagcdn.com/w80/gb.png',
  fr: 'https://flagcdn.com/w80/fr.png'
};

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
  },
};

function LanguageTabButton(props) {
  const { language, setLanguage } = useLanguage();
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <View style={{ flex: 1, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
      {showOptions && (
        <View style={{ 
          position: 'absolute', 
          bottom: 85, 
          backgroundColor: theme.colors.surface, 
          padding: 12, 
          borderRadius: 15,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
          alignItems: 'center',
          gap: 12,
          // Using boxShadow for web compatibility
          boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)',
          elevation: 10,
          zIndex: 1000,
          width: 54, 
        }}>
          <TouchableOpacity onPress={() => { setLanguage('en'); setShowOptions(false); }}>
            <Image source={{ uri: FLAGS.en }} style={{ width: 30, height: 20, borderRadius: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setLanguage('fr'); setShowOptions(false); }}>
            <Image source={{ uri: FLAGS.fr }} style={{ width: 30, height: 20, borderRadius: 4 }} />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity 
        onPress={() => setShowOptions(!showOptions)} 
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={{ uri: FLAGS[language] }} style={{ width: 30, height: 20, borderRadius: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

function AppNavigator() {
  const { t } = useLanguage();
  
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        initialRouteName="Exchange"
        screenOptions={({ route }) => ({
          headerTitle: 'ShapShap',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.background,
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
            height: 80,
            paddingBottom: 15,
            paddingTop: 10,
            maxWidth: 600,
            width: '100%', // Match main content width exactly
            borderRadius: 40,
            bottom: 40,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
            position: 'absolute',
            left: 0,
            right: 18,
            marginHorizontal: 'auto',
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
            } else if (route.name === 'Account') {
              iconName = 'account-circle-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Exchange" component={ExchangeScreen} options={{ tabBarLabel: t('exchange') }} />
        <Tab.Screen name="Proforma" component={ProformaScreen} options={{ tabBarLabel: t('proforma') }} />
        <Tab.Screen name="Opportunities" component={OpportunitiesScreen} options={{ tabBarLabel: t('opportunities') }} />
        <Tab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: t('account') }} />
        <Tab.Screen 
          name="Language" 
          component={View} 
          options={{ 
            tabBarButton: (props) => <LanguageTabButton {...props} />,
            tabBarLabel: ''
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          overscroll-behavior-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
      `;
      document.head.append(style);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <LanguageProvider>
            <AppNavigator />
          </LanguageProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
}
