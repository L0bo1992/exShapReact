import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, RefreshControl } from 'react-native';
import { Text, useTheme, TextInput, Button, SegmentedButtons, List, Checkbox, Avatar, DataTable, IconButton, Portal, Modal, FAB, Divider, Snackbar } from 'react-native-paper';
import { DatePickerInput, registerTranslation, en } from 'react-native-paper-dates';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

registerTranslation('en', en);

const INITIAL_HISTORY = [
  {id: 1, date: '2025-12-28', amount: '5 000', status: 'completed'},
  {id: 2, date: '2025-12-29', amount: '1 200', status: 'pending'},
  {id: 3, date: '2025-12-30', amount: '8 000', status: 'failed'},
  {id: 4, date: '2025-12-31', amount: '2 500', status: 'completed'},
  {id: 5, date: '2026-01-01', amount: '4 000', status: 'pending'},
];

const SUPPORTED_COUNTRIES = [
  { code: 'NGN', name: 'Nigeria' },
  { code: 'XAF', name: 'Cameroon/Gabon/Chad (XAF)' },
  { code: 'XOF', name: 'Senegal/Ivory Coast (XOF)' },
  { code: 'KES', name: 'Kenya' },
  { code: 'GHS', name: 'Ghana' },
  { code: 'ETB', name: 'Ethiopia' },
  { code: 'PKR', name: 'Pakistan' },
  { code: 'BDT', name: 'Bangladesh' },
  { code: 'VND', name: 'Vietnam' },
  { code: 'THB', name: 'Thailand' },
  { code: 'CDF', name: 'DR Congo' },
];

export default function AccountScreen({ route }) {
  const theme = useTheme();
  const { t } = useLanguage();
  
  // Main Section: 'profile', 'history', 'security'
  const [section, setSection] = useState('profile'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [shapAmount, setShapAmount] = useState(route.params?.amount || '0');
  const [selectedCountry, setSelectedCountry] = useState(route.params?.currency || 'NGN');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [bankReference, setBankReference] = useState('');
  
  const [transferTarget, setTransferTarget] = useState({ alipay: false, wechat: false });
  const [accountHolderName, setAccountHolderName] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showMethodMenu, setShowMethodMenu] = useState(false);

  // History Filter
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [historyData, setHistoryData] = useState(INITIAL_HISTORY);
  const [filteredHistory, setFilteredHistory] = useState(INITIAL_HISTORY);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    if (route.params?.amount) {
      setShapAmount(route.params.amount);
      setSelectedCountry(route.params.currency);
      setModalVisible(true);
    }
  }, [route.params]);

  const formatAmount = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleDepositSubmit = () => {
    if (!paymentMethod) {
      alert(t('selectPayment'));
      return;
    }
    if (paymentMethod === t('mobileMoney') && !mobileMoneyNumber) {
      alert(t('enterValid'));
      return;
    }
    if (paymentMethod === t('bankTransfer') && !bankReference) {
      alert(t('enterReference'));
      return;
    }
    alert(t('success'));
  };

  const handleTransferSubmit = () => {
    if (!transferTarget.alipay && !transferTarget.wechat) {
        alert(t('selectPayment'));
        return;
    }
    if (!accountHolderName || !targetAccountNumber) {
        alert(t('enterValid'));
        return;
    }
    Alert.alert(t('success'), t('successTransferMsg'));
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    // If user filled deposit info, validate it
    if (paymentMethod) {
        if (paymentMethod === t('mobileMoney') && !mobileMoneyNumber) {
            alert(t('enterValid'));
            return;
        }
        if (paymentMethod === t('bankTransfer') && !bankReference) {
            alert(t('enterReference'));
            return;
        }
    }

    // If user filled transfer info, validate it
    if (transferTarget.alipay || transferTarget.wechat || accountHolderName || targetAccountNumber) {
        if (!transferTarget.alipay && !transferTarget.wechat) {
            alert(t('selectPayment'));
            return;
        }
        if (!accountHolderName || !targetAccountNumber) {
            alert(t('enterValid'));
            return;
        }
    }

    // If everything is empty
    if (!paymentMethod && !transferTarget.alipay && !transferTarget.wechat) {
        alert(t('selectPayment'));
        return;
    }

    // Create a new transaction object
    const newTx = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: formatAmount(route.params?.rmbAmount || shapAmount),
        status: 'pending'
    };

    // Update dynamic history
    const updatedHistory = [newTx, ...historyData];
    setHistoryData(updatedHistory);
    
    // Reset filters so the new item is visible immediately
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredHistory(updatedHistory);

    // Show notification and close modal
    setSnackbarVisible(true);
    setModalVisible(false);
  };

  const handleCheckHistory = () => {
    if (!startDate && !endDate) {
      setFilteredHistory(historyData);
      return;
    }

    const start = startDate ? new Date(startDate) : new Date(0); // Epoch if no start date
    const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date if no end date
    
    // Adjust end date to include the full day
    end.setHours(23, 59, 59, 999);

    const filtered = historyData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });

    setFilteredHistory(filtered);
  };

  const renderDepositBox = () => (
    <GlassCard style={styles.card}>
      <Text style={styles.cardTitle}>{t('deposit')}</Text>
      
      <TextInput
        label={t('depositAmount')}
        value={`${formatAmount(shapAmount)}`}
        editable={false}
        mode="outlined"
        style={styles.input}
        outlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />

      <List.Accordion
        title={SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry)?.name || t('selectCountry')}
        left={props => <List.Icon {...props} icon="earth" color={theme.colors.primary} />}
        expanded={showCountryMenu}
        onPress={() => setShowCountryMenu(!showCountryMenu)}
        style={styles.accordion}
        titleStyle={{ color: theme.colors.onSurface }}
      >
        {SUPPORTED_COUNTRIES.map((item) => (
          <List.Item
            key={item.code}
            title={item.name}
            onPress={() => { setSelectedCountry(item.code); setShowCountryMenu(false); }}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        ))}
      </List.Accordion>

      <List.Accordion
        title={paymentMethod || t('selectPayment')}
        left={props => <List.Icon {...props} icon="credit-card-outline" color={theme.colors.primary} />}
        expanded={showMethodMenu}
        onPress={() => setShowMethodMenu(!showMethodMenu)}
        style={styles.accordion}
        titleStyle={{ color: theme.colors.onSurface }}
      >
        {[t('bankTransfer'), t('mobileMoney')].map((method) => (
          <List.Item
            key={method}
            title={method}
            onPress={() => { setPaymentMethod(method); setShowMethodMenu(false); }}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        ))}
      </List.Accordion>

      {paymentMethod === t('mobileMoney') && (
        <TextInput
          label={t('mobileMoneyNumber')}
          value={mobileMoneyNumber}
          onChangeText={setMobileMoneyNumber}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />
      )}

      {paymentMethod === t('bankTransfer') && (
        <View style={styles.bankInfoContainer}>
            <Text style={{color: theme.colors.onSurface, marginBottom: 5}}>{t('bankTransferInstruction')}</Text>
            <Text style={styles.bankDetailsText}>{t('bankAccountDetails')}</Text>
            <TextInput
                label={t('transactionRef')}
                value={bankReference}
                onChangeText={setBankReference}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
            />
        </View>
      )}
    </GlassCard>
  );

  const renderTransferBox = () => (
    <GlassCard style={styles.card}>
        <Text style={styles.cardTitle}>{t('transfer')}</Text>
        
        <View style={styles.checkboxRow}>
            <View style={styles.checkboxItem}>
                <Checkbox
                    status={transferTarget.alipay ? 'checked' : 'unchecked'}
                    onPress={() => setTransferTarget({ ...transferTarget, alipay: !transferTarget.alipay })}
                    color={theme.colors.primary}
                />
                <Text style={{color: theme.colors.onSurface}}>{t('alipay')}</Text>
            </View>
            <View style={styles.checkboxItem}>
                <Checkbox
                    status={transferTarget.wechat ? 'checked' : 'unchecked'}
                    onPress={() => setTransferTarget({ ...transferTarget, wechat: !transferTarget.wechat })}
                    color={theme.colors.primary}
                />
                <Text style={{color: theme.colors.onSurface}}>{t('wechatpay')}</Text>
            </View>
        </View>

        <TextInput
            label={t('accountHolderName')}
            value={accountHolderName}
            onChangeText={setAccountHolderName}
            mode="outlined"
            style={styles.input}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
        />

        <TextInput
            label={t('accountNumber')}
            value={targetAccountNumber}
            onChangeText={setTargetAccountNumber}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
        />
    </GlassCard>
  );

  const renderProfile = () => (
      <GlassCard style={styles.card}>
          <View style={styles.profileHeader}>
              <Avatar.Text size={80} label="SU" style={{backgroundColor: theme.colors.primary}} />
              <Text style={[styles.cardTitle, {marginTop: 10}]}>ShapShap User</Text>
          </View>
          <Divider style={{backgroundColor: theme.colors.cardBorder, marginBottom: 15}} />
          <List.Item
            title={t('email')}
            description="user@example.com"
            left={props => <List.Icon {...props} icon="email" color={theme.colors.secondary} />}
            titleStyle={{color: theme.colors.onSurface}}
            descriptionStyle={{color: theme.colors.placeholder}}
          />
          <List.Item
            title={t('phone')}
            description="+1 234 567 890"
            left={props => <List.Icon {...props} icon="phone" color={theme.colors.secondary} />}
            titleStyle={{color: theme.colors.onSurface}}
            descriptionStyle={{color: theme.colors.placeholder}}
          />
          <List.Item
            title={t('address')}
            description="123 Trade St, Global City"
            left={props => <List.Icon {...props} icon="map-marker" color={theme.colors.secondary} />}
            titleStyle={{color: theme.colors.onSurface}}
            descriptionStyle={{color: theme.colors.placeholder}}
          />
      </GlassCard>
  );

  const renderHistory = () => (
      <View>
        <GlassCard style={styles.card}>
            <Text style={styles.cardTitle}>{t('history')}</Text>
            <View style={styles.dateFilter}>
                <View style={{flex: 1, marginRight: 5}}>
                    <DatePickerInput
                        locale="en"
                        label={t('startDate')}
                        placeholder="Start"
                        value={startDate}
                        onChange={d => setStartDate(d)}
                        inputMode="start"
                        style={styles.input}
                        textColor={theme.colors.onSurface}
                        mode="outlined"
                        withDateFormatInLabel={false}
                    />
                </View>
                <View style={{flex: 1, marginLeft: 5}}>
                    <DatePickerInput
                        locale="en"
                        label={t('endDate')}
                        placeholder="End"
                        value={endDate}
                        onChange={d => setEndDate(d)}
                        inputMode="start"
                        style={styles.input}
                        textColor={theme.colors.onSurface}
                        mode="outlined"
                        withDateFormatInLabel={false}
                    />
                </View>
            </View>
            <Button 
                mode="contained" 
                onPress={handleCheckHistory} 
                style={{marginTop: 15}}
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onPrimary}
            >
                {t('check')}
            </Button>
        </GlassCard>
        
        <GlassCard style={{padding: 0, overflow: 'hidden'}}>
             <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={{flex: 1}} textStyle={{color: theme.colors.placeholder}}>Date</DataTable.Title>
                    <DataTable.Title style={{flex: 1, justifyContent: 'center'}} textStyle={{color: theme.colors.placeholder}}>Amount (RMB)</DataTable.Title>
                    <DataTable.Title style={{flex: 1, justifyContent: 'center'}} textStyle={{color: theme.colors.placeholder}}>Status</DataTable.Title>
                    <DataTable.Title style={{flex: 1, justifyContent: 'flex-end'}} textStyle={{color: theme.colors.placeholder}}>Receipt PDF</DataTable.Title>
                </DataTable.Header>

                {filteredHistory.map((item) => (
                    <DataTable.Row key={item.id}>
                        <DataTable.Cell style={{flex: 1}} textStyle={{color: theme.colors.onSurface}}>{item.date}</DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}} textStyle={{color: theme.colors.onSurface}}>{item.amount}</DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, justifyContent: 'center'}} textStyle={{
                            color: item.status === 'completed' ? theme.colors.success : 
                                   item.status === 'pending' ? theme.colors.secondary : theme.colors.error
                        }}>
                            {t(item.status)}
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, justifyContent: 'flex-end'}}>
                             {item.status === 'completed' && (
                                 <IconButton icon="file-download-outline" size={20} iconColor={theme.colors.primary} onPress={() => alert(t('downloadPdf'))} />
                             )}
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
             </DataTable>
        </GlassCard>
      </View>
  );

  const renderSecurity = () => (
      <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>{t('security')}</Text>
          <List.Item
            title={t('changePassword')}
            left={props => <List.Icon {...props} icon="lock-reset" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.placeholder} />}
            onPress={() => {}}
            titleStyle={{color: theme.colors.onSurface}}
          />
          <Divider style={{backgroundColor: theme.colors.cardBorder}} />
          <List.Item
            title={t('enable2FA')}
            left={props => <List.Icon {...props} icon="shield-check" color={theme.colors.primary} />}
            right={props => <Checkbox status="unchecked" />}
            onPress={() => {}}
            titleStyle={{color: theme.colors.onSurface}}
          />
      </GlassCard>
  );

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        <SegmentedButtons
          value={section}
          onValueChange={setSection}
          style={styles.topNav}
          buttons={[
            { value: 'profile', label: t('profile'), icon: 'account' },
            { value: 'history', label: t('history'), icon: 'history' },
            { value: 'security', label: t('security'), icon: 'shield-account' },
          ]}
        />

        {section === 'profile' && renderProfile()}
        {section === 'history' && renderHistory()}
        {section === 'security' && renderSecurity()}

      </ScrollView>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t('transfer')}</Text>
                    <IconButton icon="close" onPress={() => setModalVisible(false)} iconColor={theme.colors.onSurface} />
                </View>
                {renderDepositBox()}
                {renderTransferBox()}
                <Button 
                    mode="contained" 
                    onPress={handleModalSubmit}
                    style={[styles.submitBtn, {marginTop: 20}]}
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.onPrimary}
                >
                    {t('ok')}
                </Button>
            </ScrollView>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: t('ok'),
          onPress: () => setSnackbarVisible(false),
        }}
        style={{ backgroundColor: theme.colors.surface }}
        wrapperStyle={{ bottom: 90 }} // Above tab bar
      >
        <Text style={{ color: theme.colors.onSurface }}>{t('successTransferMsg')}</Text>
      </Snackbar>

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
  topNav: {
      width: '100%',
      marginBottom: 20,
  },
  card: {
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  accordion: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginBottom: 15,
  },
  submitBtn: {
    marginTop: 10,
    paddingVertical: 5,
  },
  bankInfoContainer: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
  },
  bankDetailsText: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 15,
      lineHeight: 20
  },
  checkboxRow: {
      flexDirection: 'row',
      marginBottom: 20,
  },
  checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
  },
  profileHeader: {
      alignItems: 'center',
      marginBottom: 20
  },
  dateFilter: {
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 90, // Adjusted to be above bottom tabs
  },
  modalContainer: {
      backgroundColor: '#1A202C', // Dark background for modal
      padding: 20,
      margin: 20,
      borderRadius: 15,
      maxHeight: '80%',
      maxWidth: 600,
      alignSelf: 'center',
      width: '100%' // Ensure full width on mobile
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
  },
  modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff'
  }
});