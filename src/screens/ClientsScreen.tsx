import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import { Client } from '../types/types';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import api from '../datas/api';


const ClientsScreen = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);

    useEffect(() => {
        setFilteredClients(
            clients.filter(client =>
                client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (client.postnom?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                (client.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
            )
        );
    }, [searchQuery, clients]);

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

    const handleAddClient = () => {
        navigation.navigate('AddClient', { onGoBack: fetchClients });
    };

    const renderItem = ({ item }: { item: Client }) => (
        <View style={styles.item}>
            <Text>{item.nom} {item.prenom}</Text>
            <Text>Compte : {item.numeroCompte}</Text>
            <Text>Téléphone : {item.telephone1}</Text>
        </View>
    );

    return (
        <><View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un client..."
                    value={searchQuery}
                    onChangeText={setSearchQuery} />
            </View>
            <FlatList
                data={filteredClients}
                renderItem={renderItem}
                keyExtractor={item => item.numeroCompte} />
            <Button title="Ajouter un client" onPress={handleAddClient} />
            <Button title="Voir les opérations" onPress={() => navigation.navigate('Operations')} />
        </View>



        </>
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
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
    }
});

export default ClientsScreen;