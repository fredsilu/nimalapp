export type Client = {
    id : number
    numeroCompte: string;
    nom: string;
    postnom?: string;
    prenom?: string;
    dateNaissance?: string;
    sexe?: string;
    telephone1: string;
    telephone2?: string;
    adresse?: string;
    nomMandataire?: string;
    adresseMandataire?: string;
    telephoneMandataire?: string;
    numeroCarte?: string;
  };
  
  export type Operation = {
    id: number;
    clientId: string;
    dateOP: string;
    soldePrec:  number; 
    typeOP: 'depot' | 'retrait';
    montant: number;  
    commission: number;
    soldeFinal: number;
  };
  
  export type RootStackParamList = {
  Home: undefined;
  Details: { clientId: string };
  Operations: undefined;
  AddOperation: { onGoBack: () => Promise<void> };
  AddClient: { onGoBack: () => Promise<void> };
  EditClient: { clientId: string };
  ModifOperationScreen: { id: number };
}


  export type OperationswithClient ={
    id: number; // id de l'opération
    nom: string;
    postnom?: string;
    prenom?: string;
    telephone1: string;
    typeOP: 'depot' | 'retrait';
    montant: number;
    dateOP: string;
    soldePrec:  number;  
    soldeFinal: number;
    commission: number;
  }


  export type CalculSoldesParams ={
    commission: string;
    montant: string;
    typeOP: 'depot' | 'retrait';
    clientId: string;
    soldePrec: number;
}


