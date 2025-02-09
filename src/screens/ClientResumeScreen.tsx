import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Client } from '../types/types';
import api from '../datas/api';


const ClientResumeScreen = () => {
    type ClientDetailScreenRouteProp = RouteProp<RootStackParamList, 'ClientResumeScreen'>;
    const route = useRoute<ClientDetailScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();    
    const { clientId } = route.params;
    console.log(route.params);
    const [client, setClient] = useState<Client>();

    useEffect(() => {
        const fetchClient = async () => {
            const clientData = await api.fetchClientById(clientId);
            setClient(clientData);
        };

        fetchClient();
    }, [clientId]);

    return (
        <ScrollView>
            <View style={styles.container}>
            {client ? (
                <>
                <Text style={styles.title}>Client Details</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>ID:</Text>
                    <Text style={styles.value}>{client.id}</Text>

                    <Text style={styles.label}>Numéro de Compte:</Text>
                    <Text style={styles.value}>{client.numeroCompte}</Text>

                    <Text style={styles.label}>Nom:</Text>
                    <Text style={styles.value}>{client.nom}</Text>

                    <Text style={styles.label}>Postnom:</Text>
                    <Text style={styles.value}>{client.postnom}</Text>

                    <Text style={styles.label}>Prénom:</Text>
                    <Text style={styles.value}>{client.prenom}</Text>

                    <Text style={styles.label}>Date de Naissance:</Text>
                    <Text style={styles.value}>{client.dateNaissance}</Text>

                    <Text style={styles.label}>Sexe:</Text>
                    <Text style={styles.value}>{client.sexe}</Text>

                    <Text style={styles.label}>Téléphone 1:</Text>
                    <Text style={styles.value}>{client.telephone1}</Text>

                    <Text style={styles.label}>Téléphone 2:</Text>
                    <Text style={styles.value}>{client.telephone2}</Text>

                    <Text style={styles.label}>Adresse:</Text>
                    <Text style={styles.value}>{client.adresse}</Text>

                    <Text style={styles.label}>Nom Mandataire:</Text>
                    <Text style={styles.value}>{client.nomMandataire}</Text>

                    <Text style={styles.label}>Adresse Mandataire:</Text>
                    <Text style={styles.value}>{client.adresseMandataire}</Text>

                    <Text style={styles.label}>Téléphone Mandataire:</Text>
                    <Text style={styles.value}>{client.telephoneMandataire}</Text>

                    <Text style={styles.label}>Numéro Carte:</Text>
                    <Text style={styles.value}>{client.numeroCarte}</Text>
                </View>
                <Button
                    title="Modifier Client"
                    onPress={() => navigation.navigate('ModifClientScreen', { client: client })}
                />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: '#555',
    },
    value: {
        fontSize: 18,
        marginTop: 5,
        color: '#777',
    },
});

export default ClientResumeScreen;