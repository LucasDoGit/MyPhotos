import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "../servicos/firebase";
import Header from "../componentes/Header";
import { Colors } from "../paleta/cores";

const TelaLogin = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = async () => {
    const auth = getAuth(firebase);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoginFailed(false)
        // Signed in
        //const user = userCredential.user;
        //console.log('Usuario logado com sucesso:', userCredential.user.email);
        navigation.navigate('posts', {uid: userCredential.user.uid});
      })
      .catch((error) => {
        setLoginFailed(true);
        //const errorCode = error.code;
        console.log('Erro ao fazer login: ', error.message);
      })
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header showNav={false} navigation={navigation} route={route} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.titulo}>Faça Login</Text>
        {loginFailed && <Text style={styles.loginFailed}>Usuário ou Senha Inválidos</Text>}
        <TextInput placeholder="E-mail" value={email} onChangeText={(text) => setEmail(text)} style={styles.input}/>
        <TextInput placeholder="Senha" value={password} onChangeText={(text) => setPassword(text)} secureTextEntry style={styles.input}/>
        <Button title="Login" color={Colors.cor1} onPress={handleLogin} />
        <Text style={styles.headerRegister}>É novo aqui? Cadastre-se</Text>
        <Pressable onPress={() => navigation.navigate('addUser')}>
          <Text style={styles.register}>Registrar novo usuario</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    container2: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    header: {
      flex: 0.25
    },
    titulo: {
      color: Colors.cor3,
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 20,
      textTransform: 'uppercase'
  },
    input: {
      width: '80%',
      height: 40,
      borderColor: Colors.cor2,
      borderWidth: 1,
      marginBottom: 10,
      borderRadius: 7,
      padding: 10,
    },
    loginFailed: {
      color: 'red',
      marginBottom: 10
    },
    headerRegister: {
      fontSize: 18,
      marginTop: 20,
      marginBottom: 20,
      textTransform: 'uppercase'
    },
    register: {
      textDecorationLine: 'underline',
      color: 'white',
      textTransform: 'uppercase',
      padding: 10,
      borderRadius: 7,
      backgroundColor: Colors.cor1
    },
});

export default TelaLogin;