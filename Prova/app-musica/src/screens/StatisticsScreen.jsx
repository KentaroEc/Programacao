import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Cores do tema
const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Estatísticas de Reprodução</Text>
      <Text style={styles.subheader}>Acompanhe seu histórico de músicas</Text>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="music-note" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Total de Músicas</Title>
          <Paragraph style={styles.cardText}>40 músicas</Paragraph>
        </View>
      </Surface>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="clock-outline" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Tempo Total Reproduzido</Title>
          <Paragraph style={styles.cardText}>45min</Paragraph>
        </View>
      </Surface>

      <Surface style={styles.statItem}>
        <MaterialCommunityIcons name="star" size={32} color={primaryColor} />
        <View style={styles.textContainer}>
          <Title style={styles.cardTitle}>Mais Reproduzida</Title>
          <Paragraph style={styles.cardText}>"Eminem - The Real Slim Shady"</Paragraph>
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
