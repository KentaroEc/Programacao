import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Divider } from 'react-native-paper';

const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function AboutScreen() {
  const handleContato = () => {
    Linking.openURL('mailto:jhon.sousa@iesb.edu.br');
  };

  const abrirGitHub = () => {
    Linking.openURL('https://github.com/KentaroEc/Programacao.git');
  };

  const abrirTermos = () => {
    Linking.openURL('https://seusite.com/termos');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.titulo}>Sobre o Aplicativo</Title>
          <Paragraph style={styles.texto}>
            Este aplicativo foi criado para gerenciar e tocar músicas locais com praticidade. Oferece recursos como
            criação de playlists, estatísticas de reprodução e um player funcional.
          </Paragraph>

          <Paragraph style={styles.texto}>
            Desenvolvido por <Text style={styles.link}>Jhon Sousa</Text> — IESB, 2025.
          </Paragraph>

          <Divider style={{ marginVertical: 10, backgroundColor: '#444' }} />

          <Paragraph style={styles.info}>
            Versão do app: <Text style={styles.bold}>1.0.0</Text>
          </Paragraph>

          <Paragraph style={styles.link} onPress={abrirGitHub}>
            🔗 Repositório no GitHub
          </Paragraph>

          <Paragraph style={styles.link} onPress={abrirTermos}>
            📄 Termos de Uso
          </Paragraph>
        </Card.Content>

        <Card.Actions style={{ justifyContent: 'center', marginBottom: 10 }}>
          <Button mode="contained" onPress={handleContato} buttonColor={primaryColor}>
            Entrar em Contato
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: backgroundColor,
  },
  card: {
    backgroundColor: cardColor,
    borderRadius: 12,
    elevation: 4,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    color: textColor,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  texto: {
    fontSize: 15,
    color: textColor,
    marginBottom: 10,
    lineHeight: 22,
  },
  info: {
    fontSize: 14,
    color: textColor,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    color: primaryColor,
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: textColor,
  },
});
