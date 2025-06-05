import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { addPlaylist, getPlaylists } from '../services/storage.js';
import { v4 as uuidv4 } from 'uuid';

// Cores do tema
const primaryColor = '#912db5';
const backgroundColor = '#1a0822';

export default function CreatePlaylistScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    genero: '',
    criador: '',
    ano: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const salvar = async () => {
    const { nome, descricao, genero, criador, ano } = form;

    if (!nome || !descricao || !genero || !criador || !ano) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novaPlaylist = {
      id: uuidv4(),
      ...form,
    };

    try {
      await addPlaylist(novaPlaylist);
      const todas = await getPlaylists();

      Alert.alert('Sucesso!', 'Playlist salva com sucesso!');

      navigation.navigate('Drawer', {
        screen: 'Início',
        params: { screen: 'Playlists' }
      });

    } catch (error) {
      console.error("Erro ao salvar playlist:", error);
      Alert.alert('Erro ao salvar a playlist.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Nova Playlist</Text>

      <TextInput
        label="Nome"
        value={form.nome}
        onChangeText={text => handleChange('nome', text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Descrição"
        value={form.descricao}
        onChangeText={text => handleChange('descricao', text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Gênero"
        value={form.genero}
        onChangeText={text => handleChange('genero', text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Criador"
        value={form.criador}
        onChangeText={text => handleChange('criador', text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Ano"
        value={form.ano}
        keyboardType="numeric"
        onChangeText={text => handleChange('ano', text)}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={salvar} buttonColor={primaryColor}>
        Salvar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 35,
    backgroundColor: backgroundColor,
    flexGrow: 1,
  },
  titulo: {
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#2b1b37',
  },
});
