import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { List, Checkbox, Button, Text } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { getPlaylists, updatePlaylist } from '../services/storage';

const backgroundColor = '#1a0822';
const primaryColor = '#912db5';
const cardColor = '#2b1b37';

export default function AddMusicToPlaylistScreen({ route, navigation }) {
  const { playlistId } = route.params;
  const [musicas, setMusicas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    const carregarMusicas = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada para acessar músicas.');
        return;
      }

      const resultado = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000,
        sortBy: [MediaLibrary.SortBy.default],
      });

      const extensoesAceitas = ['.mp3'];
      const filtradas = resultado.assets.filter(item =>
        extensoesAceitas.some(ext => item.filename.toLowerCase().endsWith(ext))
      );

      setMusicas(filtradas);
    };

    carregarMusicas();
  }, []);

  const toggleSelecionada = (musica) => {
    const existe = selecionadas.some(m => m.id === musica.id);
    if (existe) {
      setSelecionadas(selecionadas.filter(m => m.id !== musica.id));
    } else {
      setSelecionadas([...selecionadas, {
        id: musica.id,
        nome: musica.filename,
        uri: musica.uri
      }]);
    }
  };

  const salvarNaPlaylist = async () => {
    if (selecionadas.length === 0) {
      Alert.alert('Selecione ao menos uma música.');
      return;
    }

    const playlists = await getPlaylists();
    const playlistAtual = playlists.find(p => p.id === playlistId);

    if (!playlistAtual) {
      Alert.alert('Playlist não encontrada.');
      return;
    }

    const musicasExistentes = playlistAtual.musicas || [];

    const novasMusicas = selecionadas.filter(
      nova => !musicasExistentes.some(m => m.id === nova.id)
    );

    const atualizada = {
      ...playlistAtual,
      musicas: [...musicasExistentes, ...novasMusicas]
    };

    await updatePlaylist(playlistId, atualizada);
    Alert.alert('Músicas adicionadas com sucesso!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar músicas à playlist</Text>
      <FlatList
        data={musicas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.filename}
            style={styles.item}
            titleStyle={{ color: '#fff' }}
            left={() => (
              <Checkbox
                status={selecionadas.some(m => m.id === item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleSelecionada(item)}
                color={primaryColor}
              />
            )}
          />
        )}
      />
      <Button
        mode="contained"
        onPress={salvarNaPlaylist}
        buttonColor={primaryColor}
        style={{ margin: 16 }}
      >
        Salvar músicas na playlist
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingTop: 20,
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    backgroundColor: cardColor,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});
