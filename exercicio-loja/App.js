import * as React from 'react';
import { NavigationContainer, DefaultTheme as NavTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme as PaperTheme } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';
import ListaProdutosScreen from './screens/ListaProdutosScreen';
import ProdutoScreen from './screens/ProdutoScreen';

const Stack = createStackNavigator();

const CombinedTheme = {
  ...NavTheme,
  colors: {
    ...NavTheme.colors,
    ...PaperTheme.colors,
    primary: '#6200ee',
    background: '#f5f5f5',
    text: '#000000',
  },
};

export default function App() {
  return (
    <PaperProvider theme={PaperTheme}>
      <NavigationContainer theme={CombinedTheme}>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Categorias' }} />
          <Stack.Screen name="Produtos" component={ListaProdutosScreen} options={{ title: 'Produtos' }} />
          <Stack.Screen name="Detalhes" component={ProdutoScreen} options={{ title: 'Detalhes do Produto' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
