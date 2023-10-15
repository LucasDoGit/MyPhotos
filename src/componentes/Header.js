import React from 'react';
import { Colors } from '../paleta/cores'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Header = ({showNav, navigation, route}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>MyPhotos</Text>
                <Image
                    source={require('../../assets/Logo-transparente.png')}
                    resizeMode='contain'
                    style={styles.logo}
                />
            </View>
            {showNav ?
            <View style={styles.icons}>
                <Pressable onPress={() => navigation.navigate('posts', {uid: route.params.uid})}>
                    <Image
                        source={require('../../assets/home.png')}
                        resizeMode='contain'
                        style={styles.imageSmall}/>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('meusPosts', {uid: route.params.uid})}>
                    <Image
                        source={require('../../assets/posts.png')}
                        resizeMode='contain'
                        style={styles.imageSmall}/>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('addPost', {uid: route.params.uid})}>
                    <Image
                        source={require('../../assets/profile.png')}
                        resizeMode='contain'
                        style={styles.imageSmall}/>
                </Pressable>
                <StatusBar style="auto" />
            </View> : null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: Colors.cor2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 10,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    logo: {
        width: 90, // Largura da imagem do logotipo
        height: 90, // Altura da imagem do logotipo
    },
    imageSmall: {
        width: 32,
        height: 32
    }
});

export default Header;