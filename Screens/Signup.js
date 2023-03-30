import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
                Register
            </Text>
            <TextInput
                value={name}
                onChangeText={txt => {
                    setName(txt);
                }}
                placeholder="Enter Name"
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
                placeholder="Enter Email Id"
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
                placeholder="Enter Password"
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
                    saveData();
                }}>
                <Text style={{ fontSize: 20, color: '#000' }}>Sign up</Text>
            </TouchableOpacity>
            <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

export default Signup;