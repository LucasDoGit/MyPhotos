import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
import Header from '../componentes/Header.js';
import firebase from '../servicos/firebase.js';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../paleta/cores.js'
import { getDatabase, ref, update } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import * as Location from 'expo-location';

const TelaAddPost = ({navigation, route}) => {
    const [selectedTag, setSelectedTag] = useState('')
    const [availableTags, setAvailableTags] = useState([])
    const [postFailed, setPostFailed] = useState(false)
    const [location, setLocation] = useState(null)

    const image = route.params.image ? route.params.image : null
    // busca frases com base nas tags passadas
    const searchQuotes = async () => {
        url = ""
        // se receber nao tags receber tags busca frases aleatorias
        if (selectedTag.length === 0){
            url = 'https://api.quotable.io/quotes/random'
        } else {
            url = 'https://api.quotable.io/quotes/random?tags='+selectedTag
        }
        fetch(url)
            .then((res) => res.json())
            .then(async (data) =>{
                const database = getDatabase(firebase)
                const storage = getStorage(firebase)
                var postId = Date.now().toString()
                var imageUrl = ''
                if(image) {
                    const imageRef = storageRef(storage, 'images/' + postId + '.jpg')
                    const imageData = await fetch(image).then((res) => res.blob())
                    const uploadTask = await uploadBytes(imageRef, imageData)
                    imageUrl = await getDownloadURL(imageRef)
                }
                const userRef = ref(database, 'users/'+ route.params.uid+"/posts/"+postId)
                update(userRef, { legenda: data[0].content, foto: imageUrl, geolocalizacao: location })
                    .then(() =>{
                        // console.log('Post criado: ', data[0].content);
                        setPostFailed(false)
                        navigation.navigate('posts', {uid: route.params.uid})
                    })
                    .catch((error) => {
                        setPostFailed(true)
                        console.log('Erro ao criar post', error);
                    })
            })
            .catch((error) => {
                setPostFailed(true)
                console.log('Erro ao requisitar frases: ', error)});
    }
    // funcao fetch que faz a busca de tags na API quotable
    const searchTags = async () => {
        fetch('https://api.quotable.io/tags')
            .then((res) => res.json())
            .then((data) => {
                setAvailableTags(data);
            })
            .catch((err) => console.log('Erro ao buscar tags: ', err));
    }
    // funcao fetch para buscar a solicitar e buscar a localização do usuario
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted') {
            return (<View><Text style={styles.postFailed}>Permissão de Localização negada!</Text></View>)
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude})
    }
    // chama as funções abaixo assim que a página do aplicativo for aberta
    useEffect(() => {
        searchTags()
        getLocation()
    }, []) 
    return (
        <View style={styles.container}>
            <Header showNav={true} navigation={navigation} route={route} />
            {postFailed ? <Text styles={styles.postFailed}>Falha ao enviar o post</Text> : null}
            {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
            <View style={styles.contentContainer}>
                <Button
                    onPress={() => {navigation.navigate('camera', {uid: route.params.uid})}}
                    color={Colors.cor1}
                    title="Tirar Foto"
                />
                <Picker 
                    selectedValue={selectedTag}
                    onValueChange={(itemValue, itemIndex) => setSelectedTag(itemValue)}
                >
                    <Picker.Item label="Selecione uma tag para legenda" value="" />
                    {availableTags.map((tag) => (
                        <Picker.Item key={tag._id} label={tag.name} value={tag.name} />
                    ))}
                </Picker>
                <Button 
                    onPress={searchQuotes}
                    color={Colors.cor2}
                    title='Gerar post'
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        flex: 1,
        resizeMode: 'contain'
    },
    postFailed: {
        fontWeight: 'bold',
        color: 'red'
    }
});

export default TelaAddPost;