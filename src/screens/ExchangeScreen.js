import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, TextInput, Divider, Menu } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SUPPORTED_CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'XAF', name: 'Central African CFA' },
  { code: 'XOF', name: 'West African CFA' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'GHS', name: 'Ghana Cedi' },
  { code: 'ETB', name: 'Ethiopian Birr' },
  { code: 'PKR', name: 'Pakistan Rupee' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'CDF', name: 'Congolese Franc' },
];

// Mock Base Rates: 1 Local Currency = X CNY
const BASE_RATES = {
  'NGN': 0.0048,
  'XAF': 0.0118,
  'XOF': 0.0118,
  'KES': 0.055,
  'GHS': 0.48,
  'ETB': 0.062,
  'PKR': 0.025,
  'BDT': 0.061,
  'VND': 0.00029,
  'THB': 0.21,
  'CDF': 0.00036
};

export default function ExchangeScreen() {
  const theme = useTheme();
  
  // Currency Selection State
  const [currency, setCurrency] = useState('NGN');
  const [menuVisible, setMenuVisible] = useState(false);

  // Rate Ticker State
  const [exchangeRate, setExchangeRate] = useState(BASE_RATES['NGN']);
  const [trend, setTrend] = useState('up'); 

  // Calculator State
  const [localAmount, setLocalAmount] = useState('');

  // Fees (ShapShap total = 0.6%)
  const ourFeePercent = 0.5;
  const networkFeePercent = 0.1;

  // Mock Live Rate Ticker
  useEffect(() => {
    const base = BASE_RATES[currency];
    setExchangeRate(base);

    const interval = setInterval(() => {
      const changePercent = (Math.random() - 0.5) * 0.01;
      setExchangeRate(prev => {
        const change = base * changePercent;
        const newVal = prev + change;
        setTrend(change > 0 ? 'up' : 'down');
        return newVal;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currency]);

  const calculateSavings = () => {
    const amount = parseFloat(localAmount) || 0;
    
    // User Example Model:
    // Input: 1,000,000
    // Bank Total: 1,011,700 (1.26% Fee)
    // ShapShap Cost: 1,006,000 (0.6% Fee)
    // Savings: 5,700

    // Bank Total Cost = Amount * 1.0126
    const bankTotal = amount * 1.0126;
    
    // Black Market: 5% more expensive than Bank
    const blackMarketTotal = bankTotal * 1.005;
    
    // ShapShap Fees: 0.6%
    const shapShapFeesTotal = (amount * (ourFeePercent + networkFeePercent)) / 100;
    const totalPayEst = amount + shapShapFeesTotal;
    
    // You Save: Bank Total Cost - ShapShap Total Pay
    const savingsLocal = bankTotal - totalPayEst;

    return {
      shapShap: (amount * exchangeRate).toFixed(2),
      bankTotal: bankTotal.toFixed(2),
      blackMarketTotal: blackMarketTotal.toFixed(2),
      savings: savingsLocal.toFixed(2)
    };
  };

  const calculations = calculateSavings();
  const fee = (parseFloat(localAmount) || 0) * (ourFeePercent / 100);
  const netFee = (parseFloat(localAmount) || 0) * (networkFeePercent / 100);
  const totalPay = (parseFloat(localAmount) || 0) + fee + netFee;

  const formatRate = (rate) => {
      if (rate < 0.01) return rate.toFixed(6);
      if (rate < 1) return rate.toFixed(4);
      return rate.toFixed(2);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>        
        {/* Header / Live Ticker */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
              ShapShap is designed to reduce the anxiety of cross-border trade. {'\n'}
              <Text style={{fontWeight: 'bold', color: theme.colors.secondary}}>Fast and Reliable!</Text>
          </Text>
          
          <View style={styles.tickerContainer}>
             <Menu
               visible={menuVisible}
               onDismiss={() => setMenuVisible(false)}
               anchor={
                 <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.currencySelector}>
                    <Text style={[styles.tickerLabel, { color: theme.colors.onSurface }]}>1 {currency}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.placeholder} />
                 </TouchableOpacity>
               }
               contentStyle={{ backgroundColor: theme.colors.surface }}
             >
               {SUPPORTED_CURRENCIES.map((curr) => (
                 <Menu.Item 
                    key={curr.code} 
                    onPress={() => { setCurrency(curr.code); setMenuVisible(false); }}
                    title={`${curr.code} - ${curr.name}`}
                    titleStyle={{ color: theme.colors.onSurface }}
                 />
               ))}
             </Menu>

             <Text style={[styles.tickerLabel, { color: theme.colors.onSurface }]}> ≈ </Text>
             
             <Text style={[styles.tickerValue, { color: trend === 'up' ? theme.colors.success : theme.colors.error }]}>
               {formatRate(exchangeRate)} CNY 
             </Text>
             
             <MaterialCommunityIcons 
                name={trend === 'up' ? 'trending-up' : 'trending-down'}
                size={24} 
                color={trend === 'up' ? theme.colors.success : theme.colors.error} 
             />
          </View>
        </View>

        {/* Savings Calculator */}
        <GlassCard style={styles.calculatorCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Live AI Rate Calculator</Text>
            
            <TextInput
                label={`Amount in ${currency}`}
                value={localAmount}
                onChangeText={setLocalAmount}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                theme={{ colors: { background: theme.colors.surface } }}
            />

            <View style={styles.comparisonContainer}>
                <View style={styles.comparisonRow}>
                    <Text style={{color: theme.colors.placeholder}}>Bank Rate (Official)</Text>
                    <Text style={{color: theme.colors.onSurface}}>{calculations.bankTotal} {currency}</Text>
                </View>
                <View style={styles.comparisonRow}>
                    <Text style={{color: theme.colors.placeholder}}>Black Market Rate</Text>
                    <Text style={{color: theme.colors.onSurface}}>{calculations.blackMarketTotal} {currency}</Text>
                </View>
            </View>
        </GlassCard>

        {/* Fee Breakdown */}
        <GlassCard style={styles.feeCard}>
             <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>ShapShap Fees</Text>
             <View style={styles.feeRow}>
                 <Text style={{color: theme.colors.placeholder}}>Our Fee ({ourFeePercent}%)</Text>
                 <Text style={{color: theme.colors.onSurface}}>{fee.toFixed(2)} {currency}</Text>
             </View>
             <View style={styles.feeRow}>
                 <Text style={{color: theme.colors.placeholder}}>Network Fee ({networkFeePercent}%)</Text>
                 <Text style={{color: theme.colors.onSurface}}>{netFee.toFixed(2)} {currency}</Text>
             </View>
             
             <Divider style={{ marginVertical: 10, backgroundColor: theme.colors.cardBorder }} />
             
             <View style={styles.feeRowTotal}>
                 <Text style={{color: theme.colors.onSurface, fontSize: 18}}>Total Pay</Text>
                 <Text style={{color: theme.colors.primary, fontSize: 20, fontWeight: 'bold'}}>{totalPay.toFixed(2)} {currency}</Text>
             </View>

             <View style={[styles.savingsRow, {marginTop: 15, backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: 10, borderRadius: 8}]}>
                 <MaterialCommunityIcons name="piggy-bank-outline" size={24} color={theme.colors.secondary} />
                 <Text style={{color: theme.colors.secondary, marginLeft: 10, fontWeight: 'bold'}}>
                     You Save: {calculations.savings} {currency}
                 </Text>
             </View>
        </GlassCard>

        {/* Get RENMINBI */}
        <GlassCard style={styles.actionCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface, marginBottom: 15 }]}>Get RENMINBI</Text>
            
            <Button 
                mode="contained" 
                onPress={() => alert("Proceed to get RENMINBI")}
                icon="currency-cny"
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
            >
                Proceed to Get RENMINBI
            </Button>
        </GlassCard>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 16, 
    color: '#E2E8F0', 
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10
  },
  currencySelector: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  tickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tickerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
    marginLeft: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  calculatorCard: {
    padding: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  comparisonContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  feeCard: {
    padding: 20,
    marginBottom: 20,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  actionCard: {
    padding: 20,
  },
  actionButtons: { // This style is no longer used but kept for now.
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: { // This style is no longer used but kept for now.
    flex: 1,
  },
  actionBtnContent: {
    height: 50, // Adjusted height for single button
  },
  actionBtnLabel: {
    fontSize: 16, // Adjusted font size for single button
    textAlign: 'center',
  },
});
