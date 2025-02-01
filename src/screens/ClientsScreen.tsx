import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { Client } from '../types/types';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import api from '../datas/api';


const ClientsScreen = () => {


    const [clients, setClients] = useState<Client[]>([]);
    const fetchClients = async () => {
        try {
            const response = await api.fetchClients();
            setClients(response);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };
    
    useEffect(() => {
        fetchClients();
    }, []);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    const renderItem = ({ item }: { item: Client }) => (
        <View style={styles.item}>
            <Text>{item.nom} {item.prenom}</Text>
            <Text>Compte : {item.numeroCompte}</Text>
            <Text>Téléphone : {item.telephone1}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={clients}
                renderItem={renderItem}
                keyExtractor={item => item.numeroCompte}
            />
            <Button title="Ajouter un client" onPress={() => navigation.navigate('AddClient')} />
            <Button title="Voir les opérations" onPress={() => navigation.navigate('Operations')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});

export default ClientsScreen;