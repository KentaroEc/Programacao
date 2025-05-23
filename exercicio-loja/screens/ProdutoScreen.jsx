import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';
import axios from 'axios';

const ProdutoScreen = ({ route }) => {
  const { id } = route.params;
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${id}`)
      .then(res => setProduto(res.data));
  }, []);

  if (!produto) return <ActivityIndicator style={styles.loading} animating size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: produto.thumbnail }} />
        <Card.Content>
          <Title>{produto.title}</Title>
          <Chip style={styles.chip}>{produto.category}</Chip>
          <Paragraph style={styles.description}>{produto.description}</Paragraph>
          <Paragraph style={styles.price}>💰 Preço: R$ {produto.price}</Paragraph>
          <Paragraph>Marca: {produto.brand}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  card: { borderRadius: 10, elevation: 3 },
  price: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#6200ee' },
  chip: { marginVertical: 10, alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  description: { marginVertical: 8 },
  loading: { flex: 1, justifyContent: 'center' }
});

export default ProdutoScreen;
