import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { getPlaylists, updatePlaylist } from '../services/storage';

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
    return <Text style={{ padding: 20 }}>Carregando dados...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Editar Playlist</Text>

      <TextInput label="Nome" value={form.nome} onChangeText={text => handleChange('nome', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Descrição" value={form.descricao} onChangeText={text => handleChange('descricao', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Gênero" value={form.genero} onChangeText={text => handleChange('genero', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Criador" value={form.criador} onChangeText={text => handleChange('criador', text)} style={{ marginBottom: 10 }} />
      <TextInput label="Ano" value={form.ano} keyboardType="numeric" onChangeText={text => handleChange('ano', text)} style={{ marginBottom: 10 }} />

      <Button mode="contained" onPress={salvar}>Salvar Alterações</Button>
    </ScrollView>
  );
}
