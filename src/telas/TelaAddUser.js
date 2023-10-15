import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Header from  '../componentes/Header';
import firebase from '../servicos/firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { Colors} from '../paleta/cores'

function TelaAddUser({navigation, route}) {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome]         = useState("");
    const [createFailed, setCreateFailed] = useState(false);
    
    const registrar = () => {
        const auth = getAuth(firebase);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const database = getDatabase(firebase)
            const userRef = ref(database, 'users/'+ userCredential.user.uid)
            set(userRef, { nome: nome})
                .then(() =>{
                    console.log('usuario criado com sucesso:', userCredential.user.email)
                    setCreateFailed(false)
                    navigation.navigate('login')
                    //const user = userCredential.user;
                })
                .catch((error) => {
                    console.log('Erro ao adicionar usuario:', error)
                })
        })
        .catch((error) => {
            //const errorCode = error.code;
            console.log('Erro ao criar usuário: ', error.message)
            setCreateFailed(true)
        });
    };
    
    return (
      <View style={styles.containerHeader}>
        <View style={styles.header}>
          <Header showNav={false} navigation={navigation} route={route} />
        </View>
        <View style={styles.container}>
          <Text style={styles.titulo}>Faça o seu cadastro</Text>
          {createFailed && (<Text style={styles.createFailed}>Falha ao criar usuário, tente novamente!</Text>)}
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={(text) => setNome(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Registrar" color={Colors.cor1} onPress={registrar} />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    containerHeader: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
      flex: 0.25
    },
    titulo: {
        color: Colors.cor2,
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        textTransform: 'uppercase'
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: Colors.cor3,
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 7,
        padding: 10,
      },
      createFailed: {
        color: 'red',
        marginBottom: 10
      },
})

export default TelaAddUser;