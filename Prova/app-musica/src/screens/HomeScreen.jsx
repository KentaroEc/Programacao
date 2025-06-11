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
        Alert.alert("Permissão negada", "Ative o acesso a arquivos para carregar as músicas.");
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleMedium" style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <List.Subheader style={styles.subheader}>
        {musicas.length} músicas encontradas
      </List.Subheader>

      <FlatList
        data={musicas}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <List.Item
            title={item.filename}
            description={`Duração: ${Math.floor(item.duration / 60)}:${(item.duration % 60).toFixed(0).padStart(2, '0')}`}
            titleStyle={styles.titulo}
            descriptionStyle={styles.descricao}
            style={styles.item}
            onPress={() => tocarMusica(item)}
            left={props => <List.Icon {...props} icon="music" color="#E85BDA" />}
            right={props => (
              tocando?.id === item.id ? (
                <IconButton icon="equalizer" iconColor="#E85BDA" />
              ) : (
                <IconButton icon="play" iconColor="#E85BDA" onPress={() => tocarMusica(item)} />
              )
            )}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.nenhuma}>Nenhuma música encontrada</Text>
        }
        contentContainerStyle={{ paddingBottom: 0 }}
      />

      {tocando && (
        <View style={styles.miniPlayer}>
          <Text numberOfLines={1} style={styles.miniTitulo}>{tocando.filename}</Text>
          <IconButton icon="skip-previous" iconColor="#FFFFFF" onPress={musicaAnterior} />
          <IconButton icon={isPlaying ? 'pause' : 'play'} iconColor="#FFFFFF" onPress={togglePlayPause} />
          <IconButton icon="skip-next" iconColor="#FFFFFF" onPress={proximaMusica} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C0A26',
  },
  subheader: {
    color: '#ccc',
    marginLeft: 10,
  },
  item: {
    backgroundColor: '#2A0F3A',
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  titulo: {
    color: '#FFFFFF',
  },
  descricao: {
    color: '#C7A3D6',
  },
  nenhuma: {
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF',
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#912db5',
    borderTopWidth: 1,
    borderColor: '#3D2F4C',
  },
  miniTitulo: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  erro: {
    color: '#E74C3C',
  },
});
