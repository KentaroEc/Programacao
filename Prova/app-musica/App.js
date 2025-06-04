import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// TELAS
import HomeScreen from './src/screens/HomeScreen.jsx';
import PlaylistScreen from './src/screens/PlaylistScreen.jsx';
import PlayerScreen from './src/screens/PlayerScreen.jsx';
import ProfileScreen from './src/screens/ProfileScreen.jsx';
import AboutScreen from './src/screens/AboutScreen.jsx';
import CreatePlaylistScreen from './src/screens/CreatePlaylistScreen.jsx';
import EditPlaylistScreen from './src/screens/EditPlaylistScreen.jsx';
import StatisticsScreen from './src/screens/StatisticsScreen.jsx';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Biblioteca" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="music" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="Playlists" component={PlaylistScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="playlist-music" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="Player" component={PlayerScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="play-circle" color={color} size={size} />
        )
      }} />
      <Tabs.Screen name="Estatísticas" component={StatisticsScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
        )
      }} />
    </Tabs.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Início" component={TabNavigator} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Sobre" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="CriarPlaylist" component={CreatePlaylistScreen} />
          <Stack.Screen name="EditarPlaylist" component={EditPlaylistScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
