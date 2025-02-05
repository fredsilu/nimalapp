
import axios from 'axios';
import { Alert } from 'react-native';
import { Client, Operation } from '../types/types';


const API_BASE_URL = 'http://192.168.1.64/nimale/api/'; // URL de votre API


const api = {
  fetchClients:
  async (): Promise<Client[]> => {
    try {
      const response = await axios.get<Client[]>(API_BASE_URL + 'clients');
      return response.data;
    } catch (error) {
        console.log(error);
      console.error("Erreur fetchClients:");
      Alert.alert("Erreur de chargement");
      throw error;
    }
  },
  
   
  fetchClientById: async (id: number): Promise<Client> => {
    try {
      const response = await axios.get<Client>(API_BASE_URL + `clients/${id}`);
     
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
  },
 
  createClient: async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    try {
      const response = await axios.post<Client>(API_BASE_URL + 'clients', clientData);
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
  },
  updateClient: async (clientData: Client): Promise<Client> => {
    try {
      const response = await axios.put<Client>(API_BASE_URL + `clients/${clientData.id}`, clientData);
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
  },
  deleteClient: async (id: string): Promise<void> => {
    try {
      await axios.delete(API_BASE_URL + `clients/${id}`);
    } catch (error) {
        console.log(error);
      throw error;
    }
  },

  fetchOperations: async (page:number): Promise<Operation[]> => {
    try {
      const response = await axios.get<Operation[]>(API_BASE_URL + `operations?page=${page}&limit=100`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  fetchOperationsByClientId: async (clientId: number): Promise<Operation[]> => {
    try {
      const response = await axios.get<Operation[]>(API_BASE_URL + `operations/client/${clientId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  fetchOperationDetails: async (id: number): Promise<Operation> => {
    try {
      const response = await axios.get<Operation>(API_BASE_URL + `operations/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  fetchSoldePrecedent: async (soldClientID: string): Promise<{ soldePrec: number }> => {
    try {
      const response = await axios.get<{ soldePrec: number }>(API_BASE_URL + `operations/soldeclient/${soldClientID}`);
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
  },  

  //on omet le id car le id de l'opération doit être créée par la base de données
  createOperation: async (operationData: Omit<Operation, 'id'>): Promise<Operation> => {
    try {
      /*
    INSERT INTO operations (clientId, typeOP, montant, dateOP, soldePrec,commission,soldeFinal)
    VALUES (2, "depot", 200000, "2025-02-20T11:00:00.000Z", 0,0,200000);
    */
      const response = await axios.post<Operation>(API_BASE_URL + 'operations', operationData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateOperation: async (operationData: Operation): Promise<Operation> => {
    try {
      const response = await axios.put<Operation>(API_BASE_URL + `operations/${operationData.id}`, operationData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteOperation: async (operationId: string): Promise<void> => {
    try {
      await axios.delete(API_BASE_URL + `operations/${operationId}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }





}
export default api;