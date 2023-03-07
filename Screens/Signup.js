import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
let token = '';

const Signup = ({ navigation }) => {
    const [name, setName] = useState('Tai')
    const [email, setEmail] = useState('taichuotchuoi@gmail.com')
    const [password, setPassword] = useState('12345678')
    useEffect(() => {
        getFcmToken();
    }, []);

    const getFcmToken = async () => {
        token = await messaging().getToken();
        console.log(token);
    }

    const saveData = () => {
        firestore()
            .collection('Users')
            .add({
                name: name,
                email: email,
                password: password,
                token: token,
            })
            .then(() => {

                console.log('User added!');
                saveLocalData();
                navigation.goBack();
            });
    }
    const saveLocalData = async () => {
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('EMAIL', email);
        // await AsyncStorage.setItem('TOKEN', token);
    }
    return <View style={{ flex: 1 }}>
        <Text style={{
            color: 'black',
            // backgroundColor: 'red',
            alignSelf: 'center',
            marginTop: 100,
            fontSize: 20,
            fontWeight: '800',
        }}>
            Signup
        </Text>
        <TextInput
            value={name}
            onChangeText={ten => {
                setName(ten);
            }}
            placeholder='Nhập tên của bạn...'
            placeholderTextColor={'gray'}
            style={{
                color: 'black',
                paddingLeft: 15,
                width: '80%',
                height: 50,
                borderRadius: 10,
                borderWidth: 0.5,
                alignSelf: 'center',
                marginTop: 20,
            }} />

        <TextInput
            value={email}
            onChangeText={txt => {
                setEmail(txt);
            }}
            placeholder='Nhập email...'
            placeholderTextColor={'gray'}
            style={{
                color: 'black',
                paddingLeft: 15,
                width: '80%',
                height: 50,
                borderRadius: 10,
                borderWidth: 0.5,
                alignSelf: 'center',
                marginTop: 20,
            }} />
        <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={txt => {
                setPassword(txt);
            }}
            placeholder='Nhập mật khẩu...'
            placeholderTextColor={'gray'}
            style={{
                color: 'black',
                paddingLeft: 15,
                width: '80%',
                height: 50,
                borderRadius: 10,
                borderWidth: 0.5,
                alignSelf: 'center',
                marginTop: 20,
            }} />
        <TouchableOpacity style={{
            width: '50%',
            height: 50,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
        }}
            onPress={() => {
                saveData();
            }}>
            <Text style={{
                color: 'black',
                fontSize: 20,
            }}>
                Register
            </Text>
        </TouchableOpacity>
    </View>

}

export default Signup;