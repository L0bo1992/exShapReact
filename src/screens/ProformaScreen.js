import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, TextInput, Button, useTheme, List } from 'react-native-paper';
import { generateProforma } from '../services/api';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProformaScreen({ route, navigation }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 900;
  
  const supplier = route.params?.supplier;
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);
  const [proformaData, setProformaData] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
        const data = await generateProforma(supplier?.id || '0', parseInt(quantity));
        setProformaData(data);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const navigateToService = (serviceName) => {
      navigation.navigate('IAmIn', { selectedService: serviceName });
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentRow, isDesktop ? {flexDirection: 'row'} : {flexDirection: 'column'}]}>
            
            {/* Left Column: Form */}
            <View style={{flex: 1, marginRight: isDesktop ? 20 : 0}}>
                <GlassCard style={styles.card}>
                    <View style={styles.cardHeader}>
                         <MaterialCommunityIcons name="cube-scan" size={24} color={theme.colors.primary} />
                         <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}> 1. Product Cost Calculation</Text>
                    </View>
                    
                    {supplier ? (
                        <View style={[styles.supplierInfo, { backgroundColor: 'rgba(0, 229, 255, 0.1)', borderLeftColor: theme.colors.primary }]}>
                            <Text style={{color: theme.colors.primary, fontWeight: 'bold', fontSize: 16}}>{supplier.name}</Text>
                            <Text style={{color: theme.colors.onSurface}}>{supplier.product}</Text>
                            <Text style={{color: theme.colors.placeholder}}>Unit Price: {supplier.currency} {supplier.price}</Text>
                        </View>
                    ) : (
                         <Text style={{fontStyle: 'italic', marginBottom: 15, color: theme.colors.error}}>
                             No supplier selected. Please select one from the Suppliers page.
                         </Text>
                    )}
                    
                    <TextInput
                        label="Quantity"
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        textColor={theme.colors.text}
                        theme={{ colors: { background: theme.colors.background } }}
                    />
                    <Button 
                        mode="contained" 
                        onPress={handleGenerate} 
                        loading={loading} 
                        disabled={!supplier}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                    >
                        Calculate Cost
                    </Button>

                    {proformaData && (
                        <View style={[styles.resultBox, { backgroundColor: 'rgba(0, 230, 118, 0.1)' }]}>
                            <Text variant="headlineSmall" style={{color: theme.colors.success, fontWeight: 'bold'}}>Total: ${proformaData.totalCost}</Text>
                            <Button icon="download" mode="outlined" textColor={theme.colors.success} style={{marginTop: 10, borderColor: theme.colors.success}}>
                                Download PDF
                            </Button>
                        </View>
                    )}
                </GlassCard>

                {/* Additional Costs Links */}
                {[
                    "Shipping & International Freight",
                    "Insurance for the shipment",
                    "Import Duties & Taxes",
                    "Local Logistics",
                    "Customs Brokerage Fees"
                ].map((item, index) => (
                    <GlassCard key={index} style={[styles.card, {marginTop: 15, padding: 15}]} onPress={() => navigateToService(item)}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{color: theme.colors.onSurface, fontSize: 16}}>{index + 2}. {item}</Text>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
                        </View>
                    </GlassCard>
                ))}
            </View>

            {/* Right Column: PDF Preview */}
            <View style={{flex: 1, marginTop: isDesktop ? 0 : 20}}>
                <GlassCard style={{height: 600, padding: 0, overflow: 'hidden'}}>
                    <View style={{backgroundColor: theme.colors.surface, padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.cardBorder}}>
                        <Text style={{color: theme.colors.onSurface, fontWeight: 'bold'}}>Document Preview</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                        {proformaData ? (
                            <View style={{alignItems: 'center'}}>
                                <MaterialCommunityIcons name="file-pdf-box" size={120} color={theme.colors.error} />
                                <Text style={{color: theme.colors.onSurface, marginTop: 10, fontSize: 18}}>Invoice Ready</Text>
                                <Text style={{color: theme.colors.placeholder}}>Reference: #INV-2025-001</Text>
                            </View>
                        ) : (
                            <View style={{alignItems: 'center'}}>
                                <MaterialCommunityIcons name="file-hidden" size={80} color={theme.colors.placeholder} />
                                <Text style={{color: theme.colors.placeholder, marginTop: 10}}>Generate cost to preview</Text>
                            </View>
                        )}
                    </View>
                </GlassCard>
            </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
      padding: 20,
      paddingBottom: 40
  },
  contentRow: {
      flex: 1,
  },
  card: {
      marginBottom: 0,
  },
  cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  supplierInfo: {
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
      borderLeftWidth: 4,
  },
  input: {
      marginBottom: 15,
  },
  resultBox: {
      marginTop: 20,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 230, 118, 0.3)'
  }
});