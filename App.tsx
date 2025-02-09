// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ClientsScreen from './src/screens/ClientsScreen';
import OperationsScreen from './src/screens/OperationsScreen';
import AddClientScreen from './src/screens/AddClientScreen';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import AddOperationScreen from './src/screens/AddOperationScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import ClientResumeScreen from './src/screens/ClientResumeScreen';
import ModifClientScreen from './src/screens/ModifClientScreen';
import DashboardScreen from './src/screens/DashboardScreen';



const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    background: 'white',
    card: 'green',
    text: 'black',
    border: 'gray',
  },
};


export default function App() {

  return (

    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="DashBoard">
        <Stack.Screen name="DashBoard" component={DashboardScreen} options={{ title: 'Tableau de Bord' }} />
        <Stack.Screen name="ClientDetailScreen" component={ClientDetailScreen} options={{ title: 'Détails du client' }} />
        <Stack.Screen name="ClientResumeScreen" component={ClientResumeScreen} options={{ title: 'Résumé du client' }} />
        <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} />
        <Stack.Screen name="Operations" component={OperationsScreen} options={{ title: 'Opérations' }} />
        <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: 'Ajouter un Client' }} />
        <Stack.Screen name="AddOperation" component={AddOperationScreen} options={{ title: 'Ajouter une opération' }} />
        <Stack.Screen name="ModifClientScreen" component={ModifClientScreen} options={{ title: "Modifier le client" }} />

      </Stack.Navigator>
    </NavigationContainer>

  );


}