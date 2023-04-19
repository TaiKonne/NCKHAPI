import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './common/Loader';
import uuid from 'react-native-uuid';
let token = '';
const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [SimpleModal, setSimpleModal] = useState(false);
    useEffect(() => {
        getFcmToken();
    }, []);
    const getFcmToken = async () => {
        token = await messaging().getToken();
        console.log(token);
    };
    const saveData = () => {
        let id = uuid.v4();
        setModalVisible(true);
        firestore()
            .collection('Users')
            .doc(id)
            .set({
                email: email,
                password: password,
                name: name,
                token: token,
                userId: id,
                followers: [],
                following: [],
                posts: [],
                profilePic: '',
                picWall: '',
                bio: '',
                address: '',
                numberPhone: '',
                gender: '',
                chatList: [],
            })
            .then(() => {
                console.log('User added!');
            });
        firestore()
            .collection('tokens')
            .add({
                token: token,
            })
            .then(() => {
                setModalVisible(false);
                console.log('User added!');
                saveLocalData();
                navigation.goBack();
            });
        setModalVisible(false);
    };
    const saveLocalData = async () => {
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        await AsyncStorage.setItem('PASS', password);
        await AsyncStorage.setItem('ADD', address);
        await AsyncStorage.setItem('PHONE', numberPhone);
        await AsyncStorage.setItem('BIO', bio);
        await AsyncStorage.setItem('PICWAL', picWal);
        await AsyncStorage.setItem('POSTS', posts);
        // await AsyncStorage.setItem('PROFILE_PIC', profilePic);
    };
    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    alignSelf: 'center',
                    marginTop: 100,
                    fontSize: 25,
                    fontWeight: '800',
                    color: 'red',
                }}>
                Đăng ký tài khoản
            </Text>
            <TextInput
                value={name}
                onChangeText={txt => {
                    setName(txt);
                }}
                placeholder="Nhập họ và tên của bạn"
                placeholderTextColor={'grey'}
                style={{
                    width: '84%',
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    paddingLeft: 15,
                    marginTop: 100,
                    color: 'black'
                }}
            />
            <TextInput
                value={email}
                onChangeText={txt => {
                    setEmail(txt);
                }}
                placeholder="Nhập email của bạn"
                placeholderTextColor={'grey'}
                style={{
                    width: '84%',
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    paddingLeft: 15,
                    marginTop: 20,
                    color: 'black'
                }}
            />
            <TextInput
                value={password}
                onChangeText={txt => {
                    setPassword(txt);
                }}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor={'grey'}
                style={{
                    width: '84%',
                    height: 50,
                    paddingLeft: 15,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginTop: 20,
                    color: 'black'
                }}
            />
            <TouchableOpacity
                style={{
                    width: '84%',
                    height: 50,
                    backgroundColor: 'orange',
                    borderRadius: 10,
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}
                onPress={() => {
                    setSimpleModal(true);
                }}>
                <Text style={{ fontSize: 20, color: '#000' }}>Đăng ký</Text>
            </TouchableOpacity>
            {/* <Modal
                visible={SimpleModal}
                animationType="fade"
                transparent={true}
            >
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, flexDirection: 'column', borderWidth: 0.3, borderColor: 'grey' }}>
                        <Text
                            style={{ color: 'black' }}>Xác nhận đăng ký tài khoản?</Text>
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
                                    saveData();
                                    navigation.navigate('Introduction')
                                }}>
                                <Text
                                    style={{ marginTop: 20, color: 'blue', marginEnd: 20, fontWeight: 'bold' }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal> */}
            <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

export default Signup;