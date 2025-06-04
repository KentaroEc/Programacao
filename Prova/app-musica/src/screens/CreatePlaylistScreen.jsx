import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { addPlaylist, getPlaylists } from '../services/storage.js';
import { v4 as uuidv4 } from 'uuid';

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
    console.log("Botão SALVAR pressionado");

    const { nome, descricao, genero, criador, ano } = form;

    if (!nome || !descricao || !genero || !criador || !ano) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const novaPlaylist = {
      id: uuidv4(),
      ...form,
    };

    console.log("Nova playlist:", novaPlaylist);

    try {
      await addPlaylist(novaPlaylist);
      console.log("Playlist salva com sucesso!");

      const todas = await getPlaylists();
      console.log("Playlists armazenadas:", todas);

      Alert.alert('Sucesso!', 'Playlist salva com sucesso!');

      // NAVEGAÇÃO CORRETA PARA A ABA "Playlists"
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
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Nova Playlist</Text>

      <TextInput label="Nome" value={form.nome} onChangeText={text => handleChange('nome', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Descrição" value={form.descricao} onChangeText={text => handleChange('descricao', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Gênero" value={form.genero} onChangeText={text => handleChange('genero', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Criador" value={form.criador} onChangeText={text => handleChange('criador', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Ano" value={form.ano} keyboardType="numeric" onChangeText={text => handleChange('ano', text)} style={{ marginBottom: 10 }} />

      <Button mode="contained" onPress={salvar}>Salvar</Button>
    </ScrollView>
  );
}
