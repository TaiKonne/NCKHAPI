import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
let myId = '';
let listChat = [];
let setchat = [];
const Chat = () => {
    useEffect(() => {
        listChat = [];
        setchat = [];
        getAllChats();
        // getFollower();
    }, []);
    const [followers, setFollowers] = useState([]);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');
    const [chatList, setChatList] = useState([]);
    const navigation = useNavigation();
    // 
    const getAllChats = async () => {
        myId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(myId)
            .onSnapshot(documentSnapshot => {
                console.log(documentSnapshot);
                setchat = documentSnapshot._data.chatList;

                setchat.map(item => {
                    firestore()
                        .collection('Users')
                        .doc(item.chatUserId)
                        .get()
                        .then(Snapp => {
                            let tmp = 0;
                            console.log(Snapp);
                            listChat.push({
                                userId: Snapp._data.userId,
                                name: Snapp._data.name,
                                profilePic: Snapp._data.profilePic,
                            })
                        })

                })
            });
    };
    // const getFollower = async () => {
    //     userId = await AsyncStorage.getItem('USERID');
    //     names = await AsyncStorage.getItem('NAME');
    //     firestore()
    //         .collection('Users')
    //         .doc(userId)
    //         .get()
    //         .then(documentSnapshot => {
    //             if (documentSnapshot.exists) {
    //                 setFollowers(documentSnapshot.data().followers);
    //                 setUploadedPicUrl(documentSnapshot.data().profilePic);
    //             }
    //         })
    // }
    //
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    // paddingLeft: 20,
                    backgroundColor: 'skyblue',
                }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Messenger
                </Text>
            </View>
            <FlatList
                data={listChat}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={{
                                width: '100%',
                                height: 70,
                                backgroundColor: '#fff',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity
                                // style={{ marginRight: 20 }}
                                onPress={() => {
                                    navigation.navigate('NewMessage', {
                                        data: {
                                            userId: item.userId,
                                            name: item.name,
                                            myId: myId,
                                            profilePic:
                                                item.profilePic == '' || item.profilePic == null
                                                    ? ''
                                                    : item.profilePic,
                                        },
                                    });
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={
                                            item.profilePic == ''
                                                ? require('../images/user.png')
                                                : { uri: item.profilePic }
                                        }
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            marginLeft: 20,
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>
                                        {item.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginEnd: 20 }}
                            >
                                <Image
                                    source={require('../../front_end/icons/trash-can.png')}
                                    style={{ width: 22, height: 22, marginLeft: 20, tintColor: 'black', }}
                                />
                            </TouchableOpacity>
                        </View>
                        
                    );
                }}
            />
        </View>
    );
};

export default Chat;