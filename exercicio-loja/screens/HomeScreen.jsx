import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, ActivityIndicator, Text } from 'react-native-paper';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://dummyjson.com/products/category-list')
      .then(res => setCategorias(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const getIconForCategory = (categoria) => {
    const icons = {
      'smartphones': 'cellphone',
      'laptops': 'laptop',
      'fragrances': 'spray',
      'skincare': 'face-woman',
      'groceries': 'cart',
      'home-decoration': 'sofa',
      'furniture': 'table-furniture',
      'tops': 'tshirt-crew',
      'womens-dresses': 'hanger',
      'womens-shoes': 'shoe-heel',
      'mens-shirts': 'tshirt-crew-outline',
      'mens-shoes': 'shoe-formal',
      'mens-watches': 'watch',
      'womens-watches': 'watch-variant',
      'womens-bags': 'bag-personal',
      'womens-jewellery': 'diamond-stone',
      'sunglasses': 'sunglasses',
      'automotive': 'car',
      'motorcycle': 'motorbike',
      'lighting': 'lightbulb'
    };
    return icons[categoria] || 'folder'; // ícone padrão
  };

  if (loading) return <ActivityIndicator style={styles.loading} animating size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ Selecione uma categoria:</Text>
      {categorias.map((item, index) => (
        <List.Item
          key={index}
          title={item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ')}
          left={() => <List.Icon icon={getIconForCategory(item)} />}
          onPress={() => navigation.navigate('Produtos', { categoria: item })}
          style={styles.listItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#333' },
  listItem: { backgroundColor: '#fff', borderRadius: 8, marginVertical: 5, elevation: 2 },
  loading: { flex: 1, justifyContent: 'center' }
});

export default HomeScreen;
