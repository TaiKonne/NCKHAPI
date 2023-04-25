import { View, Text, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { rewriteURIForGET } from '@apollo/client';
let myId = '';
let listChat = [];
let setchat = [];
const Chat = () => {

    useEffect(() => {

        getAllChats();
        getVerify();
    }, []);
    const [followers, setFollowers] = useState([]);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');
    const [chatList, setChatList] = useState([]);
    const navigation = useNavigation();
    // lock messenger
    const [SimpleModal, setSimpleModal] = useState(false);
    const [checkLock, setCheckLock] = useState(false);
    const [checkPassLock, setCheckPassLock] = useState('');
    const [scurity2Layer, setScurity2Layer] = useState('');

    //xoa tin nhan
    const [openModal, setOpenModal] = useState(false);

    const getAllChats = async () => {
        myId = await AsyncStorage.getItem('USERID');

        firestore()
            .collection('Users')
            .doc(myId)
            .get()
            .then(documentSnapshot => {
                listChat = [];
                setchat = [];
                console.log(documentSnapshot);
                setchat = documentSnapshot._data.chatList;
                setchat.map(item => {
                    firestore()
                        .collection('Users')
                        .doc(item.chatUserId)
                        .get()
                        .then(Snapp => {
                            listChat.push({
                                userId: Snapp._data.userId,
                                name: Snapp._data.name,
                                profilePic: Snapp._data.profilePic,
                            })
                        })
                })
            });
    };
    const [unLock, setUnLock] = useState(false); // xác nhận điều kiện để hiện hoặc không hiện bảng nhập mật khẩu
    const getVerify = async () => { // lấy mk 2 lớp
        myId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(myId)
            .get()
            .then(Snap => {
                setScurity2Layer(Snap._data.passSecurity2Layer);
                if (Snap._data.passSecurity2Layer != '') {
                    setUnLock(true);
                }
            })
    }

    const checkScurity = async () => { // như trên
        // getVerify();
        if (scurity2Layer == '') {
            setUnLock(false);
        }
        else {
            if (checkPassLock === scurity2Layer) {
                setUnLock(false);
            }
            else {
                setUnLock(true);
            }
        }
    }

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
                    // setSimpleModal(true)
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
                visible={unLock}
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
                                borderWidth: 1,
                                borderColor: 'grey',
                                borderRadius: 5,
                                height: 37,
                                marginTop: 5,
                                justifyContent: 'center',
                                color: 'black',

                            }}
                            value={checkPassLock}
                            onChangeText={txt => { setCheckPassLock(txt) }}
                            autoFocus
                            placeholder='Nhập mật khẩu'
                            placeholderTextColor={'grey'}
                            secureTextEntry={true}
                        >

                        </TextInput>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setUnLock(false)
                                    listChat = [] // bu'a 
                                }}>
                                <Text
                                    style={{ marginTop: 20, color: 'black', marginStart: 20, fontWeight: 'bold' }}>Hủy</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}></View>
                            <TouchableOpacity
                                onPress={() => {
                                    checkScurity();
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
                                    setOpenModal(!openModal)
                                }}
                            >
                                <Image
                                    source={require('../../front_end/icons/trash-can.png')}
                                    style={{ width: 22, height: 22, marginLeft: 20, tintColor: 'black', }}
                                />
                            </TouchableOpacity>
                            <Modal
                                visible={openModal}
                                animationType="fade"
                                transparent={true}
                            >
                                <View
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View
                                        style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, flexDirection: 'column', borderWidth: 0.3, borderColor: 'grey' }}>
                                        <Text
                                            style={{ color: 'black' }}>Bạn muốn xóa tin nhắn này</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setOpenModal(false)
                                                }}>
                                                <Text
                                                    style={{ marginTop: 20, color: 'black', marginStart: 20, fontWeight: 'bold' }}>Hủy</Text>
                                            </TouchableOpacity>
                                            <View style={{ flex: 1 }}></View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    deleteChat(item.userId);
                                                    setOpenModal(false)
                                                }}>
                                                <Text
                                                    style={{ marginTop: 20, color: 'blue', marginEnd: 20, fontWeight: 'bold' }}>Xóa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>

                    );
                }}
            />
        </View>
    );
};

export default Chat;