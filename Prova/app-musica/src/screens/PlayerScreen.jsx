import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

export default function PlayerScreen() {
  const [musicas, setMusicas] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [tocando, setTocando] = useState(false);

  const soundRef = useRef(null);

  useEffect(() => {
    async function carregarMusicas() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return;

      const resultado = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000,
        sortBy: [MediaLibrary.SortBy.default],
      });

      setMusicas(resultado.assets);
    }

    carregarMusicas();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const tocarMusica = async () => {
    if (musicas.length === 0) return;

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: musicas[indexAtual].uri },
      { shouldPlay: true }
    );

    soundRef.current = sound;
    setTocando(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        proximaMusica();
      }
    });
  };

  const pausarOuContinuar = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setTocando(false);
    } else {
      await soundRef.current.playAsync();
      setTocando(true);
    }
  };

  const proximaMusica = async () => {
    if (musicas.length === 0) return;

    let novoIndex = indexAtual + 1;
    if (novoIndex >= musicas.length) novoIndex = 0;
    setIndexAtual(novoIndex);
    tocarMusica();
  };

  return (
    <View style={estilos.container}>
      <Text variant="titleLarge" style={estilos.texto}>
        {musicas.length > 0 ? musicas[indexAtual].filename : 'Nenhuma música carregada'}
      </Text>

      <View style={estilos.controles}>
        <IconButton
          icon={tocando ? "pause" : "play"}
          size={40}
          onPress={tocando ? pausarOuContinuar : tocarMusica}
        />
        <IconButton
          icon="skip-next"
          size={40}
          onPress={proximaMusica}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    marginBottom: 20,
    textAlign: 'center'
  },
  controles: {
    flexDirection: 'row',
    gap: 20
  }
});
