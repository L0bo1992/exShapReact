import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Checkbox, useTheme } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';

export default function IAmInScreen({ route, navigation }) {
  const theme = useTheme();
  const selectedService = route.params?.selectedService;

  const [formData, setFormData] = useState({
      fullName: '',
      companyName: '',
      country: '',
      address: '',
      email: '',
      whatsapp: '',
  });

  const [services, setServices] = useState({
      exchange: false,
      shipping: false,
      insurance: false,
      importDuties: false,
      localLogistics: false,
      customs: false,
  });

  useEffect(() => {
      if (selectedService) {
          if (selectedService.includes("Shipping")) setServices(s => ({...s, shipping: true}));
          if (selectedService.includes("Insurance")) setServices(s => ({...s, insurance: true}));
          if (selectedService.includes("Duties")) setServices(s => ({...s, importDuties: true}));
          if (selectedService.includes("Logistics")) setServices(s => ({...s, localLogistics: true}));
          if (selectedService.includes("Customs")) setServices(s => ({...s, customs: true}));
      }
  }, [selectedService]);

  const handleSubmit = () => {
      if (!formData.email || !formData.fullName) {
          alert("Please fill in required fields.");
          return;
      }
      alert("Registration Submitted! We will contact you shortly.");
      navigation.navigate('Welcome');
  };

  const CustomCheckbox = ({ label, status, onPress }) => (
      <View style={styles.checkboxRow}>
          <Checkbox.Android 
            status={status ? 'checked' : 'unchecked'} 
            onPress={onPress} 
            color={theme.colors.primary} 
            uncheckedColor={theme.colors.placeholder}
          />
          <Text style={{color: theme.colors.onSurface, marginLeft: 8}} onPress={onPress}>{label}</Text>
      </View>
  )

  return (
    <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.primary}]}>Join exShap</Text>
            <Text style={[styles.subtitle, {color: theme.colors.placeholder}]}>
                Complete your KYC profile to unlock full access to global trade.
            </Text>
        </View>

        <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, {color: theme.colors.secondary}]}>1. Identity & Company</Text>
            
            <View style={styles.inputGroup}>
                <TextInput label="Full Name" mode="outlined" value={formData.fullName} onChangeText={t => setFormData({...formData, fullName: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
                <TextInput label="Company Name" mode="outlined" value={formData.companyName} onChangeText={t => setFormData({...formData, companyName: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
                <TextInput label="Country" mode="outlined" value={formData.country} onChangeText={t => setFormData({...formData, country: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
                <TextInput label="Address" mode="outlined" multiline numberOfLines={3} value={formData.address} onChangeText={t => setFormData({...formData, address: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
                
                <Button mode="outlined" icon="upload" onPress={() => alert("File Picker Mock")} style={styles.uploadBtn} textColor={theme.colors.primary}>
                    Upload ID/Passport Document
                </Button>
            </View>
        </GlassCard>

        <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, {color: theme.colors.secondary}]}>2. Required Services</Text>
            <View style={styles.checkboxGroup}>
                <CustomCheckbox label="Currency Exchange" status={services.exchange} onPress={() => setServices({...services, exchange: !services.exchange})} />
                <CustomCheckbox label="Shipping & Freight" status={services.shipping} onPress={() => setServices({...services, shipping: !services.shipping})} />
                <CustomCheckbox label="Cargo Insurance" status={services.insurance} onPress={() => setServices({...services, insurance: !services.insurance})} />
                <CustomCheckbox label="Import Duties & Taxes" status={services.importDuties} onPress={() => setServices({...services, importDuties: !services.importDuties})} />
                <CustomCheckbox label="Local Logistics" status={services.localLogistics} onPress={() => setServices({...services, localLogistics: !services.localLogistics})} />
                <CustomCheckbox label="Customs Brokerage" status={services.customs} onPress={() => setServices({...services, customs: !services.customs})} />
            </View>
        </GlassCard>

        <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, {color: theme.colors.secondary}]}>3. Contact</Text>
            <TextInput label="Email Address" mode="outlined" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
            <TextInput label="WhatsApp Number" mode="outlined" keyboardType="phone-pad" value={formData.whatsapp} onChangeText={t => setFormData({...formData, whatsapp: t})} style={styles.input} textColor={theme.colors.text} theme={{ colors: { background: theme.colors.background } }} />
        </GlassCard>

        <Button 
            mode="contained" 
            onPress={handleSubmit} 
            style={styles.submitBtn} 
            contentStyle={{paddingVertical: 8}}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
        >
            Submit Application
        </Button>
        </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 50
  },
  header: {
      marginBottom: 30,
      alignItems: 'center'
  },
  title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center'
  },
  subtitle: {
      fontSize: 16,
      textAlign: 'center'
  },
  card: {
      marginBottom: 20,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textTransform: 'uppercase',
      letterSpacing: 1
  },
  input: {
      marginBottom: 15,
  },
  uploadBtn: {
      marginTop: 10,
      borderColor: 'rgba(255,255,255,0.2)'
  },
  checkboxGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  checkboxRow: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
  },
  submitBtn: {
      marginTop: 20,
      borderRadius: 50, // Pill shape
  }
});