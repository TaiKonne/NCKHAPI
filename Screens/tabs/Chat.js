import { View, Text, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
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
    // lock messenger
    const [SimpleModal, setSimpleModal] = useState(false);
    const [checkLock, setCheckLock] = useState(false);
    const [checkPassLock, setCheckPassLock] = useState('');
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

    const deleteChat = async user => {
        let temp = [];
        let conCacToBu = [];
        firestore()
            .collection('Users')
            .doc(myId)
            .get()
            .then(Snap => {
                temp = Snap._data.chatList;
                temp.map(item => {
                    if (item.chatUserId !== user) {
                        conCacToBu.push({
                            chatUserId: item.chatUserId,
                        })
                    }
                })
                firestore()
                    .collection('Users')
                    .doc(myId)
                    .update({
                        chatList: conCacToBu,
                    })
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    height: 60,
                    backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                <View style={{ width: 30, height: 50 }} />
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Messenger
                </Text>
                <TouchableOpacity onPress={() => {
                    setSimpleModal(true)
                }}>
                    <Image source={require('../../front_end/icons/lock.png')}
                        style={{
                            height: 27,
                            width: 27,
                            marginEnd: 10,
                            tintColor: 'white',
                        }} />
                </TouchableOpacity>
            </View>
            <Modal
                visible={SimpleModal}
                animationType="fade"
                transparent={true}
            >
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, flexDirection: 'column', borderWidth: 0.3, borderColor: 'grey' }}>
                        <Text style={{ color: 'black' }}>Nhập mật khẩu để mở khóa</Text>
                        <TextInput 
                            style={{
                                borderWidth:1,
                                borderColor:'grey',
                                borderRadius:5,
                                height:37,
                                marginTop:5,
                                justifyContent:'center',

                            }}
                            value={checkPassLock}
                            onChangeText={txt => {setCheckPassLock(txt)}}
                            autoFocus
                            placeholder='Nhập mật khẩu'
                            placeholderTextColor={'grey'}
                        >
                            
                        </TextInput>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSimpleModal(false)
                                }}>
                                <Text
                                    style={{ marginTop: 20, color: 'black', marginStart: 20, fontWeight: 'bold' }}>Hủy</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}></View>
                            <TouchableOpacity
                                onPress={() => {
                                    setSimpleModal(false)
                                }}>
                                <Text
                                    style={{ marginTop: 20, color: 'blue', marginEnd: 20, fontWeight: 'bold' }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
                                onPress={() => {
                                    deleteChat(item.userId);
                                }}
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