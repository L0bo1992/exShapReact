import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions, Image } from 'react-native';
import { Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { getOpportunities } from '../services/api';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';

export default function OpportunitiesScreen({ navigation }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getOpportunities().then(data => {
          setOpportunities(data);
          setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <GlassCard style={styles.card}>
        <View style={[styles.cardRow, isDesktop ? {} : {flexDirection: 'column'}]}>
             <View style={[styles.imageContainer, isDesktop ? {width: '30%'} : {width: '100%', height: 200}]}>
                 <Image source={{ uri: item.image }} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
                 <View style={styles.overlay} />
             </View>
             <View style={[styles.contentContainer, isDesktop ? {width: '70%'} : {width: '100%'}]}>
                 <View style={{flex: 1}}>
                    <Text style={[styles.itemTitle, {color: theme.colors.primary}]}>{item.title}</Text>
                    <Text style={[styles.itemDesc, {color: theme.colors.onSurface}]}>{item.description}</Text>
                 </View>
                 <View style={styles.actionRow}>
                     <Text style={{color: theme.colors.placeholder, fontStyle: 'italic'}}>Exclusive to members</Text>
                     <Button 
                        mode="contained" 
                        onPress={() => alert("This opportunity is coming soon!")}
                        buttonColor={theme.colors.secondary}
                        textColor={theme.colors.onPrimary}
                     >
                         Unlock Opportunity
                     </Button>
                 </View>
             </View>
        </View>
    </GlassCard>
  );

  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.pageTitle, {color: theme.colors.primary}]}>Market Opportunities</Text>
                <Text style={[styles.pageSubtitle, {color: theme.colors.placeholder}]}>
                    Curated high-value insights and supply chain gaps ready for disruption.
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator animating={true} size="large" color={theme.colors.primary} style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={opportunities}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            )}
        </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
      marginBottom: 30,
      marginTop: 10,
  },
  pageTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  pageSubtitle: {
      fontSize: 16,
  },
  card: {
      marginBottom: 20,
      padding: 0, 
      overflow: 'hidden'
  },
  cardRow: {
      flexDirection: 'row',
      minHeight: 180,
  },
  imageContainer: {
      position: 'relative',
      backgroundColor: '#000'
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)'
  },
  contentContainer: {
      padding: 20,
      justifyContent: 'space-between'
  },
  itemTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  itemDesc: {
      fontSize: 16,
      lineHeight: 24,
  },
  actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20
  }
});