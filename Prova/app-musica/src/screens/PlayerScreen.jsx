import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const primaryColor = '#912db5';
const backgroundColor = '#1a0822';

export default function PlayerScreen() {
  const [musicas, setMusicas] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [posicao, setPosicao] = useState(0);
  const [duracao, setDuracao] = useState(1);

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

      const extensoesAceitas = ['.mp3'];
      const filtradas = resultado.assets.filter(item =>
        extensoesAceitas.some(ext => item.filename.toLowerCase().endsWith(ext))
      );

      setMusicas(filtradas);
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
      if (status.isLoaded) {
        setDuracao(status.durationMillis || 1);
        setPosicao(status.positionMillis || 0);

        if (status.didJustFinish) {
          proximaMusica();
        }
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

  const musicaAnterior = async () => {
    if (musicas.length === 0) return;

    let novoIndex = indexAtual - 1;
    if (novoIndex < 0) novoIndex = musicas.length - 1;
    setIndexAtual(novoIndex);
    tocarMusica();
  };

  const formatarTempo = (millis) => {
    const totalSegundos = Math.floor(millis / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const aoSoltarSlider = async (value) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  return (
    <View style={estilos.container}>
      <Text variant="titleLarge" style={estilos.texto}>
        {musicas.length > 0 ? musicas[indexAtual].filename : 'Nenhuma música carregada'}
      </Text>

      {musicas.length > 0 && (
        <>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={0}
            maximumValue={duracao}
            value={posicao}
            onSlidingComplete={aoSoltarSlider}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#888"
            thumbTintColor="#fff"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
            <Text style={{ color: '#ccc' }}>{formatarTempo(posicao)}</Text>
            <Text style={{ color: '#ccc' }}>{formatarTempo(duracao)}</Text>
          </View>
        </>
      )}

      <View style={estilos.controles}>
        <IconButton
          icon="skip-previous"
          size={40}
          iconColor="#fff"
          onPress={musicaAnterior}
        />
        <IconButton
          icon={tocando ? "pause" : "play"}
          size={40}
          iconColor="#fff"
          onPress={tocando ? pausarOuContinuar : tocarMusica}
        />
        <IconButton
          icon="skip-next"
          size={40}
          iconColor="#fff"
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
    alignItems: 'center',
    backgroundColor: backgroundColor,
    padding: 20,
  },
  texto: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  controles: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
});
