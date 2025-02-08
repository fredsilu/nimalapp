import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../datas/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Client } from '../types/types';



const AddClientScreen = () => {
  const navigation = useNavigation();
  const [newClient, setNewClient] = useState({
    numeroCompte: '',
    nom: '',
    telephone1: '',
    postnom: '',
    prenom: '',
    dateNaissance: new Date().toISOString().split('T')[0],
    sexe: '',
    telephone2: '',
    adresse: '',
    nomMandataire: '',
    adresseMandataire: '',
    telephoneMandataire: '',
    numeroCarte: '',
  });
  const [loading, setLoading] = useState(false); // Ajout d'un état pour le chargement
  const [showDatePicker, setShowDatePicker] = useState(false); // Ajout d'un état pour afficher le sélecteur de date



  const handleDateChange = (date: Date) => {
    setShowDatePicker(false);
    const validDate = new Date(date);
    if (!isNaN(validDate.getTime())) {
      setNewClient({ ...newClient, dateNaissance: validDate.toISOString().split('T')[0] });
    } else {
      console.error('Invalid date:', date);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.numeroCompte || !newClient.nom || !newClient.telephone1) {
      Alert.alert('Erreur', 'Les champs "Numéro de compte", "Nom" et "Téléphone 1" ne peuvent pas être vides');
      setLoading(false);
      return;
    }

    if (newClient.numeroCompte.length < 3 || newClient.nom.length < 3 || newClient.telephone1.length < 3) {
      Alert.alert('Erreur', 'Les champs "Numéro de compte", "Nom" et "Téléphone 1" doivent contenir au moins 3 caractères');
      setLoading(false);
      return;
    }

    try {
      await api.createClient(newClient);
      Alert.alert('Succès', 'Client ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}> 
    <View style={styles.container}>
      <TextInput
      style={styles.input}
      placeholder="Numéro de compte"
      value={newClient.numeroCompte}
      onChangeText={(text) => setNewClient({ ...newClient, numeroCompte: text.replace(/[^0-9]/g, '') })}
      keyboardType="numeric"
      />
      <TextInput
      style={styles.input}
      placeholder="Nom"
      value={newClient.nom}
      onChangeText={(text) => setNewClient({ ...newClient, nom: text })}
      />
      <TextInput
      style={styles.input}
      placeholder="Téléphone 1"
      value={newClient.telephone1}
      onChangeText={(text) => setNewClient({ ...newClient, telephone1: text.replace(/[^0-9]/g, '') })}
      keyboardType="numeric"
      />
      <TextInput
      style={styles.input}
      placeholder="Postnom"
      value={newClient.postnom}
      onChangeText={(text) => setNewClient({ ...newClient, postnom: text })}
      />
      <TextInput
      style={styles.input}
      placeholder="Prénom"
      value={newClient.prenom}
      onChangeText={(text) => setNewClient({ ...newClient, prenom: text })}
      />
      <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date de naissance"
          value={newClient.dateNaissance}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={newClient.dateNaissance ? new Date(newClient.dateNaissance) : new Date()}
          onChange={(event, date) => handleDateChange(date || new Date())}
          mode="date"
        />
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={newClient.sexe}
          onValueChange={(itemValue) => setNewClient({ ...newClient, sexe: itemValue })}
        >
          <Picker.Item label="Masculin" value="Masculin" />
          <Picker.Item label="Féminin" value="Féminin" />
        </Picker>
      </View>
      <TextInput
      style={styles.input}
      placeholder="Téléphone 2"
      value={newClient.telephone2}
      onChangeText={(text) => setNewClient({ ...newClient, telephone2: text.replace(/[^0-9]/g, '') })}
      keyboardType="numeric"
      />
      <TextInput
      style={styles.input}
      placeholder="Adresse"
      value={newClient.adresse}
      onChangeText={(text) => setNewClient({ ...newClient, adresse: text })} 
      />
      <TextInput
      style={styles.input}
      placeholder="Nom du mandataire"
      value={newClient.nomMandataire}
      onChangeText={(text) => setNewClient({ ...newClient, nomMandataire: text })} 
      />
      <TextInput
      style={styles.input}
      placeholder="Adresse du mandataire"
      value={newClient.adresseMandataire}
      onChangeText={(text) => setNewClient({ ...newClient, adresseMandataire: text })} 
      />
      <TextInput
      style={styles.input}
      placeholder="Téléphone du mandataire"
      value={newClient.telephoneMandataire}
      onChangeText={(text) => setNewClient({ ...newClient, telephoneMandataire: text.replace(/[^0-9]/g, '') })} 
      keyboardType="numeric"
      />
      <TextInput
      style={styles.input}
      placeholder="Numéro de carte"
      value={newClient.numeroCarte}
      onChangeText={(text) => setNewClient({ ...newClient, numeroCarte: text.replace(/[^0-9]/g, '') })} 
      keyboardType="numeric"
      />
      <Button
      title={loading ? "Ajout en cours..." : "Ajouter"} // Afficher un texte de chargement pendant la requête
      onPress={handleAddClient}
      disabled={loading} // Désactiver le bouton pendant le chargement
      />
    
     
    </View>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  scrollContainer: {
    paddingVertical: 20,
    
  },
  datePickerContainer: {
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  // ... other styles
});

export default AddClientScreen;