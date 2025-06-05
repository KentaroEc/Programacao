import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { Text, List, ActivityIndicator, IconButton } from 'react-native-paper';

export default function HomeScreen() {
  const [musicas, setMusicas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tocando, setTocando] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    async function carregarMusicas() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão negada para acessar arquivos de mídia.');
        setCarregando(false);
        return;
      }

      try {
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
      } catch (e) {
        setErro('Erro ao carregar músicas: ' + e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarMusicas();

    return () => {
      sound.current.unloadAsync();
    };
  }, []);

  const tocarMusica = async (musica) => {
    try {
      if (sound.current) await sound.current.unloadAsync();

      const { sound: novoSom } = await Audio.Sound.createAsync(
        { uri: musica.uri },
        { shouldPlay: true }
      );

      sound.current = novoSom;
      setTocando(musica);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao tocar a música:', error);
    }
  };

  const togglePlayPause = async () => {
    if (sound.current) {
      if (isPlaying) {
        await sound.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const proximaMusica = () => {
    if (!tocando) return;
    const index = musicas.findIndex(m => m.id === tocando.id);
    if (index >= 0 && index < musicas.length - 1) {
      tocarMusica(musicas[index + 1]);
    }
  };

  const musicaAnterior = () => {
    if (!tocando) return;
    const index = musicas.findIndex(m => m.id === tocando.id);
    if (index > 0) {
      tocarMusica(musicas[index - 1]);
    }
  };

  if (carregando) {
    return <ActivityIndicator animating size="large" style={{ marginTop: 50 }} />;
  }

  if (erro) {
    return (
      <View style={{ padding: 20 }}>
        <Text variant="titleMedium" style={{ color: 'red' }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={musicas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.filename}
            description={`Duração: ${(item.duration / 60).toFixed(2)} min`}
            left={props => <List.Icon {...props} icon="music" />}
            right={props => <IconButton icon="play" onPress={() => tocarMusica(item)} />}
          />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma música encontrada</Text>}
      />

      {tocando && (
        <View style={styles.miniPlayer}>
          <Text numberOfLines={1} style={{ flex: 1 }}>{tocando.filename}</Text>
          <IconButton icon="skip-previous" onPress={musicaAnterior} />
          <IconButton icon={isPlaying ? 'pause' : 'play'} onPress={togglePlayPause} />
          <IconButton icon="skip-next" onPress={proximaMusica} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#bababa',
    borderTopWidth: 1,
    borderColor: '#CCC',
  },
});
