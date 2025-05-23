import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const ListaProdutosScreen = ({ route, navigation }) => {
  const { categoria } = route.params;
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/category/${categoria}`)
      .then(res => setProdutos(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.loading} animating size="large" />;

  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('Detalhes', { id: item.id })}>
          <Card.Cover source={{ uri: item.thumbnail }} />
          <Card.Content>
            <Title>{item.title}</Title>
            <Paragraph numberOfLines={2}>{item.description}</Paragraph>
            <Paragraph style={styles.price}>💰 R$ {item.price}</Paragraph>
          </Card.Content>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  card: { marginBottom: 15, borderRadius: 10, elevation: 3 },
  price: { fontWeight: 'bold', marginTop: 5, color: '#6200ee' },
  loading: { flex: 1, justifyContent: 'center' }
});

export default ListaProdutosScreen;
