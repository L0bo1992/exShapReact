import React, { useState } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions, Image } from 'react-native';
import { Text, TextInput, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { searchSuppliers } from '../services/api';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';

export default function SuppliersScreen({ navigation }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  const numColumns = isDesktop ? 3 : (width > 600 ? 2 : 1);

  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchSuppliers(query, minPrice, maxPrice, 'USD');
      const enhancedData = data.map(item => ({
        ...item,
        priceExchanger: item.price + 40,
        priceWithUs: item.price + 10,
      }));
      setResults(enhancedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <GlassCard style={[styles.card, { width: (width / numColumns) - 30 }]}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>{item.name}</Text>
        <Text style={{ color: theme.colors.primary, marginBottom: 10 }}>{item.product}</Text>
        
        <Text style={[styles.originalPrice, { color: theme.colors.placeholder }]}>
            Original: {item.currency} {item.price}
        </Text>
        
        <View style={[styles.priceBox, { borderColor: theme.colors.error }]}>
             <Text style={{color: theme.colors.error, fontSize: 12}}>
                Through Exchanger: <Text style={{fontWeight: 'bold', fontSize: 16}}>${item.priceExchanger}</Text>
            </Text>
        </View>

        <View style={[styles.priceBox, { borderColor: theme.colors.success, backgroundColor: 'rgba(0, 230, 118, 0.05)' }]}>
             <Text style={{color: theme.colors.success, fontSize: 12}}>
                With exShap: <Text style={{fontWeight: 'bold', fontSize: 16}}>${item.priceWithUs}</Text>
            </Text>
            <Text style={{color: theme.colors.placeholder, fontSize: 10, marginTop: 4}}>*for 1 year membership</Text>
        </View>

        <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Proforma', { supplier: item })}
            style={styles.actionBtn}
            buttonColor={theme.colors.secondary}
        >
            Get Proforma
        </Button>
      </View>
    </GlassCard>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={[styles.searchSection, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            label="Product Name"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            mode="outlined"
            textColor={theme.colors.text}
            theme={{ colors: { background: theme.colors.background } }}
          />
          <View style={styles.row}>
               <TextInput
                label="Min Price"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                style={[styles.input, {flex: 1}]}
                mode="outlined"
                textColor={theme.colors.text}
                theme={{ colors: { background: theme.colors.background } }}
              />
               <TextInput
                label="Max Price"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                style={[styles.input, {flex: 1}]}
                mode="outlined"
                textColor={theme.colors.text}
                theme={{ colors: { background: theme.colors.background } }}
              />
          </View>
          <Button 
            mode="contained" 
            onPress={handleSearch} 
            loading={loading} 
            style={styles.searchButton}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
              Search Suppliers
          </Button>
        </View>

        {loading ? (
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} style={{marginTop: 50}} />
        ) : (
          <FlatList
            key={numColumns}
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={searched ? <Text style={{textAlign: 'center', marginTop: 20, color: theme.colors.placeholder}}>No results found.</Text> : null}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  searchSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  input: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  searchButton: {
    marginTop: 5,
    paddingVertical: 6,
  },
  listContent: {
    paddingBottom: 20,
    alignItems: 'center', // Center cards in column
  },
  card: {
    margin: 15,
    padding: 0, // Reset padding for image
    overflow: 'hidden',
  },
  cardImage: {
      width: '100%',
      height: 140,
      backgroundColor: '#333'
  },
  cardContent: {
      padding: 15,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  originalPrice: {
      fontSize: 14,
      marginBottom: 10,
  },
  priceBox: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      borderStyle: 'dashed'
  },
  actionBtn: {
      marginTop: 5,
  }
});