import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
const Add = () => {
    const [imageData, setImageData] = useState(null);
    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
    };
    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
    };
    const uploadImage = async () => {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log(url);
        firestore()
            .collection('posts')
            .add({
                image: url,
            })
            .then(() => {
                console.log('Post added!');
            });
        firestore()
            .collection('posts')
            .get()
            .then(querySnapshot => {
                console.log('Total posts: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    console.log('User ID: ',
                        documentSnapshot.id,
                        documentSnapshot.data());
                });
            });
    };
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={{
                width: '100%',
                height: 60,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                borderBottomWidth: 0.5,
                borderBottomColor: '#8e8e8e'
            }}>
                <Text style={{
                    marginLeft: 20,
                    fontSize: 20,
                    color: '#000',
                }}>
                    Post
                </Text>
                <Text style={{
                    marginRight: 18,
                    fontSize: 18,
                    color: imageData !== null ? 'blue' : '#8e8e8e',
                }} onPress={() => {
                    if (imageData !== null) {
                        uploadImage();
                    }
                }}

                >
                    {' '}
                    Upload
                </Text>
            </View>
            <View style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 20,
                borderColor: '#8e8e8e',
                borderRadius: 10,
                height: 150,
                borderWidth: 0.2,
                flexDirection: 'row',
            }}>
                {imageData !== null ? (<Image source={{ uri: imageData.assets[0].uri }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        margin: 10,
                    }} />) : (
                    <Image
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            margin: 10,
                        }}
                        source={require('../../front_end/icons/gallery_1.png')}
                    />
                )}
                <TextInput
                    placeholder='Caption here...'
                    placeholderTextColor={'gray'}
                    style={{
                        color: 'black',
                        width: '70%',
                    }} />
            </View>
            <TouchableOpacity style={{
                width: '100%',
                height: 50,
                borderBottomWidth: 0.5,
                borderBottomColor: '#8e8e8e',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 30,
            }} onPress={() => {
                openCamera();
            }}>
                <Image source={require('../../front_end/icons/camera.png')}
                    style={{
                        width: 24,
                        height: 24,
                        marginLeft: 20,
                    }} />
                <Text style={{
                    marginLeft: 20,
                    color: 'black'
                }}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                width: '100%',
                height: 50,
                borderBottomWidth: 0.5,
                borderBottomColor: '#8e8e8e',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 30,
            }}
                onPress={() => {
                    openGallery();
                }}>
                <Image source={require('../../front_end/icons/gallery.png')}
                    style={{
                        width: 24,
                        height: 24,
                        marginLeft: 20,
                    }} />
                <Text style={{
                    marginLeft: 20,
                    color: 'black'
                }}>Open Gallery</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Add;