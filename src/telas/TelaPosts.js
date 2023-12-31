import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import Header from '../componentes/Header.js';
import firebase from '../servicos/firebase.js';
import { getDatabase, ref, get } from 'firebase/database';
import { Colors } from '../paleta/cores.js';

const TelaPosts = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    const database = getDatabase(firebase);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        get(usersRef)
            .then((usersSnapshot)=>{
                const users = usersSnapshot.val()
                if(users){
                    const allPosts = [];
                    Object.keys(users).forEach((userId)=>{
                        const user = users[userId]
                        if(user.posts){
                            Object.keys(user.posts).forEach((postId)=>{
                                const post = user.posts[postId];
                                allPosts.push({ userId, userName: user.nome, postId, ...post});
                            });
                        }
                    })
                    setPosts(allPosts)
                }
            })
            .catch ((error) => { console.error('Erro ao buscar posts:', error); })
    }, [route.params])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header showNav={true} navigation={navigation} route={route} />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.postId}
                    renderItem={({ item }) => (
                        <View styles={{paddingTop: 10}}>
                            {item.foto && (<Image source={{uri: item.foto}} style={styles.foto}/>)}
                        <View style={styles.postContainer}>
                            <Text style={styles.userName}>{item.userName}:</Text>
                            <Text style={styles.container}>{item.legenda}</Text>
                            <Pressable onPress={() => navigation.navigate('localizacao', {uid: route.params.uid, post: item})}>
                                <Image
                                source={require('../../assets/localizacao.png')}
                                resizeMode='contain'
                                style={styles.image}/>
                            </Pressable>
                        </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    postContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.cor2,
    },
    userName: {
        color: Colors.cor3,
        fontWeight: 'bold',
        marginRight: 8,
    },
    header: {
        flex: 0.25
    },
    foto: {
        alignSelf: 'center',
        width: '80%',
        aspectRatio: 1
    },
    image: {
        width:48,
        height: 48
    },
});

export default TelaPosts;