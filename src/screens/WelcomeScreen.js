import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const navigateTo = (screen) => navigation.navigate(screen);

  const DashboardCard = ({ title, icon, screen, description }) => (
    <GlassCard style={[styles.card, isDesktop ? styles.cardDesktop : styles.cardMobile]} onPress={() => navigateTo(screen)}>
        <View style={styles.cardHeader}>
            <Avatar.Icon size={56} icon={icon} style={{backgroundColor: 'rgba(0, 229, 255, 0.1)'}} color={theme.colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: theme.colors.placeholder }]}>{description}</Text>
        <View style={styles.arrowContainer}>
             <MaterialCommunityIcons name="arrow-right" size={24} color={theme.colors.secondary} />
        </View>
    </GlassCard>
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Welcome to ShapShap</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onSurface }]}>
            Your gateway to effortless business in China. Connect, trade, and grow without boundaries.
          </Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={isDesktop ? styles.row : styles.column}>
              <DashboardCard 
                title="Suppliers" 
                icon="dolly" 
                screen="Suppliers" 
                description="Find top-rated partners with transparent pricing."
              />
              <DashboardCard 
                title="Proforma" 
                icon="file-document-outline" 
                screen="Proforma" 
                description="Instant cost estimation and official documentation."
              />
          </View>
          <View style={isDesktop ? styles.row : styles.column}>
              <DashboardCard 
                title="I am in!" 
                icon="rocket-launch-outline" 
                screen="IAmIn" 
                description="Start your journey. Complete KYC and select services."
              />
              <DashboardCard 
                title="Opportunities" 
                icon="lightbulb-on-outline" 
                screen="Opportunities" 
                description="Exclusive deals and market insights for members."
              />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    marginVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 28,
  },
  gridContainer: {
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 20,
  },
  column: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  card: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDesktop: {
    width: 350,
    height: 220,
  },
  cardMobile: {
    width: '100%',
    height: 180,
  },
  cardHeader: {
      marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDesc: {
      fontSize: 14,
      lineHeight: 20,
  },
  arrowContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
  }
});