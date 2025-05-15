import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';

export default function MegaSenaScreen() {
  const [jogos, setJogos] = useState([]);

  const gerarJogo = () => {
    const novoJogo = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 1)
      .sort((a, b) => a - b);
    setJogos([...jogos, novoJogo]);
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={gerarJogo}>
        Gerar Jogo da Mega-Sena
      </Button>
      <FlatList
        data={jogos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Jogo: {item.join(', ')}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff'
  },
  card: {
    marginTop: 10,
  }
});
