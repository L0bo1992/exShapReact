import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Text, Avatar, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Sidebar(props) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.sidebarBackground, '#1a2236']}
      style={{ flex: 1 }}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <View style={styles.drawerHeader}>
           <Avatar.Icon 
             size={72} 
             icon="briefcase-variant-outline" 
             style={{backgroundColor: theme.colors.primary}} 
             color={theme.colors.onPrimary} 
           />
           <Text style={[styles.title, styles.centeredText, { color: theme.colors.primary }]}>ShapShap</Text>
           <Text style={[styles.caption, { color: theme.colors.placeholder }]}>Future of Business</Text>
        </View>
        
        <Divider style={{backgroundColor: theme.colors.cardBorder, marginVertical: 20}} />
        
        {[
          { label: 'Welcome', icon: 'home-lightning-bolt-outline', route: 'Welcome' },
          { label: 'Suppliers', icon: 'dolly', route: 'Suppliers' },
          { label: 'Proforma', icon: 'file-document-outline', route: 'Proforma' },
          { label: 'I am in!', icon: 'rocket-launch-outline', route: 'IAmIn' },
          { label: 'Opportunities', icon: 'lightbulb-on-outline', route: 'Opportunities' }
        ].map((item, index) => (
           <DrawerItem
             key={index}
             icon={({ color, size }) => (
               <MaterialCommunityIcons name={item.icon} color={theme.colors.primary} size={size} />
             )}
             label={item.label}
             labelStyle={{ color: theme.colors.onSurface, fontWeight: '600', marginLeft: -10 }}
             onPress={() => props.navigation.navigate(item.route)}
             style={styles.drawerItem}
             activeTintColor={theme.colors.primary}
           />
        ))}

      </DrawerContentScrollView>
      <View style={[styles.footer, { borderTopColor: theme.colors.cardBorder }]}>
        <Text style={[styles.footerText, { color: theme.colors.placeholder }]}>© ShapShap 2025</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    padding: 10,
  },
  centeredText: {
    textAlign: 'center',
  },
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  caption: {
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  drawerItem: {
    borderRadius: 12,
    marginVertical: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
  },
});