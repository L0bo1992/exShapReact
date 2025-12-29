import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    exchange: 'Exchange',
    proforma: 'Proforma',
    opportunities: 'Opportunities',
    account: 'Account',
    proceed: 'Proceed',
    bankRate: 'Bank Rate (Official)',
    blackMarketRate: 'Black Market Rate',
    shapShapFees: 'ShapShap Fees',
    ourFee: 'Our Fee',
    networkFee: 'Network Fee',
    totalPay: 'Total Pay',
    youGet: 'You get',
    youSave: 'You Save',
    rateLock: 'Rate Lock',
    locked: 'Locked',
    lockRate: 'Lock Rate',
    goPremium: 'Go Premium',
    standard: 'Standard',
    getRenminbi: 'Get RENMINBI',
    transfer: 'Transfer',
    myAccount: 'My Account',
    bankTransfer: 'Bank Transfer',
    mobileMoney: 'Mobile Money',
    debitCard: 'Debit Card',
    accountNumber: 'Account Number',
    ok: 'OK',
    sendRenminbi: 'Send RENMINBI',
    amountRmb: 'Amount in RMB',
    sendToAccount: 'Send to Account Number',
    pay: 'Pay',
    insufficient: 'Insufficient balance.',
    success: 'Success! Your payment is being processed.',
    checkAccount: 'Please check "My Account" to view your Renminbi card balance.',
    fastReliable: 'Fast and Reliable!',
    anxietyReduce: 'ShapShap is designed to reduce the anxiety of cross-border trade.',
    premiumLock: 'Premium Lock (60s)',
    standardLock: 'Standard Lock (15s)',
    guaranteed: 'active. Guaranteed rate for this transaction.',
    amountIn: 'Amount in',
    liveAiCalculator: 'Live AI Rate Calculator',
    selectCountry: 'Select Country',
    selectPayment: 'Select Payment Method',
    enterValid: 'Please enter a valid recipient account and amount.',
    processedSuccess: 'processed successfully!'
  },
  fr: {
    exchange: 'Échange',
    proforma: 'Proforma',
    opportunities: 'Opportunités',
    account: 'Compte',
    proceed: 'Continuer',
    bankRate: 'Taux Bancaire (Officiel)',
    blackMarketRate: 'Taux du Marché Noir',
    shapShapFees: 'Frais ShapShap',
    ourFee: 'Nos Frais',
    networkFee: 'Frais de Réseau',
    totalPay: 'Total à Payer',
    youGet: 'Vous recevez',
    youSave: 'Vous économisez',
    rateLock: 'Bloquer le Taux',
    locked: 'Bloqué',
    lockRate: 'Bloquer',
    goPremium: 'Passer en Premium',
    standard: 'Standard',
    getRenminbi: 'Obtenir des RENMINBI',
    transfer: 'Transfert',
    myAccount: 'Mon Compte',
    bankTransfer: 'Virement Bancaire',
    mobileMoney: 'Mobile Money',
    debitCard: 'Carte Bancaire',
    accountNumber: 'Numéro de Compte',
    ok: 'Valider',
    sendRenminbi: 'Envoyer des RENMINBI',
    amountRmb: 'Montant en RMB',
    sendToAccount: 'Envoyer au Numéro de Compte',
    pay: 'Payer',
    insufficient: 'Solde insuffisant.',
    success: 'Succès ! Votre paiement est en cours de traitement.',
    checkAccount: 'Veuillez vérifier "Mon Compte" pour voir votre solde en Renminbi.',
    fastReliable: 'Rapide et Fiable !',
    anxietyReduce: 'ShapShap est conçu pour réduire l\'anxiété du commerce transfrontalier.',
    premiumLock: 'Blocage Premium (60s)',
    standardLock: 'Blocage Standard (15s)',
    guaranteed: 'activé. Taux garanti pour cette transaction.',
    amountIn: 'Montant en',
    liveAiCalculator: 'Calculateur de Taux IA en Direct',
    selectCountry: 'Choisir le Pays',
    selectPayment: 'Choisir le Mode de Paiement',
    enterValid: 'Veuillez saisir un compte destinataire et un montant valides.',
    processedSuccess: 'traité avec succès !'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
