import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
let token = '';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('taichuotchuoi@gmail.com')
    const [password, setPassword] = useState('12345678')

    const checkLogin = () => { // build.gradle
        firestore()
            .collection('Users')
            // Filter results
            .where('email', '==', email)
            .get()
            .then(querySnapshot => {
                console.log(querySnapshot.docs);
                if (querySnapshot.docs.length > 0) {
                    if (querySnapshot.docs[0]._data.email === email &&
                        querySnapshot.docs[0]._data.password === password) {
                        // alert("Đăng nhập thành công!")
                        navigation.navigate('HomeSC')
                    }
                    else {
                        alert("Tài khoản hoặc mật khẩu đã sai hoặc không tồn tại tài khoản!")
                    }
                    console.log(
                        querySnapshot.docs[0]._data.email
                        + ' ' +
                        querySnapshot.docs[0]._data.password,
                    );
                }
                else {
                    console.log('account not found');
                }
                /* ... */
            }).catch(error => {
                console.log(error);
            });
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
            Login
        </Text>
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
                marginTop: 100,
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
                checkLogin();
            }}>
            <Text style={{
                color: 'black',
                fontSize: 20,
            }}>
                Login
            </Text>
        </TouchableOpacity>
        <Text style={{
            fontSize: 15,
            marginTop: 20,
            textDecorationLine: 'underline',
            color: 'black',
            alignSelf: 'center',
        }}
            onPress={() => {
                navigation.navigate('Signup');
            }}>
            New account: Signup</Text>
    </View>

}

export default Login;