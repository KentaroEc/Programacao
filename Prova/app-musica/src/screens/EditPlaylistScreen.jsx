import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { getPlaylists, updatePlaylist } from '../services/storage.js';

const backgroundColor = '#1a0822';
const primaryColor = '#912db5';
const cardColor = '#2b1b37';

export default function EditPlaylistScreen({ route, navigation }) {
  const { id } = route.params;
  const [form, setForm] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const listas = await getPlaylists();
      const encontrada = listas.find(p => p.id === id);
      if (encontrada) setForm(encontrada);
    };
    carregar();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const salvar = async () => {
    if (!form.nome || !form.descricao || !form.genero || !form.criador || !form.ano) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    await updatePlaylist(id, form);
    navigation.goBack();
  };

  if (!form) {
    return <Text style={styles.loading}>Carregando dados...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text variant="titleLarge" style={styles.title}>Editar Playlist</Text>

        <TextInput
          label="Nome"
          value={form.nome}
          onChangeText={text => handleChange('nome', text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: primaryColor } }}
        />
        <TextInput
          label="Descrição"
          value={form.descricao}
          onChangeText={text => handleChange('descricao', text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: primaryColor } }}
        />
        <TextInput
          label="Gênero"
          value={form.genero}
          onChangeText={text => handleChange('genero', text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: primaryColor } }}
        />
        <TextInput
          label="Criador"
          value={form.criador}
          onChangeText={text => handleChange('criador', text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: primaryColor } }}
        />
        <TextInput
          label="Ano"
          value={form.ano}
          keyboardType="numeric"
          onChangeText={text => handleChange('ano', text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: primaryColor } }}
        />

        <Button mode="contained" onPress={salvar} buttonColor={primaryColor} style={styles.button}>
          Salvar Alterações
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: backgroundColor,
  },
  title: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
     marginTop: 30
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 4,
  },
  loading: {
    padding: 20,
    color: '#ccc',
    textAlign: 'center',
  },
});
