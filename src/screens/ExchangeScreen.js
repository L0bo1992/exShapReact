import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { Text, useTheme, Button, TextInput, Divider, Menu, ProgressBar } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

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

export default function ExchangeScreen({ navigation }) {
  const theme = useTheme();
  const { t } = useLanguage();
  
  const [currency, setCurrency] = useState('NGN');
  const [menuVisible, setMenuVisible] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(BASE_RATES['NGN']);
  const [trend, setTrend] = useState('up'); 
  const [localAmount, setLocalAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15);
  const [isPremium, setIsPremium] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, []);

  const [isLocked, setIsLocked] = useState(false);


  const ourFeePercent = isPremium ? 0.575 : 0.5;
  const networkFeePercent = 0.1;

  useEffect(() => {
    const base = BASE_RATES[currency];
    if (isLocked) return;
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
  }, [currency, isLocked]);

  useEffect(() => {
    if (timeLeft > 0 && !isLocked) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isLocked) {
        setTimeLeft(isPremium ? 60 : 15);
    }
  }, [timeLeft, isPremium, isLocked]);

  const calcs = (() => {
    const amount = parseFloat(localAmount) || 0;
    const shapShapCNY = amount * exchangeRate;
    const bankTotalLocal = amount * 1.0126;
    const blackMarketTotalLocal = bankTotalLocal * 1.005;
    const fee = amount * (ourFeePercent / 100);
    const netFee = amount * (networkFeePercent / 100);
    const totalPayLocal = amount + fee + netFee;
    const savingsLocal = bankTotalLocal - totalPayLocal;

    return {
      shapShapCNY: shapShapCNY.toFixed(2),
      bankTotalLocal: bankTotalLocal.toFixed(2),
      blackMarketTotalLocal: blackMarketTotalLocal.toFixed(2),
      savingsLocal: savingsLocal.toFixed(2),
      fee: fee.toFixed(2),
      netFee: netFee.toFixed(2),
      totalPayLocal: totalPayLocal.toFixed(2)
    };
  })();

  const formatAmount = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleProceed = () => {
    if (!localAmount || parseFloat(localAmount) <= 0) {
      alert(t('enterAmountToConvert'));
      return;
    }
    navigation.navigate('Account', { 
      amount: calcs.totalPayLocal, 
      currency: currency,
      rmbAmount: calcs.shapShapCNY 
    });
  };

  const formatRate = (rate) => {
      if (rate < 0.01) return rate.toFixed(6);
      if (rate < 1) return rate.toFixed(4);
      return rate.toFixed(2);
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >        
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
              {t('anxietyReduce')} {'\n'}
              <Text style={{fontWeight: 'bold', color: theme.colors.secondary}}>{t('fastReliable')}</Text>
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

        <GlassCard style={styles.calculatorCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{t('liveAiCalculator')}</Text>
            <TextInput
                label={`${t('amountIn')} ${currency}`}
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
                    <Text style={{color: theme.colors.placeholder}}>{t('bankRate')}</Text>
                    <Text style={{color: theme.colors.onSurface}}>{formatAmount(calcs.bankTotalLocal)} {currency}</Text>
                </View>
                <View style={styles.comparisonRow}>
                    <Text style={{color: theme.colors.placeholder}}>{t('blackMarketRate')}</Text>
                    <Text style={{color: theme.colors.onSurface}}>{formatAmount(calcs.blackMarketTotalLocal)} {currency}</Text>
                </View>
            </View>
        </GlassCard>

        <GlassCard style={styles.feeCard}>
             <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>{t('shapShapFees')}</Text>
             <View style={styles.feeRow}>
                 <Text style={{color: theme.colors.placeholder}}>{t('ourFee')} ({ourFeePercent}%)</Text>
                 <Text style={{color: theme.colors.onSurface}}>{formatAmount(calcs.fee)} {currency}</Text>
             </View>
             <View style={styles.feeRow}>
                 <Text style={{color: theme.colors.placeholder}}>{t('networkFee')} ({networkFeePercent}%)</Text>
                 <Text style={{color: theme.colors.onSurface}}>{formatAmount(calcs.netFee)} {currency}</Text>
             </View>
             <Divider style={{ marginVertical: 10, backgroundColor: theme.colors.cardBorder }} />
             <View style={styles.feeRowTotal}>
                 <Text style={{color: theme.colors.onSurface, fontSize: 18}}>{t('totalPay')}</Text>
                 <Text style={{color: theme.colors.primary, fontSize: 20, fontWeight: 'bold'}}>{formatAmount(calcs.totalPayLocal)} {currency}</Text>
             </View>
             <View style={[styles.savingsRow, {marginTop: 15, backgroundColor: 'rgba(0, 230, 118, 0.1)', padding: 10, borderRadius: 8}]}>
                 <MaterialCommunityIcons name="piggy-bank-outline" size={24} color={theme.colors.secondary} />
                 <Text style={{color: theme.colors.secondary, marginLeft: 10, fontWeight: 'bold'}}>
                    {t('youGet')}: {formatAmount(calcs.shapShapCNY)} CNY | {t('youSave')}: {formatAmount(calcs.savingsLocal)} {currency}
                 </Text>
             </View>
        </GlassCard>

        <GlassCard style={styles.lockCard}>
            <View style={styles.lockHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.onSurface, marginBottom: 0 }]}>{t('rateLock')}</Text>
                <View style={styles.timerBadge}>
                    <MaterialCommunityIcons name="timer-outline" size={20} color={theme.colors.onPrimary} />
                    <Text style={{color: theme.colors.onPrimary, marginLeft: 5, fontWeight: 'bold'}}>{timeLeft}s</Text>
                </View>
            </View>
            <Text style={{color: theme.colors.placeholder, marginBottom: 15}}>
                {isPremium ? t('premiumLock') : t('standardLock')} {t('guaranteed')}
            </Text>
            <View style={styles.lockActions}>
                <Button 
                    mode={isLocked ? "contained" : "outlined"} 
                    onPress={() => setIsLocked(!isLocked)}
                    icon={isLocked ? "lock" : "lock-open-outline"}
                    style={{flex: 1, marginRight: 10}}
                >
                    {isLocked ? t('locked') : t('lockRate')}
                </Button>
                <Button 
                    mode="contained" 
                    buttonColor={theme.colors.secondary}
                    onPress={() => setIsPremium(!isPremium)}
                    style={{flex: 1}}
                >
                    {isPremium ? t('standard') : t('goPremium')}
                </Button>
            </View>
            <ProgressBar 
                progress={timeLeft / (isPremium ? 60 : 15)} 
                color={timeLeft < 5 ? theme.colors.error : theme.colors.primary} 
                style={{marginTop: 15, height: 6, borderRadius: 3}}
            />
        </GlassCard>

        <GlassCard style={styles.actionCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface, marginBottom: 15 }]}>{t('getRenminbi')}</Text>
            <Button 
                mode="contained" 
                onPress={handleProceed}
                icon="currency-cny"
                contentStyle={styles.actionBtnContent}
                labelStyle={styles.actionBtnLabel}
            >
                {t('proceed')}
            </Button>
        </GlassCard>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
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
  lockCard: {
    padding: 20,
    marginBottom: 20,
  },
  lockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E5FF', // Primary
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  lockActions: {
    flexDirection: 'row',
  },
  actionCard: {
    padding: 20,
  },
  actionBtnContent: {
    height: 50,
  },
  actionBtnLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
});