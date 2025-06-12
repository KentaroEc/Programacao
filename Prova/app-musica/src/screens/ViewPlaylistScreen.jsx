import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, List, IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';
import { getPlaylists, updatePlaylist } from '../services/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const primaryColor = '#912db5';

export default function ViewPlaylistScreen({ route }) {
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState(null);
  const [tocando, setTocando] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef(new Audio.Sound());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const carregarPlaylist = async () => {
      try {
        const todas = await getPlaylists();
        const selecionada = todas.find(p => p.id === playlistId);
        if (!selecionada) {
          Alert.alert('Erro', 'Playlist não encontrada.');
          return;
        }
        setPlaylist(selecionada);
      } catch (error) {
        console.error('Erro ao carregar playlist:', error);
        Alert.alert('Erro', 'Falha ao carregar a playlist.');
      }
    };

    carregarPlaylist();
    return () => {
      sound.current.unloadAsync().catch(() => {});
    };
  }, []);

  const tocarMusica = async (musica) => {
    try {
      if (tocando?.id === musica.id) return;
      await sound.current.unloadAsync().catch(() => {});
      const { sound: novoSom } = await Audio.Sound.createAsync(
        { uri: musica.uri },
        { shouldPlay: true }
      );
      sound.current = novoSom;
      setTocando(musica);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao tocar música:', error);
      Alert.alert('Erro', 'Não foi possível tocar a música.');
    }
  };

  const togglePlayPause = async () => {
    if (sound.current) {
      try {
        if (isPlaying) {
          await sound.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.current.playAsync();
          setIsPlaying(true);
        }
      } catch (e) {
        console.error('Erro ao alternar play/pause:', e);
      }
    }
  };

  const removerMusica = async (musicaId) => {
    Alert.alert('Remover música', 'Deseja remover essa música da playlist?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const atualizada = {
            ...playlist,
            musicas: playlist.musicas.filter(m => m.id !== musicaId),
          };
          setPlaylist(atualizada);
          await updatePlaylist(playlistId, atualizada);
        }
      }
    ]);
  };

  const verDetalhes = (musica) => {
    Alert.alert(
      'Detalhes da música',
      `Nome: ${musica.nome}\nID: ${musica.id}\nURI: ${musica.uri}`,
      [{ text: 'OK' }]
    );
  };

  if (!playlist) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.empty}>Carregando playlist...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.titulo}>{playlist.nome}</Text>
      <FlatList
        data={playlist.musicas || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <List.Item
              title={item.nome}
              titleStyle={styles.cardTitle}
              left={() => (
                <View style={{ paddingLeft: 12, height: 40, justifyContent: 'flex-end' }}>
                  <List.Icon icon="music" color={primaryColor} size={26} />
                </View>
              )}
              right={() => (
                <View style={{ flexDirection: 'row' }}>
                  <IconButton icon="information-outline" iconColor="#aaa" onPress={() => verDetalhes(item)} />
                  <IconButton icon="delete" iconColor="#ff4444" onPress={() => removerMusica(item.id)} />
                  {tocando?.id === item.id ? (
                    <IconButton icon="equalizer" iconColor="#E85BDA" />
                  ) : (
                    <IconButton icon="play" iconColor="#E85BDA" onPress={() => tocarMusica(item)} />
                  )}
                </View>
              )}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma música nesta playlist.</Text>}
      />
      {tocando && (
        <View style={styles.miniPlayer}>
          <Text numberOfLines={1} style={styles.miniTitulo}>{tocando.nome}</Text>
          <IconButton icon={isPlaying ? 'pause' : 'play'} iconColor="#FFFFFF" onPress={togglePlayPause} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: cardColor,
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 40,
    fontSize: 16,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: primaryColor,
    borderTopWidth: 1,
    borderColor: '#3D2F4C',
  },
  miniTitulo: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
