import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import api from '../datas/api';
import { Operation, CalculSoldesParams, RootStackParamList, Client } from '../types/types';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { formaterDateSelonLocale } from '../datas/helps';

type Props = {
    navigation: AddOperationScreenNavigationProp;
};

type AddOperationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddOperation'>;

const AddOperationScreen: React.FC<Props> = ({ navigation }: { navigation: AddOperationScreenNavigationProp }) => {

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [operationDatas, setOperationDatas] = useState<Operation>({
        id: 0,
        clientId: '',  // modifiable mais mis en place sur base de la BDD
        dateOP: new Date(), // automatique mais peux etre modifiée
        soldePrec: 0, // doit provenir du solde de la transaction précédente
        typeOP: 'depot',
        montant: 0,
        commission: 0,
        soldeFinal: 0, // est calculé automatiquement
    });
    const [soldeFinal, setSoldeFinal] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [valuM, setValuM  ] = useState<string>("");

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.fetchClients();
                setClients(response);
                //console.log('Clients récupérés', response);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients', error);
            }
        };

        fetchClients();
    }, []);

    const calculSoldes = ({ commission, montant, typeOP }: CalculSoldesParams): void => {
        montant = montant.replace(/[^0-9.]/g, "");
        commission = commission.replace(/[^0-9.]/g, "");
        if (typeOP === 'depot') {
            setSoldeFinal(Number(operationDatas.soldePrec) + Number(montant) - (Number(montant) * Number(commission) / 100));
        } else if (typeOP === 'retrait') {
            setSoldeFinal(operationDatas.soldePrec - Number(montant) - (Number(montant) * Number(commission) / 100));
        }
        setValuM(montant.toString());
        setOperationDatas({ ...operationDatas, commission: Number(commission), soldeFinal, montant: Number(montant), typeOP });
    };

    const handleAddOperation = async () => {
        if (operationDatas.clientId === '' || operationDatas.montant === 0) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        try {
            const { id, ...operationWithoutId } = operationDatas;
            await api.createOperation(operationWithoutId);
            Alert.alert('Succès', 'Opération ajoutée avec succès');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'opération');
        }
    };

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const updateInfos = (clientId: string) => {// il faut récupérer le solde précédent du client
        const fetchSoldePrecedent = async (clientId: string) => {
            setLoading(true);
            try {
                const response = await api.fetchSoldePrecedent(clientId);
                const t= (response[0].soldePrec);

                if (response.length > 0) {
                    setOperationDatas({ ...operationDatas, clientId, soldePrec:t });
                } else {
                    Alert.alert("Erreur", "Aucun solde précédent trouvé pour ce client !");
                }
            } catch (error) {
                Alert.alert("Erreur", "Erreur lors de la récupération du solde précédent !");
                console.error('Erreur lors de la récupération du solde précédent', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSoldePrecedent(clientId);
    }

    return (  
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter une Opération</Text>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={24} color="black" />
                    <Picker
                        selectedValue={operationDatas.clientId}
                        style={styles.input}
                        onValueChange={(itemValue) => { updateInfos(itemValue)}}
                    > 
                        <Picker.Item label="Sélectionnez un client" value="" />
                        {clients.map((client) => (
                            <Picker.Item key={client.id} label={client.nom} value={client.id} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="calendar" size={24} color="black" />
                    <TouchableOpacity onPress={() => showDatePicker()} style={styles.buttonStyle}>
                        <Text>{formaterDateSelonLocale(new Date(operationDatas.dateOP))}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                        <DateTimePicker
                            value={new Date(operationDatas.dateOP)}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || operationDatas.dateOP;
                                setIsDatePickerVisible(false);
                                setOperationDatas({ ...operationDatas, dateOP: currentDate });
                            }}
                            textColor="black" // Set text color to black
                        />
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="balance-scale" size={24} color="black" />
                    <Text style={styles.input}>
                        Solde: {operationDatas.soldePrec.toString()}
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="exchange" size={24} color="black" />
                    <Picker
                        selectedValue={operationDatas.typeOP}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            calculSoldes({ typeOP: itemValue, montant: operationDatas.montant.toString(), commission: operationDatas.commission.toString() });
                        }}
                    >
                        <Picker.Item label="Dépôt" value="depot" />
                        <Picker.Item label="Retrait" value="retrait" />
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="dollar" size={24} color="black" />
                    <TextInput
                        style={styles.input}
                        placeholder="Montant"
                        keyboardType="numeric"
                        inputMode="decimal" // Prend en charge les nombres décimaux proprement
                        value={valuM }
                        onChangeText={(text) => calculSoldes({ montant: text, commission: operationDatas.commission.toString(), typeOP: operationDatas.typeOP })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Commission"
                       // keyboardType="default"
                        value={operationDatas.commission.toString()}
                        onChangeText={(text) => {
                            const sanitizedText = text.replace(/[^0-9.,]/g, '').replace(',', '.');
                            calculSoldes({ commission: sanitizedText, montant: operationDatas.montant.toString(), typeOP: operationDatas.typeOP });
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome name="balance-scale" size={24} color="black" />
                    <Text style={styles.input}>Solde final: {soldeFinal.toString()}</Text>
                </View>
            </ScrollView>


            <Button title="Ajouter" onPress={handleAddOperation} color="#841584" />
        </View>

    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        //alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        fontSize: 18,
    },
    buttonStyle: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        fontSize: 18,
    },
});

export default AddOperationScreen;