import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { List, FAB, Text } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getPlaylists, deletePlaylist } from '../services/storage.js';

const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function PlaylistScreen({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const isFocused = useIsFocused();

  const carregar = async () => {
    const dados = await getPlaylists();
    setPlaylists(dados);
    console.log("Playlists carregadas:", dados);
  };

  useEffect(() => {
    if (isFocused) carregar();
  }, [isFocused]);

  const confirmarExclusao = (id) => {
    Alert.alert('Excluir Playlist', 'Deseja mesmo excluir?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir', onPress: async () => {
          await deletePlaylist(id);
          carregar();
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={item.descricao}
      titleStyle={{ color: textColor }}
      descriptionStyle={{ color: '#ccc' }}
      style={{ backgroundColor: cardColor }}
      left={props => <List.Icon {...props} icon="playlist-music" color={primaryColor} />}
      right={props => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('EditarPlaylist', { id: item.id })}>
            <List.Icon {...props} icon="pencil" color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
            <List.Icon {...props} icon="delete" color="#ff5555" />
          </TouchableOpacity>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      {playlists.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma playlist criada ainda.</Text>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CriarPlaylist')}
        color="#fff"
        customSize={56}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: primaryColor,
  },
});
