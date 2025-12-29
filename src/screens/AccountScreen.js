import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, TextInput, Button, SegmentedButtons, List, Divider } from 'react-native-paper';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [section, setSection] = useState('transfer'); 
  
  const [shapAmount, setShapAmount] = useState(route.params?.amount || '0');
  const [selectedCountry, setSelectedCountry] = useState(route.params?.currency || 'NGN');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showMethodMenu, setShowMethodMenu] = useState(false);

  const [cvvVisible, setCvvVisible] = useState(false);
  const [sendToAccount, setSendToAccount] = useState('');
  const [rmbToSend, setRmbToSend] = useState('');
  const [rmbBalance, setRmbBalance] = useState(route.params?.rmbAmount || '0.00');

  useEffect(() => {
    if (route.params?.amount) {
      setShapAmount(route.params.amount);
      setSelectedCountry(route.params.currency);
      setRmbBalance(route.params.rmbAmount || '0.00');
    }
  }, [route.params]);

  const handleTransferSubmit = () => {
    if (!paymentMethod || !accountNumber) {
      alert("Please fill in all fields.");
      return;
    }
    setShowTransferSuccess(true);
  };

  const handlePayRmb = () => {
    const toSend = parseFloat(rmbToSend);
    const balance = parseFloat(rmbBalance);

    if (!sendToAccount || isNaN(toSend) || toSend <= 0) {
      alert("Please enter a valid recipient account and amount.");
      return;
    }
    if (toSend > balance) {
      alert("Insufficient balance.");
      return;
    }

    alert(`Transfer of RMB ${toSend.toFixed(2)} processed successfully!`);
    setRmbBalance((balance - toSend).toFixed(2));
    setRmbToSend('');
    setSendToAccount('');
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        
        <SegmentedButtons
          value={section}
          onValueChange={setSection}
          style={styles.toggle}
          buttons={[
            { value: 'transfer', label: 'Transfer', icon: 'bank-transfer' },
            { value: 'my_account', label: 'My Account', icon: 'account-card-outline' },
          ]}
        />

        {section === 'transfer' ? (
          <View>
            <GlassCard style={styles.card}>
              <Text style={styles.cardTitle}>Transfer to Account</Text>
              
              <TextInput
                label="Amount"
                value={shapAmount}
                editable={false}
                mode="outlined"
                style={styles.input}
                outlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />

              <List.Accordion
                title={SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry)?.name || "Select Country"}
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
                title={paymentMethod || "Select Payment Method"}
                left={props => <List.Icon {...props} icon="credit-card-outline" color={theme.colors.primary} />}
                expanded={showMethodMenu}
                onPress={() => setShowMethodMenu(!showMethodMenu)}
                style={styles.accordion}
                titleStyle={{ color: theme.colors.onSurface }}
              >
                {['Bank Transfer', 'Mobile Money', 'Debit Card'].map((method) => (
                  <List.Item
                    key={method}
                    title={method}
                    onPress={() => { setPaymentMethod(method); setShowMethodMenu(false); }}
                    titleStyle={{ color: theme.colors.onSurface }}
                  />
                ))}
              </List.Accordion>

              <TextInput
                label="Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />

              <Button 
                mode="contained" 
                onPress={handleTransferSubmit}
                style={styles.submitBtn}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                OK
              </Button>

              {showTransferSuccess && (
                <View style={styles.successBox}>
                  <MaterialCommunityIcons name="check-circle" size={48} color={theme.colors.success} />
                  <Text style={[styles.successText, { color: theme.colors.success }]}>
                    Success! Your payment is being processed. 
                  </Text>
                  <Text style={{ color: theme.colors.onSurface, textAlign: 'center', marginTop: 10 }}>
                    Please check "My Account" to view your Renminbi card balance.
                  </Text>
                </View>
              )}
            </GlassCard>
          </View>
        ) : (
          <View>
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.virtualCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardBrand}>VIRTUAL CARD</Text>
                  <MaterialCommunityIcons name="integrated-circuit-chip" size={40} color="#FFD700" />
                </View>

                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>BALANCE</Text>
                  <Text style={styles.balanceValue}>¥ {rmbBalance}</Text>
                </View>

                <Text style={styles.cardNumber}>4242  8888  1234  5678</Text>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardValue}>SHAPSHAP USER</Text>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>EXPIRES</Text>
                    <Text style={styles.cardValue}>12/28</Text>
                  </View>
                  <TouchableOpacity onPress={() => setCvvVisible(!cvvVisible)}>
                    <Text style={styles.cardLabel}>CVV</Text>
                    <Text style={styles.cardValue}>{cvvVisible ? "123" : "***"}</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            <GlassCard style={[styles.card, { marginTop: 20 }]}>
              <Text style={styles.cardTitle}>Send RENMINBI</Text>
              
              <TextInput
                label="Amount in RMB"
                value={rmbToSend}
                onChangeText={setRmbToSend}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />

              <TextInput
                label="Send to Account Number"
                value={sendToAccount}
                onChangeText={setSendToAccount}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />
              <Button 
                mode="contained" 
                onPress={handlePayRmb}
                style={styles.submitBtn}
                buttonColor={theme.colors.secondary}
                disabled={parseFloat(rmbBalance) <= 0}
              >
                Pay
              </Button>
            </GlassCard>
          </View>
        )}
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
  toggle: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
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
  successBox: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 1.586, 
  },
  virtualCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBrand: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  balanceContainer: {
    marginTop: -10,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 4,
    marginVertical: 10,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginBottom: 2,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
