import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import CheckBox from 'react-native-check-box';
import Header from '../componentes/Header.js';
import firebase from '../servicos/firebase.js';
import { Colors } from '../paleta/cores.js'
import { getDatabase, ref, update } from 'firebase/database';

const TelaAddPost = ({navigation, route}) => {
    const [selectedTags, setSelectedTags] = useState([])
    const availableTags = ['technology', 'famous-quotes', 'happiness', 'inspirational', 'motivational',]
    const toggleTagSelection = (tag) => {
        setSelectedTags([tag])
    }
    // busca frases com base nas tags passadas
    const searchQuotes = async () => {
        url = ""
        // se receber nao tags receber tags busca frases aleatorias
        if (selectedTags.length === 0){
            url = 'https://api.quotable.io/quotes/random'
        } else {
            const tagsQuery = selectedTags.join(',')
            url = 'https://api.quotable.io/quotes/random?tags='+tagsQuery
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
    return (
        <View style={styles.container}>
            <Header showNav={true} navigation={navigation} route={route} />
            <View style={styles.contentContainer}>
                <Text style={styles.titulo}>Selecione a tag do seu post</Text>
                {availableTags.map((tag) =>(
                    <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTagSelection(tag)}
                        style={styles.tagItem}
                    >
                        <CheckBox isChecked={selectedTags.includes(tag)} onClick={()=>toggleTagSelection(tag)}/>
                        <Text>{tag}</Text>
                    </TouchableOpacity>
                ))}
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
    titulo: {
        color: Colors.cor3,
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 20,
        textTransform: 'uppercase'
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
})
export default TelaAddPost;