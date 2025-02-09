import React, { useState,useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Operation, OperationswithClient, RootStackParamList } from '../types/types';
import api from '../datas/api';


const transactions = [
    { id: '1', description: 'Transaction 1', amount: 100 },
    { id: '2', description: 'Transaction 2', amount: 200 },
    // Ajoutez plus de transactions ici
];

const DashboardScreen: React.FC = () => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [operationsClient, setOperationsClient] = useState<OperationswithClient[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [today, setToday] = useState(true);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    const fetchOperations = async () => {
        //console.log('fetchOperations', searchText, filter);
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await api.fetchTodayOperations(today, page);
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

    useEffect(() => {
        fetchOperations();
    }, []);

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


    const renderTransaction = ({ item }: { item: OperationswithClient }) => (
        <View style={styles.transactionItem}>
            <Text>{item.nom}</Text>
            <Text>{item.prenom} </Text>
            <Text>{item.soldeFinal} $</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions d'aujourd'hui</Text>
            <FlatList
                data={operationsClient}
                renderItem={renderTransaction}
                keyExtractor={item => item.id.toString()}
            />
            <Text style={styles.title}>Graphique des transactions</Text>
            <LineChart
                data={{
                    labels: operationsClient.map(t => t.id.toString()),
                    datasets: [
                        {
                            data: operationsClient.map(t => t.soldeFinal),
                        },
                    ],
                }}
                width={300}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
            <Button title="Clients" onPress={() => navigation.navigate('Clients')} />
          
        <Text style={styles.title}>5 Dernières Opérations de Dépôt</Text>
        <FlatList
            data={operationsClient.filter(op => op.typeOP === 'depot').slice(0, 5)}
            renderItem={renderTransaction}
            keyExtractor={item => item.id.toString()}
        />
        <Text style={styles.title}>Graphique des 5 Dernières Opérations de Dépôt</Text>
        <LineChart
            data={{
                labels: operationsClient
                    .filter(op => op.typeOP === 'depot')
                    .slice(0, 5)
                    .map(t => t.id.toString()),
                datasets: [
                    {
                        data: operationsClient
                            .filter(op => op.typeOP === 'depot')
                            .slice(0, 5)
                            .map(t => t.soldeFinal),
                    },
                ],
            }}
            width={300}
            height={220}
            chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />
  <Button title="Opérations" onPress={() => navigation.navigate('Operations')} />
        <Text style={styles.title}>5 Dernières Opérations de Retrait</Text>
        <FlatList
            data={operationsClient.filter(op => op.typeOP === 'retrait').slice(0, 5)}
            renderItem={renderTransaction}
            keyExtractor={item => item.id.toString()}
        />
        <Text style={styles.title}>Graphique des 5 Dernières Opérations de Retrait</Text>
        <LineChart
            data={{
                labels: operationsClient
                    .filter(op => op.typeOP === 'retrait')
                    .slice(0, 5)
                    .map(t => t.id.toString()),
                datasets: [
                    {
                        data: operationsClient
                            .filter(op => op.typeOP === 'retrait')
                            .slice(0, 5)
                            .map(t => t.soldeFinal),
                    },
                ],
            }}
            width={300}
            height={220}
            chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />



          




            <Button title="Créer un nouveau client" onPress={() => navigation.navigate('AddClient', { onGoBack: async () => { } })} />
            
            
            
            
            <Button title="Créer une nouvelle opération" onPress={() => navigation.navigate('AddOperation', { onGoBack: async () => { } })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default DashboardScreen;