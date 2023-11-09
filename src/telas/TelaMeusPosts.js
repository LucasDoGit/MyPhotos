import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Pressable, Image } from 'react-native';
import Header from '../componentes/Header.js';
import firebase from '../servicos/firebase.js';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { Colors } from '../paleta/cores.js';

const TelaMeusPosts = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    const database = getDatabase(firebase);
    const storage = getStorage(firebase);

    useEffect(() => {
        const userRef = ref(database, 'users/'+route.params.uid);
        get(userRef)
            .then((userSnapshot)=>{
                const user = userSnapshot.val()
                if(user){
                    const allPosts = [];
                    if(user.posts){
                        Object.keys(user.posts).forEach((postId) => {
                            const post = user.posts[postId];
                            allPosts.push({ postId, ...post});
                        });
                    }
                    setPosts(allPosts)
                }
            })
            .catch ((error) => { console.error('Erro ao buscar posts:', error); })
    }, [route.params])

    const deletePost = (postId, foto) => {
        const postRef = ref(database, 'users/'+route.params.uid+'/posts/'+postId);
        const imageRef = storageRef(storage, 'images/' + postId + '.jpg')
        remove(postRef)
            .then(() =>{
                const novosPosts = posts.filter((post) => post.postId !== postId);
                // console.log('Post excluido com sucesso!');
                setPosts(novosPosts);
                if(foto){
                    deleteObject(imageRef)
                        .catch((err) => {
                            console.error("Erro ao deletar imagem: "+ err)
                        })
                }
            })
            .catch((error) => {
                console.error('Erro ao excluir post:', error);
                Alert.alert('Erro', 'Ocorreu um erro ao excluir o post.');
            })
    }
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
                            <Text style={styles.container}>{item.legenda}</Text>
                            <Pressable onPress={() => deletePost(item.postId, item.foto)}>
                                <Image
                                source={require('../../assets/delete.png')}
                                resizeMode='contain'
                                style={styles.image}/>
                            </Pressable>
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
    header: {
        flex: 0.25
    },
    image: {
        width:48,
        height: 24
    },
    foto: {
        alignSelf: 'center',
        width: '80%',
        aspectRatio: 1
    }
});

export default TelaMeusPosts;