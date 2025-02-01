import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';


const ModifOperationScreen = () => {
    type ModifOperationScreenRouteProp = RouteProp<RootStackParamList, 'ModifOperationScreen'>;
    const route = useRoute<ModifOperationScreenRouteProp>();
    const { id } = route.params;

    const [commission, setCommission] = useState(0);
    const [montant, setMontant] = useState(0);

    const calculateSoldeFinal = () => {
        const commissionAmount = (commission / 100) * montant;
        
        return commissionAmount;
    };


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Modifier l'opération {id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ModifOperationScreen;