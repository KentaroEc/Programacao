import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { addPlaylist } from '../services/storage.js';

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

  const [carregando, setCarregando] = useState(false);

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
      id: Date.now().toString(), // substituindo uuidv4()
      ...form,
    };

    try {
      setCarregando(true);
      console.log('Salvando playlist:', novaPlaylist);

      await addPlaylist(novaPlaylist);

      Alert.alert('Sucesso!', 'Playlist salva com sucesso!');

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Drawer',
            state: {
              routes: [
                {
                  name: 'Início',
                  state: {
                    routes: [
                      { name: 'Biblioteca' },
                      { name: 'Playlists' }
                    ],
                    index: 1
                  }
                }
              ],
              index: 0
            }
          }
        ]
      });

    } catch (error) {
      console.error("Erro ao salvar playlist:", error);
      Alert.alert('Erro', 'Não foi possível salvar a playlist.');
    } finally {
      setCarregando(false);
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
        theme={inputTheme}
      />
      <TextInput
        label="Descrição"
        value={form.descricao}
        onChangeText={text => handleChange('descricao', text)}
        style={styles.input}
        mode="outlined"
        theme={inputTheme}
      />
      <TextInput
        label="Gênero"
        value={form.genero}
        onChangeText={text => handleChange('genero', text)}
        style={styles.input}
        mode="outlined"
        theme={inputTheme}
      />
      <TextInput
        label="Criador"
        value={form.criador}
        onChangeText={text => handleChange('criador', text)}
        style={styles.input}
        mode="outlined"
        theme={inputTheme}
      />
      <TextInput
        label="Ano"
        value={form.ano}
        keyboardType="numeric"
        onChangeText={text => handleChange('ano', text)}
        style={styles.input}
        mode="outlined"
        theme={inputTheme}
      />

      <Button
        mode="contained"
        onPress={salvar}
        buttonColor={primaryColor}
        loading={carregando}
        disabled={carregando}
        style={{ marginTop: 10 }}
      >
        {carregando ? 'Salvando...' : 'Salvar'}
      </Button>
    </ScrollView>
  );
}

const inputTheme = {
  colors: {
    primary: '#912db5',
    background: '#2b1b37',
    text: '#fff',
    placeholder: '#ccc',
  }
};

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
    color: '#fff',
  },
});
