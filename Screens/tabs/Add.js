import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

let token = '';
let name = '';
let email = '';
const Add = () => {
    const [imageData, setImageData] = useState(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        getFcmToken();
    }, []);

    const getFcmToken = async () => {
        // token = await messaging().getToken();
        name = await AsyncStorage.getItem('NAME');
        email = await AsyncStorage.getItem('EMAIL');
        console.log(token, name, email);
    }

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
        // upload file
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log(url);
        firestore()
            .collection('posts')
            .add({
                image: url,
                caption: caption,
                email: email,
                name: name,
                // token:token,
            })
            .then(() => {
                console.log('Post added!');
                getAllTokens();
            });
    };

    const getAllTokens = () => {
        let tempTokens = [];
        firestore()
            .collection('tokens')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    senNotifications(documentSnapshot.data().token);
                });
                senNotifications(tempTokens);
            });
    };
    const senNotifications = async token => {
        var axios = require('axios');
        var data = JSON.stringify({
            data: {},
            notification: {
                body: 'click to open check Post',
                title: 'New Post Added',
            },
            to: token,
        });


        var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                Authorization:
                    'key=AAAAWjmxLf0:APA91bEbImxRwc9ToVcxOIzvUTRjOoag-BWdJTKzMLMIPsTU5mk4ee_2zH6w76JNA_L7w12bWM3nWpE8qX6i8FkMosDOamEbMAbw7ErARwo2vJLFeZrAez8CyeTjXcm9hVQe12LHWUjo',
                'Content-Type': 'application/json',

            }
        }

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
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
                    if (imageData !== null || caption !== '') {
                        uploadImage();
                        senNotifications();
                    }
                    else {
                        alert('pls select pic or enter caption')
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
                    value={caption}
                    onChangeText={(txt) => {

                        setCaption(txt);
                    }}
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