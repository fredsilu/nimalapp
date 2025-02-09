import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Client } from '../types/types';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../datas/api';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ModifClientScreen'>;
};


const ModifClientScreen: React.FC<Props> = ({ navigation }) => {
  type ModifClientScreenRouteProp = RouteProp<RootStackParamList, 'ModifClientScreen'>;
  const route = useRoute<ModifClientScreenRouteProp>();
  const { client } = route.params;
  const [leClient, setLeClient] = useState<Client>(client);
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log('Client details:', leClient.telephone1);
  const handleSave = () => {
    if (!leClient.nom || !leClient.postnom || !leClient.prenom || !leClient.dateNaissance || !leClient.sexe || !leClient.telephone1 || !leClient.adresse || !leClient.numeroCompte) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    // Logic to save the modified client details
    api.updateClient(leClient)
      .then(() => {
        Alert.alert('Client details saved successfully!');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Failed to save client details', error.message);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Modify Client</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={leClient.nom}
        onChangeText={(text) => setLeClient({ ...leClient, nom: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Postnom"
        value={leClient.postnom}
        onChangeText={(text) => setLeClient({ ...leClient, postnom: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={leClient.prenom}
        onChangeText={(text) => setLeClient({ ...leClient, prenom: text })}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{leClient.dateNaissance || "Date de Naissance"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(leClient.dateNaissance || Date.now())}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || leClient.dateNaissance;
            setShowDatePicker(false);
            if (currentDate) {
              setLeClient({ ...leClient, dateNaissance: (currentDate as Date).toISOString().split('T')[0] });
            }
          }}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Sexe"
        value={leClient.sexe}
        onChangeText={(text) => setLeClient({ ...leClient, sexe: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone 1"
        value={leClient.telephone1.toString()}
        onChangeText={(text) => setLeClient({ ...leClient, telephone1: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone 2"
        value={(leClient.telephone2 ?? '').toString()}
        onChangeText={(text) => setLeClient({ ...leClient, telephone2: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse"
        value={leClient.adresse}
        onChangeText={(text) => setLeClient({ ...leClient, adresse: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de Compte"
        value={leClient.numeroCompte.toString()}
        onChangeText={(text) => setLeClient({ ...leClient, numeroCompte: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom du Mandataire"
        value={leClient.nomMandataire}
        onChangeText={(text) => setLeClient({ ...leClient, nomMandataire: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse du Mandataire"
        value={leClient.adresseMandataire}
        onChangeText={(text) => setLeClient({ ...leClient, adresseMandataire: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone du Mandataire"
        value={(leClient.telephoneMandataire ?? '').toString()}
        onChangeText={(text) => setLeClient({ ...leClient, telephoneMandataire: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de Carte"
        value={(leClient.numeroCarte ?? '').toString()}
        onChangeText={(text) => setLeClient({ ...leClient, numeroCarte: text })}
      />

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ModifClientScreen;