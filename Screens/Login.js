import { View, Text, TextInput, TouchableOpacity , Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Loader from './common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
let token = '';
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('nguyenquocdung26032003@gmail.com');
    const [password, setPassword] = useState('1');
    const [modalVisible, setModalVisible] = useState(false);

    const [checkSignup , setCheckSignUp] = useState(0);

    const checkLogin = () => {
        if (email !== '' && password !== '') {
            setModalVisible(true);
            firestore()
                .collection('Users')
                // Filter results
                .where('email', '==', email)
                .get()
                .then(querySnapshot => {
                    console.log(querySnapshot.docs);
                    setModalVisible(false);
                    if (querySnapshot.docs.length > 0) {
                        if (
                            querySnapshot.docs[0]._data.email === email &&
                            querySnapshot.docs[0]._data.password === password
                        ) {
                            // alert('user logged in successfully !');
                            // firestore()
                            //   .collection('tokens')
                            //   .add({
                            //     token: token,
                            //     email: email,
                            //   })
                            //   .then(() => {
                            goToHome(
                                querySnapshot.docs[0]._data.userId,
                                querySnapshot.docs[0]._data.name,
                                querySnapshot.docs[0]._data.profilePic,
                            );
                            // });
                        } else {
                            Alert.alert('Login','email id or password may wrong ');
                        }
                        console.log(
                            querySnapshot.docs[0]._data.email +
                            ' ' +
                            querySnapshot.docs[0]._data.password +
                            ' ' +
                            querySnapshot.docs[0]._data.profilePic,
                        );
                    } else {
                        console.log('account not found');
                        Alert.alert('Login','account not found');
                    }
                })
                .catch(error => {
                    setModalVisible(false);
                    console.log(error);
                });
        } else {
            alert('Please Enter Details');
        }
    };
    useEffect(() => {
        getFcmToken();
    }, []);
    const getFcmToken = async () => {
        token = await messaging().getToken();
        console.log(token);
    };
    const goToHome = async (userId, name, profilePic) => {
        await AsyncStorage.setItem('USERID', userId);
        await AsyncStorage.setItem('NAME', name);
        await AsyncStorage.setItem('PROFILE_PIC', profilePic);
        navigation.navigate('HomeSC');
    };

    // useEffect(() => {
    //   getChats();
    // }, []);

    // const getChats = () => {
    //   firestore()
    //     .collection('chats')
    //     .doc('138f5680-73ba-4174-bb49-a4831b5d46c5')
    //     .onSnapshot(documentSnapshot => {
    //       console.log('User data: ', documentSnapshot._data.chatList);
    //     });
    // };
    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    alignSelf: 'center',
                    marginTop: 100,
                    fontSize: 20,
                    fontWeight: '800',
                    color:'red',
                }}>
                WelCome to TDMU Social Media
            </Text>
            <TextInput
                value={email}
                onChangeText={txt => {
                    setEmail(txt);
                }}
                placeholder="Enter your Email"
                placeholderTextColor={'grey'}
                style={{
                    width: '84%',
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    paddingLeft: 15,
                    marginTop: 100,
                    color:'black',
                }}
            />
            <TextInput
                value={password}
                onChangeText={txt => {
                    setPassword(txt);
                }}
                placeholder="Enter your Password"
                placeholderTextColor={'grey'}
                style={{
                    width: '84%',
                    height: 50,
                    paddingLeft: 15,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: 'center',
                    marginTop: 20,
                    color:'black',
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
                    checkSignup == 1 ? navigation.navigate('Introduction') : ''
                    checkLogin();
                }}>
                <Text style={{ fontSize: 20, color: '#000' }}>Login</Text>
            </TouchableOpacity>
            <Text
                style={{
                    fontSize: 18,
                    marginTop: 30,
                    textDecorationLine: 'underline',
                    alignSelf: 'center',
                    color:'black',
                }}
                onPress={() => {
                    navigation.navigate('Signup');
                    setCheckSignUp(1);
                }}>
                Create New Account
            </Text>
            <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};
export default Login;