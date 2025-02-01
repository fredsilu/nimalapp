// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ClientsScreen from './src/screens/ClientsScreen';
import OperationsScreen from './src/screens/OperationsScreen';
import AddClientScreen from './src/screens/AddClientScreen';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import ModifOperationScreen from './src/screens/ModifOperationScreen';
import AddOperationScreen from './src/screens/AddOperationScreen';

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
       <Stack.Navigator initialRouteName="Clients">
          <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} />
          <Stack.Screen name="Operations" component={OperationsScreen} options={{ title: 'Opérations' }} />
          <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: 'Ajouter un Client' }} />
          <Stack.Screen name="AddOperation" component={AddOperationScreen} options={{ title: 'Ajouter une opération' }} />
          <Stack.Screen name="ModifOperationScreen" component={ModifOperationScreen} options={{ title: "Modifier l'opération" }} />
        </Stack.Navigator>
   
    </NavigationContainer>
  );

  
}