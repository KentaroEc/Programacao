import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Avatar, Button, Divider } from 'react-native-paper';

const backgroundColor = '#1a0822';
const cardColor = '#2b1b37';
const textColor = '#fff';
const primaryColor = '#912db5';

export default function ProfileScreen({ navigation }) {
  const handleEditar = () => {
    Alert.alert("Editar Perfil", "Função ainda não implementada.");
  };

  const handleSair = () => {
    Alert.alert("Sair", "Você saiu da conta.");
    // navigation.navigate('Login'); // se houver login
  };

  const handleAlterarSenha = () => {
    Alert.alert("Alterar Senha", "Função ainda não implementada.");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Icon size={80} icon="account" style={styles.avatar} color={primaryColor} />
          <Title style={styles.name}>Jhon Sousa</Title>
          <Paragraph style={styles.info}>Email: jhon.sousa@iesb.edu.br</Paragraph>
          <Paragraph style={styles.info}>Assinatura: Premium</Paragraph>
        </Card.Content>

        <Divider style={styles.divider} />

        <Card.Actions style={styles.actions}>
          <Button mode="outlined" textColor={primaryColor} onPress={handleEditar}>
            Editar Perfil
          </Button>
          <Button mode="outlined" textColor={primaryColor} onPress={handleAlterarSenha}>
            Alterar Senha
          </Button>
          <Button mode="contained" buttonColor="#d32f2f" onPress={handleSair}>
            Sair da Conta
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: cardColor,
    borderRadius: 12,
    elevation: 4,
    paddingVertical: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    color: textColor,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    color: textColor,
    fontSize: 14,
    marginBottom: 2,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#555',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
});
