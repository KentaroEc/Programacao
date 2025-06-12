import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { List, FAB, Text, IconButton } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getPlaylists, deletePlaylist } from '../services/storage.js';

const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function PlaylistScreen({ navigation }) {
  const [playlists, setPlaylists] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const isFocused = useIsFocused();

  const carregar = async () => {
    try {
      setCarregando(true);
      const dados = await getPlaylists();
      setPlaylists(dados);
      console.log("Playlists carregadas:", dados);
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
      Alert.alert("Erro", "Não foi possível carregar as playlists.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (isFocused) carregar();
  }, [isFocused]);

  const confirmarExclusao = (id) => {
    Alert.alert('Excluir Playlist', 'Deseja mesmo excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePlaylist(id);
            carregar();
          } catch (error) {
            Alert.alert('Erro', 'Falha ao excluir playlist.');
          }
        },
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('VerPlaylist', { playlistId: item.id })} style={{ flex: 1 }}>
      <List.Item
        title={item.nome}
        description={item.descricao}
        titleStyle={{ color: textColor }}
        descriptionStyle={{ color: '#ccc' }}
        style={{ backgroundColor: cardColor }}
        left={props => <List.Icon {...props} icon="playlist-music" color={primaryColor} />}
        right={props => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('AddMusicToPlaylist', { playlistId: item.id })}>
              <IconButton icon="music-note-plus" size={24} iconColor={primaryColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditarPlaylist', { id: item.id })}>
              <List.Icon {...props} icon="pencil" color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
              <List.Icon {...props} icon="delete" color="#ff5555" />
            </TouchableOpacity>
          </View>
        )}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {carregando ? (
        <ActivityIndicator animating={true} color={primaryColor} size="large" style={{ marginTop: 50 }} />
      ) : playlists.length === 0 ? (
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
