import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { getPlayCount, getMostPlayed } from '../services/playcount';

// Cores do tema
const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function StatisticsScreen() {
  const [totalMusicas, setTotalMusicas] = useState(0);
  const [tempoTotal, setTempoTotal] = useState(0);
  const [musicaMaisReproduzida, setMusicaMaisReproduzida] = useState(null);

  useEffect(() => {
    async function carregarEstatisticas() {
      // Conta músicas locais
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return;

      const resultado = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000,
        sortBy: [MediaLibrary.SortBy.default],
      });

      const mp3s = resultado.assets.filter(item =>
        item.filename.toLowerCase().endsWith('.mp3')
      );

      setTotalMusicas(mp3s.length);

      // Tempo estimado total (em segundos)
      const tempoTotalSegundos = mp3s.reduce((acc, item) => acc + (item.duration || 0), 0);
      const minutos = Math.floor(tempoTotalSegundos / 60);
      setTempoTotal(minutos);

      // Música mais reproduzida
      const mais = await getMostPlayed();
      if (mais) {
        const musicaInfo = mp3s.find(m => m.id === mais.id);
        if (musicaInfo) {
          setMusicaMaisReproduzida({
            nome: musicaInfo.filename,
            total: mais.count
          });
        } else {
          setMusicaMaisReproduzida({
            nome: '(não encontrada)',
            total: mais.count
          });
        }
      }
    }

    carregarEstatisticas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Estatísticas de Reprodução</Text>
      <Text style={styles.subheader}>Acompanhe seu histórico de músicas</Text>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="music-note" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Total de Músicas</Title>
          <Paragraph style={styles.cardText}>{totalMusicas} músicas</Paragraph>
        </View>
      </Surface>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="clock-outline" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Tempo Total Estimado</Title>
          <Paragraph style={styles.cardText}>{tempoTotal} min</Paragraph>
        </View>
      </Surface>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="star" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Mais Reproduzida</Title>
          <Paragraph style={styles.cardText}>
            {musicaMaisReproduzida
              ? `${musicaMaisReproduzida.nome} (${musicaMaisReproduzida.total}x)`
              : 'Nenhuma reprodução ainda'}
          </Paragraph>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    padding: 20,
  },
  header: {
    fontSize: 22,
    color: textColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cardColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 16,
    flexShrink: 1,
  },
  cardTitle: {
    color: primaryColor,
    fontSize: 16,
    marginBottom: 2,
  },
  cardText: {
    color: textColor,
    fontSize: 15,
  },
});
