import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import api from '../datas/api';
import { Operation, CalculSoldesParams, RootStackParamList, Client } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate, formatDateLong, formaterDateSelonLocale } from '../datas/helps';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'AddOperation'>;
};

const AddOperationScreen: React.FC<Props> = ({ navigation }) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [operationDatas, setOperationDatas] = useState<Operation>({
        id: 0,
        clientId: '',
        dateOP: formatDateLong(new Date()),
        soldePrec: 0,
        typeOP: 'depot',
        montant: 0,
        commission: 0,
        soldeFinal: 0,
    });
    const [soldeFinal, setSoldeFinal] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [valuM, setValuM] = useState<string>("");
    const [valuCom, setValuCom] = useState<string>("");
    const [dateOp, setDateOp] = useState<Date>(new Date());
    

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.fetchClients();
                setClients(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients', error);
            }
        };
        fetchClients();
    }, []);

    const calculSoldes = ({ clientId, soldePrec, commission, montant, typeOP }: CalculSoldesParams): void => {
        montant = montant.replace(/[^0-9.]/g, "");
        commission = commission.replace(/[^0-9.]/g, "");

        const montantNum = Number(montant);
        const commissionNum = Number(commission);
        const soldePrecNum = Number(soldePrec);

        let sum = soldePrecNum;
        if (typeOP === 'depot') {
            sum += montantNum - (montantNum * commissionNum / 100);
        } else if (typeOP === 'retrait') {
            sum -= montantNum + (montantNum * commissionNum / 100);
            if(sum < 0){
                Alert.alert('Erreur', 'Solde insuffisant pour effectuer cette opération');
                return;
            }   
        }

        setSoldeFinal(sum);
        setValuM(montant);
        setValuCom(commission);
        setOperationDatas({ ...operationDatas, clientId, soldePrec: soldePrecNum, commission: commissionNum, soldeFinal: sum, montant: montantNum, typeOP });
    };

    const handleAddOperation = async () => {
        if (operationDatas.clientId === '' || operationDatas.montant === 0) {
            Alert.alert('Erreur', 'Veuillez remplir les champs client et montant');
            return;
        }
        try {
            const { id, ...operationWithoutId } = operationDatas;
            //console.log(operationWithoutId);
            
            await api.createOperation(operationWithoutId);
            Alert.alert('Succès', 'Opération ajoutée avec succès');
            navigation.goBack(); // Retour à la page précédente
            
            
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'opération');
        }
    };

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const updateInfos = (clientId: string) => {
        const fetchSoldePrecedent = async (clientId: string) => {
            setLoading(true);
            try {
                const response = await api.fetchSoldePrecedent(clientId);
                if (response.length > 0) {
                    const soldePrec = response[0].soldeFinal;
                    calculSoldes({ clientId, soldePrec, typeOP: operationDatas.typeOP, montant: operationDatas.montant.toString(), commission: operationDatas.commission.toString() });
                } else {
                    Alert.alert("Erreur", "Aucun solde précédent trouvé pour ce client !");
                    const soldePrec =0;
                    calculSoldes({ clientId, soldePrec , typeOP: operationDatas.typeOP, montant: operationDatas.montant.toString(), commission: operationDatas.commission.toString() });
               
                }
            } catch (error) {
                Alert.alert("Erreur", "Erreur lors de la récupération du solde précédent !");
                console.error('Erreur lors de la récupération du solde précédent', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSoldePrecedent(clientId);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter une Opération</Text>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={30} color="#841584" />
                    <Text style={[styles.input, { color: '#841584' }]}>Choisir le client:</Text>
                </View>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={operationDatas.clientId}
                        style={styles.picker}
                        onValueChange={updateInfos}
                    >
                        <Picker.Item label="Sélectionnez un client" value="" />
                        {clients.map((client) => (
                            <Picker.Item key={client.id} label={client.nom} value={client.id} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="calendar" size={24} color="black" />
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.input}>
                        {formatDate(dateOp)}
                        </Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                        <DateTimePicker
                            value={dateOp}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setIsDatePickerVisible(false);
                                if (selectedDate) {
                                    const currentDate=formatDateLong(selectedDate);
                                    setOperationDatas({ ...operationDatas, dateOP: currentDate});
                                    setDateOp(selectedDate);
                                    //console.log(currentDate, selectedDate);
                                }else{
                                    setDateOp(new Date());
                                }
                            }}
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
                            calculSoldes({ clientId: operationDatas.clientId, soldePrec: operationDatas.soldePrec, typeOP: itemValue, montant: operationDatas.montant.toString(), commission: operationDatas.commission.toString() });
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
                        inputMode="decimal"
                        value={valuM}
                        onChangeText={(text) => calculSoldes({ clientId: operationDatas.clientId, soldePrec: operationDatas.soldePrec, montant: text, commission: operationDatas.commission.toString(), typeOP: operationDatas.typeOP })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome name="dollar" size={24} color="black" />
                    <TextInput
                        style={styles.input}
                        placeholder="Commission"
                        keyboardType="numeric"
                        inputMode="decimal"
                        value={valuCom}
                        onChangeText={(text) => {
                            calculSoldes({ clientId: operationDatas.clientId, soldePrec: operationDatas.soldePrec, commission: text, montant: operationDatas.montant.toString(), typeOP: operationDatas.typeOP });
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
    picker: {
        height: 70,
        width: '100%',
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
        marginBottom: 20,
        
    },
    input: {
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        fontSize: 20,
        color: '#841584',
        
    },
    buttonStyle: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        fontSize: 18,
    },
    pickerContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default AddOperationScreen;
