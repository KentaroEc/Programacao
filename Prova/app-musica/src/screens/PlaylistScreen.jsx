import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { List, FAB } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getPlaylists, deletePlaylist } from '../services/storage.js';

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

  return (
    <View style={{ flex: 1 }}>
      {playlists.map(p => (
        <List.Item
          key={p.id}
          title={p.nome}
          description={p.descricao}
          left={props => <List.Icon {...props} icon="playlist-music" />}
          right={props => (
            <>
              <List.Icon {...props} icon="pencil" onPress={() => navigation.navigate('EditarPlaylist', { id: p.id })} />
              <List.Icon {...props} icon="delete" onPress={() => confirmarExclusao(p.id)} />
            </>
          )}
        />
      ))}

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('CriarPlaylist')}
      />
    </View>
  );
}
