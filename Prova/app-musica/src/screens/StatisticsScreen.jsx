import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

// Cores do tema
const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Estatísticas de Reprodução</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Total de Músicas</Title>
          <Paragraph style={styles.cardText}>132 músicas</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Tempo Total Reproduzido</Title>
          <Paragraph style={styles.cardText}>24min</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Mais Reproduzida</Title>
          <Paragraph style={styles.cardText}>"Eminem - The Real Slim Shady"</Paragraph>
        </Card.Content>
      </Card>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: cardColor,
    marginBottom: 15,
    elevation: 4,
    borderRadius: 10,
  },
  cardTitle: {
    color: primaryColor,
    fontSize: 18,
    marginBottom: 6,
  },
  cardText: {
    color: textColor,
    fontSize: 16,
  },
});
