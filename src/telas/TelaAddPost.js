import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
import Header from '../componentes/Header.js';
import firebase from '../servicos/firebase.js';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../paleta/cores.js'
import { getDatabase, ref, update } from 'firebase/database';

const TelaAddPost = ({navigation, route}) => {
    const [selectedTag, setSelectedTag] = useState('')
    const [availableTags, setAvailableTags] = useState([])
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
            .then((data) =>{
                const database = getDatabase(firebase)
                var postId = Date.now().toString()
                const userRef = ref(database, 'users/'+ route.params.uid+"/posts/"+postId)
                update(userRef, { legenda: data[0].content })
                    .then(() =>{
                        console.log('Post criado: ', data[0].content);
                        navigation.navigate('meusPosts', route.params)
                    })
                    .catch((error) => {
                        console.log('Erro ao criar post', error);
                    })
            })
            .catch((error) => console.log('Erro ao requisitar frases: ', error));
    }
    useEffect(() => {
        fetch('https://api.quotable.io/tags')
            .then((res) => res.json())
            .then((data) => {
                setAvailableTags(data);
            })
            .catch((err) => console.log('Erro ao buscar tags: ', err));
    }, []) 
    return (
        <View style={styles.container}>
            <Header showNav={true} navigation={navigation} route={route} />
            {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
            <View style={styles.contentContainer}>
                <Button
                    onPress={() => {navigation.navigate('camera', {uid: route.params.uid})}}
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
    }
})
export default TelaAddPost;