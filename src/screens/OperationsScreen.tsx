
import React from 'react';
import { View, Text, ScrollView, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList, TextInput, Button } from 'react-native';
import api from '../datas/api';
import { Operation, OperationswithClient, RootStackParamList } from '../types/types';
import { StyleSheet } from 'react-native';
import { formaterDateSelonLocale, formaterNombreSelonLocale } from '../datas/helps';
import { Ionicons } from '@expo/vector-icons'; // Ou votre bibliothèque d'icônes préférée
import { useNavigation, NavigationProp } from '@react-navigation/native';



function OperationsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [operationsClient, setOperationsClient] = useState<OperationswithClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await api.fetchOperations(page);
      const data = response;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setOperations([...operations, ...data]);
        setPage(page + 1);

        fetchClientNames(data);
      } 
    } catch (error) {
      console.error('Error fetching operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const fetchClientNames = async (operations: Operation[]) => {
    const operationsWithClientNames: OperationswithClient[] = [];
    for (const operation of operations) {
      try {
        const clientResponse = await api.fetchClientById(Number(operation.clientId));
        const premierClient = clientResponse || {}; // Si clientResponse est vide, premierClient sera un objet vide
        operationsWithClientNames.push({
          ...operation,
          id: operation.id,
          nom: premierClient.nom,
          postnom: premierClient.postnom,
          prenom: premierClient.prenom,
          telephone1: premierClient.telephone1,
          typeOP: operation.typeOP,
          montant: operation.montant,
          dateOP: operation.dateOP,
          soldePrec: operation.soldePrec,
          soldeFinal: operation.soldeFinal,
          commission: operation.commission,
        });
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    }
    setOperationsClient(operationsWithClientNames);
  };
/*
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await api.fetchOperations();
        const data = response;
        fetchClientNames(data);
      } catch (error) {
        console.error('Error fetching operations:', error);
      }
    };

    fetchOperations();
  }, []); */


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <TextInput
          placeholder="Rechercher..."
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, flex: 1, marginRight: 10 }} />
        <Button title="Filtrer" onPress={() => { }} />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}><Ionicons name="calendar-outline" size={16} color="white" /> Date</Text>
              <Text style={styles.headerText}><Ionicons name="person-outline" size={16} color="white" /> Nom</Text>
              <Text style={styles.headerText}><Ionicons name="person-add-outline" size={16} color="white" /> Prénom</Text>
              <Text style={styles.headerText}><Ionicons name="call-outline" size={16} color="white" /> Téléphone</Text>
              <Text style={styles.headerText}><Ionicons name="cash-outline" size={16} color="white" /> Montant</Text>
              <Text style={styles.headerText}><Ionicons name="wallet-outline" size={16} color="white" /> Solde précédent</Text>
              <Text style={styles.headerText}><Ionicons name="trending-up-outline" size={16} color="white" /> Commission</Text>
              <Text style={styles.headerText}><Ionicons name="card-outline" size={16} color="white" /> Solde final</Text>
            </View>
            <FlatList
              data={operationsClient}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={fetchOperations}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.itemRow, index % 2 === 0 ? styles.itemRowEven : styles.itemRowOdd]}
                  onPress={() => navigation.navigate('ModifOperationScreen', { id: item.id })}
                >
                  <Text style={styles.itemText}>{item.dateOP} </Text>
                  <Text style={styles.itemText}>{item.nom}</Text>
                  <Text style={styles.itemText}>{item.prenom}</Text>
                  <Text style={styles.itemText}>{item.telephone1}</Text>
                  <Text style={styles.itemText}>{formaterNombreSelonLocale(item.montant)} $</Text>
                  <Text style={styles.itemText}>{formaterNombreSelonLocale(item.soldePrec)} $</Text>
                  <Text style={styles.itemText}>{formaterNombreSelonLocale(item.commission)} %</Text>
                  <Text style={styles.itemText}>{formaterNombreSelonLocale(item.soldeFinal)} $</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      </View>

      <Button title="Ajouter une opération" onPress={() => navigation.navigate('AddOperation')} />
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1, // Important pour le ScrollView horizontal
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#2196F3', // Changed color
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    width: 150,
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginRight: 10,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    width: 150,
    color: '#333',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginRight: 10,
    flexShrink: 2,
  },
  itemRowOdd: {
    backgroundColor: '#FFCDD2', // Changed color
  },
  itemRowEven: {
    backgroundColor: '#BBDEFB', // Changed color
  },
});



export default OperationsScreen;