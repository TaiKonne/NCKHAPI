import { View, Text, TouchableOpacity, PermissionsAndroid, Image, Touchable } from 'react-native'
import React, { useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Search from './tabs/Search'
import Home from './tabs/Home'
import Add from './tabs/Add'
import Chat from './tabs/Chat'
import Profile from './tabs/Profile'
const HomeSC = () => {
    const [sellectedTab, setSellectedTab] = useState(0);
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
    };
    const requesPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera',
                    message:
                        'Bạn được app yêu cầu mở camera lên đóa',
                    buttonNeutral: 'Hỏi tôi sau',
                    buttonNegative: 'Hủy',
                    buttonPositive: 'OK mở lunn',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                openCamera();
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    const uploadImage = async () => {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log(url);
    };
    return (
        <View style={{
            flex: 1,
        }}>

            {/* {sellectedTab === 0 ? (
                <Home />
            ) : sellectedTab === 1 ? (
                <Chat />
            ) : sellectedTab === 2 ? (
                <Add />
            ) : sellectedTab === 3 ? (
                <Search />) : (
                <Profile />)} */}
                {sellectedTab === 0 ? (<Home /> ) 
                    : sellectedTab === 1 ? (<Chat />) 
                        : sellectedTab === 2 ? (<Search />) 
                            : (<Profile/>)}

            <View style={{
                position: 'absolute',
                bottom: 0,
                height: 60,
                width: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'skyblue',
            }}>
                <TouchableOpacity // icon house
                    style={{
                        width: '20%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        setSellectedTab(0)
                    }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2f2f2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}>
                        <Image source={require('../front_end/icons/house.png')}
                            style={{
                                width: 24, height: 24, tintColor: sellectedTab == 0 ? 'orange' : '#8e8e8e'
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity // icon house
                    style={{
                        width: '20%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} onPress={() => {
                        setSellectedTab(1);
                    }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2f2f2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}>
                        <Image source={require('../front_end/icons/comment.png')}
                            style={{
                                width: 24, height: 24, tintColor: sellectedTab == 1 ? 'orange' : '#8e8e8e'
                            }}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity // icon house
                    style={{
                        width: '20%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        setSellectedTab(2);
                    }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2f2f2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}>
                        <Image source={require('../front_end/icons/magnifying-glass.png')}
                            style={{
                                width: 24, height: 24, tintColor: sellectedTab == 2 ? 'orange' : '#8e8e8e'
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity // icon house
                    style={{
                        width: '20%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        setSellectedTab(3);
                    }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#f2f2f2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}>
                        <Image source={require('../front_end/icons/user.png')}
                            style={{ width: 24, height: 24, tintColor: sellectedTab == 3 ? 'orange' : '#8e8e8e' }}
                        />
                    </View>
                </TouchableOpacity>
            </View >
        </View >
    )
}

export default HomeSC;