import { View, Text, TouchableOpacity, Image, TextInput, PermissionsAndroid, Alert , ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../common/Loader';

import { useNavigation } from '@react-navigation/native';
import Home from './Home';
const admin = require('firebase-admin');
import uuid from 'react-native-uuid';
let token = '';
let name = '';
let email = '';
let profile = '';

const Add = ({ onAdded }) => {
    const navigation = useNavigation();
    const [imageData, setImageData] = useState(null);
    const [caption, setCaption] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        getFcmToken();
    }, []);
    const getFcmToken = async () => {
        name = await AsyncStorage.getItem('NAME');
        email = await AsyncStorage.getItem('EMAIL');
        profile = await AsyncStorage.getItem('PROFILE_PIC');
        console.log(email, name);
        console.log(profile);
    };
    let options = {
        saveToPhotos: true,
        mediaType: 'photo',
    };
    const openCamera = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const result = await launchCamera({ mediaType: 'photo' });
            setImageData(result);
        }
        else
            console.log('Tu choi camera');
    };
    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
    };
    const uplaodImage = async () => {
        setModalVisible(true);
        let id = uuid.v4();
        let PS = [];
        let time = new Date();
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        const userId = await AsyncStorage.getItem('USERID');
        // uploads file
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log(url);
        firestore()
            .collection('posts')
            .doc(id)
            .set({
                image: url,
                caption: caption,
                email: email,
                name: name,
                userId: userId,
                profilePic: profile,
                postId: id,
                likes: [],
                share: [],
                comments: [],
                createdAt: new Date(),
            })
            .then(() => {
                firestore()
                    .collection('Users')
                    .doc(userId)
                    .get()
                    .then(tt => {
                        PS = tt.data().posts;
                        PS.push({
                            postId: id,
                            time: time,
                            userId: userId,
                        });
                        firestore()
                            .collection('Users')
                            .doc(userId)
                            .update({
                                posts: PS,
                            })
                    })
                getAllTokens();
            })
            .catch(error => {
                setModalVisible(false);
            });
    };
    const cap = async () => {
        setModalVisible(true);
        let id = uuid.v4();
        let PS = [];
        let time = new Date();
        const userId = await AsyncStorage.getItem('USERID');

        const url = '';
        firestore()
            .collection('posts')
            .doc(id)
            .set({
                image: url,
                caption: caption,
                email: email,
                name: name,
                userId: userId,
                profilePic: profile,
                postId: id,
                likes: [],
                share: [],
                comments: [],
                createdAt: new Date(),
            })
            .then(() => {
                firestore()
                    .collection('Users')
                    .doc(userId)
                    .get()
                    .then(tt => {
                        PS = tt.data().posts;
                        PS.push({
                            postId: id,
                            time: time,
                            userId: userId,
                        });
                        firestore()
                            .collection('Users')
                            .doc(userId)
                            .update({
                                posts: PS,
                            })
                    })
                getAllTokens();
            })
            .catch(error => {
                setModalVisible(false);
            });

    };
    const getAllTokens = () => {
        let tempTokens = [];
        firestore()
            .collection('tokens')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    //  tempTokens.push(documentSnapshot.data().token);
                    sendNotifications(documentSnapshot.data().token);
                });
                sendNotifications(tempTokens);
            })
            .catch(error => {
                setModalVisible(false);
            });
        setModalVisible(false);
        onAdded();
    };
    const sendNotifications = async token => {
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
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View
                style={{
                    height: 60,
                    backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('HomeSC')
                    }}>
                    <Image source={require('../../front_end/icons/left.png')}
                        style={{
                            height: 25,
                            width: 25,
                            marginStart: 10,
                            tintColor: 'white',
                        }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Tạo bài viết</Text>
                <Text
                    style={{
                        marginEnd: 10,
                        fontSize: 18,
                        color: imageData !== null || caption !== '' ? 'blue' : '#8e8e8e',
                        fontWeight: 'bold',
                    }}
                    onPress={() => {
                        if (imageData !== null) {
                            uplaodImage();
                            navigation.navigate('HomeSC')
                        } else if (imageData === null && caption !== '') {
                            cap();
                            navigation.navigate('HomeSC')
                        }
                        else {
                            Alert.alert('', 'Nội dung hiện đang rỗng');
                        }
                    }}>
                    {' '}
                    Đăng
                </Text>
            </View>
            <View
                style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: 20,
                    borderColor: '#8e8e8e',
                    borderRadius: 10,
                    height: 150,
                    borderWidth: 0.2,
                    flexDirection: 'row',
                }}>
                {imageData !== null ? (
                    <Image
                        source={{ uri: imageData.assets[0].uri }}
                        style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
                    />
                ) : (
                    <Image
                        source={require('../images/image.png')}
                        style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
                    />
                )}
                <TextInput
                    value={caption}
                    onChangeText={txt => {
                        setCaption(txt);
                    }}
                    placeholder="type Caption here..."
                    placeholderTextColor={'grey'}
                    style={{ width: '70%', color: 'black' }}
                />
            </View>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    openCamera();
                }}>
                <Image
                    source={require('../../front_end/icons/photo-camera.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: '#4599ff', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    openGallery();
                }}>
                <Image
                    source={require('../../front_end/icons/image-gallery.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: '#45bd62', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Ảnh</Text>
            </TouchableOpacity>
            <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Gắn thẻ người khác')
                }}>
                <Image
                    source={require('../../front_end/icons/friend.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: '#1877f2', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Gắn thẻ người khác</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Thêm cảm xúc/hoạt động')
                }}>
                <Image
                    source={require('../../front_end/icons/happy.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: '#f7b928', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Cảm xúc/hoạt dộng</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Thêm địa điểm check in')
                }}>
                <Image
                    source={require('../../front_end/icons/check-in.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, 
                        // tintColor: '#f5533d', 
                
                }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>check in</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Phát trực tiếp')
                }}>
                <Image
                    source={require('../../front_end/icons/facebook.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, 
                        // tintColor: 'black',
                    }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Video trực tiếp</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Thêm màu nền')
                }}>
                <Image
                    source={require('../../front_end/icons/font-size.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: '#43d1be', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Màu nền</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Thêm file GIF')
                }}>
                <Image
                    source={require('../../front_end/icons/gif.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: 'black', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>File GIF</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%',
                    marginTop: 5,
                    height: 50,
                    borderBottomWidth: 0.2,
                    borderBottomColor: '#8e8e8e',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
                onPress={() => {
                    Alert.alert('','Thêm bài hát')
                }}>
                <Image
                    source={require('../../front_end/icons/music.png')}
                    style={{ width: 24, height: 24, marginLeft: 20, tintColor: 'orange', }}
                />
                <Text style={{ marginLeft: 20, color: 'grey' }}>Nhạc</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Add;