import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Switch,
    toggleSwitch,
    TextInput,
    Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Loader from './common/Loader';
import { Title } from 'react-native-paper';

function Setting(props) {
    const navigation = useNavigation();
    const [language, setlanguage] = useState('Vietnamese')

    const [usernames, setUsernames] = useState(0)
    const [nameUser, setNameUser] = useState('');

    const [gender, setGender] = useState('')
    // const [genderUser, setgenderUser] = useState('');
    const [Genderview, setGenderview] = useState(0)

    const [oldPass, setOldPass] = useState('');
    const [changepassword, setchangepassword] = useState(0);
    const [passUser, setPassUser] = useState(''); // check pass hien tai == pass api
    const [reType1, setreType1] = useState('');
    const [reType2, setreType2] = useState('');

    const [bio, setbio] = useState(0);// update bio
    const [upBio, setUpBio] = useState('');

    const [phoneInput, setPhoneInput] = useState(0) //update number phone
    const [upPhone, setUpPhone] = useState('');

    const [emailInput, setEmailInput] = useState(0) //mail

    const [addressInput, setAddressInput] = useState(0) // update address
    const [upAddress, setUpAddress] = useState('');

    // verify chat 
    const [isEnabledChangePassword2factor, setEnabledChangePassword2factor] = useState(false)
    const [check2factor, setCheck2factor] = useState(false)
    const [isEnabledFingerprint, setEnabledFingerprint] = useState(false)
    const [passClass2, setPassClass2] = useState('');
    const [unLock, setUnLock] = useState(false);
    // test change avatar
    const [imageData, setImageData] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');

    const [imageData1, setImageData1] = useState(null);
    const [imagePicked1, setImagePicked1] = useState(false);
    const [UploadedPicUrl1, setUploadedPicUrl1] = useState('');

    useEffect(() => {
        getProfileData();
        showLock();
    }, []);

    const getProfileData = async () => {
        userId = await AsyncStorage.getItem('USERID');
        names = await AsyncStorage.getItem('NAME');
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                console.log('User exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    console.log('User data: ', documentSnapshot.data());
                    setUploadedPicUrl(documentSnapshot.data().profilePic);
                    setFollowers(documentSnapshot.data().followers);
                    setFollowing(documentSnapshot.data().following);
                    console.log('data ', documentSnapshot.data().following);
                }
            });
    };
    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo' });

        setImageData(result);
        console.log(result);
    };
    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        console.log("User selected image " + JSON.stringify(result));

        // Check is user select picture yet
        if (result.assets != null || result.didCancel == false) {
            setImagePicked(true);
            setImageData(result);
        }
    };
    const uploadProfilePic = async () => {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();

        // Reset image url when uploaded
        // Fix image auto change to old image before new image was uploaded
        setUploadedPicUrl(url);
        LưuProfileToStore(url);
        setImagePicked(false);
    };

    const verifyPass2 = async () => { // update mk
        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                passSecurity2Layer: passClass2,
            })
    }

    const showLock = async () => { //
        // debugger
        const userId = await AsyncStorage.getItem("USERID");
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(Snap => {
                // debugger
                if (Snap._data.passSecurity2Layer != '') {
                    // debugger
                    setUnLock(true);
                    setEnabledChangePassword2factor(true);
                }
            })
    }

    const LưuProfileToStore = async url => {
        const userId = await AsyncStorage.getItem('USERID');
        console.log(userId, ' ' + url);
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                profilePic: url,
            })
            .then(() => {
                console.log('profile updated!');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const openGallery1 = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        console.log("User selected image " + JSON.stringify(result));

        // Check is user select picture yet
        if (result.assets != null || result.didCancel == false) {
            setImagePicked1(true);
            setImageData1(result);
        }
    };
    const uploadProfilePic1 = async () => {
        const reference = storage().ref(imageData1.assets[0].fileName);
        const pathToFile = imageData1.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData1.assets[0].fileName)
            .getDownloadURL();

        // Reset image url when uploaded
        // Fix image auto change to old image before new image was uploaded
        setUploadedPicUrl1(url);
        LưuProfileToStore1(url);
        setImagePicked1(false);
    };

    const LưuProfileToStore1 = async url => {
        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                picWal: url,
            })
            .then(() => {
                console.log('profile updated!');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const updateBio = async () => {
        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                bio: upBio,
            })
            .then(() => {
                console.log('update bio!!')
            })
            .catch(error => {
                console.log(error);
            })
    }
    const updatePhone = async () => {
        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                numberPhone: upPhone,
            })
            .then(() => {
                console.log('update number phone!!')
            })
            .catch(error => {
                console.log(error);
            })
    }

    const updateAddress = async () => {
        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                address: upAddress,
            })
            .then(() => {
                console.log('update Address!!')
            })
            .catch(error => {
                console.log(error);
            })
    }

    const updateName = async () => {

        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                name: nameUser,
            })
            .then(() => {
                console.log('change name thanh cong');
                firestore()
                    .collection('posts')
                    .doc()

            })
            .catch(error => {
                console.log(error);
            });
    }
    const updateGender = async () => {

        firestore()
            .collection('Users')
            .doc(userId)
            .update({
                gender: gender,
            })
            .then(() => {
                console.log('Update gender');

            })
            .catch(error => {
                console.log(error);
            });
    }
    const updatePass = async () => { // && (reType1 === reType2 && reType1 !== passUser

        const userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setOldPass(documentSnapshot.data().password);
                    // console.log('pass', documentSnapshot.data().password);
                }
            })

        if (oldPass === passUser) {
            if (reType1 !== passUser) {
                if (reType1 === reType2) {
                    firestore()
                        .collection('Users')
                        .doc(userId)
                        .update({
                            password: reType1,
                        })
                        .then(() => {
                            console.log('Đổi mật khẩu thành công');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                else {
                    Alert.alert('', 'Mật khẩu mới phải trùng khớp');
                }
            }
            else {
                Alert.alert('', 'Mật khẩu mới phải khác mật khẩu hiện tại.')
            }
        }
        else {
            Alert.alert('', 'Mật khẩu hiện tại không đúng');
        }
    }

    return <View style={{
        flex: 1,
        backgroundColor: 'white',
    }}>
        <View
            style={{
                height: 60,
                backgroundColor: 'skyblue',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('HomeSC')
            }}>
                <Image source={require('../front_end/icons/left.png')}
                    style={{
                        height: 25,
                        width: 25,
                        padding: 10,
                        marginStart: 10,
                        tintColor: 'white',
                    }} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                Cài đặt
            </Text>
            <View style={{ width: 50, height: 50 }} />
        </View>
        <ScrollView>
            {/* language */}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Ngôn ngữ</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <TouchableOpacity
                onPress={() => {
                    if (language == 'English')
                        setlanguage('Vietnamese')
                    else
                        setlanguage('English')
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/language.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'black',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>Ngôn ngữ mặc định</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Text style={{
                        color: 'grey',
                        fontSize: 15,
                        paddingStart: 10,
                        paddingEnd: 10
                    }}>{language}</Text>
                </View>
            </TouchableOpacity>
            {/* Infor */}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Thông tin cá nhân</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* userName */}
            <TouchableOpacity onPress={() => {
                usernames == 0 ? setUsernames(1) : setUsernames(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/id-card.png')}
                        style={{
                            height: 20,
                            width: 20,
                            marginStart: 10,
                            tintColor: '#eb660d',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>Tên người dùng</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            {usernames == 1 ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10
                        }}
                        value={nameUser}
                        onChangeText={txt => {
                            setNameUser(txt);
                        }}
                        autoFocus
                        placeholder='Nhập tên mới'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            if (nameUser != '') {
                                setUsernames(0);
                                updateName();
                            }
                            else {
                                Alert.alert('', 'Username không được để trống!');
                                setUsernames(0);
                            }
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height: 35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Change Avatars */}
            <TouchableOpacity
                onPress={() => {
                    // alert('change avatars')
                    if (imagePicked === false) {
                        openGallery();
                    } else {
                        uploadProfilePic();
                    }
                }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../Screens/images/user.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>
                        {imagePicked === true ? 'Lưu thay đổi' : 'Ảnh đại diện'}
                    </Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Change background img */}
            <TouchableOpacity
                onPress={() => {
                    // alert('change avatars')
                    if (imagePicked1 === false) {
                        openGallery1();
                    } else {
                        uploadProfilePic1();
                    }
                }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/picture.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            // tintColor: 'black',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>
                        {imagePicked1 === true ? 'Lưu thay đổi' : 'Ảnh bìa'}
                    </Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Bio */}
            <TouchableOpacity onPress={() => {
                bio == 0 ? setbio(1) : setbio(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/bio.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'black',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,

                    }}>Tiểu sử</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />

                </View>
            </TouchableOpacity>
            {bio == 1 ? (
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10,
                        }}
                        value={upBio}
                        onChangeText={txt => {
                            setUpBio(txt);
                        }}
                        autoFocus
                        placeholder='Nhập tiểu sử mới'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        flex: 1,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setbio(0);
                            updateBio();
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                marginEnd: 30,
                                height: 35

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Gender */}
            <TouchableOpacity
                onPress={() => {
                    Genderview == 0 ? setGenderview(1) : setGenderview(0)
                }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/gender.png')}
                        style={{
                            height: 20,
                            width: 20,
                            marginStart: 10,
                            // tintColor: 'pink',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>Giới tính</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            {Genderview == 1 ? <View style={{
                flex: 1,
                flexDirection: 'row'
            }}>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        width: 250,
                        height: 35,
                        marginStart: 30,
                        justifyContent: 'center'
                    }}>
                    <Picker
                        selectedValue={gender}
                        style={{
                            flex: 1,
                            color: 'black',
                            fontWeight: 'bold',
                            opacity: 0.3,
                            height: 40,
                        }}
                        value={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                    >
                        <Picker.Item label="Lựa chọn" value=" " />
                        <Picker.Item label="Nam" value="Nam" />
                        <Picker.Item label="Nữ" value="Nữ" />
                        <Picker.Item label="Khác" value="Khác" />
                    </Picker>
                </View>
                <TouchableOpacity onPress={() => {
                    setGenderview(0)
                    updateGender()
                }}>
                    <View style={{
                        alignSelf: 'flex-end',
                        borderWidth: 0.2,
                        borderRadius: 5,
                        backgroundColor: 'skyblue',
                        marginStart: 6.5,
                        marginEnd: 30,
                        height: 35,
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 15,
                            padding: 5,
                            fontWeight: 'bold',
                        }}> Lưu </Text>
                    </View>
                </TouchableOpacity>
            </View> : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold',
                }}>Thông tin liên hệ</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Email */}
            <TouchableOpacity onPress={() => {
                emailInput == 0 ? setEmailInput(1) : setEmailInput(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/email.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: '#1877f2',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,

                    }}>Email</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />

                </View>
            </TouchableOpacity>
            {emailInput == 1 ? (
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10,
                        }}
                        autoFocus
                        placeholder='Nhập địa chỉ mail mới'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        flex: 1,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setEmailInput(0)
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                marginEnd: 30,
                                height: 35

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Phone number */}
            <TouchableOpacity onPress={() => {
                phoneInput == 0 ? setPhoneInput(1) : setPhoneInput(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/phone-call.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'green',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,

                    }}>Số điện thoại</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            {phoneInput == 1 ? (
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10,
                        }}
                        autoFocus
                        value={upPhone}
                        onChangeText={txt => {
                            setUpPhone(txt);
                        }}
                        placeholder='Nhập số điện thoại mới'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        flex: 1,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setPhoneInput(0)
                            updatePhone();
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                marginEnd: 30,
                                height: 35

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Address */}
            <TouchableOpacity onPress={() => {
                addressInput == 0 ? setAddressInput(1) : setAddressInput(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/check-in.png')}
                        style={{
                            height: 22,
                            width: 22,
                            marginStart: 10,
                            // tintColor: 'black',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,

                    }}>Địa chỉ</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            {addressInput == 1 ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10,
                        }}
                        autoFocus
                        value={upAddress}
                        onChangeText={txt => {
                            setUpAddress(txt);
                        }}
                        placeholder='Nhập địa chỉ mới'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setAddressInput(0)
                            updateAddress();
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height: 35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',
                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Bảo mật</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Đổi mật khẩu */}
            <TouchableOpacity onPress={() => {
                changepassword == 0 ? setchangepassword(1) : setchangepassword(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/padlock.png')}
                        style={{
                            height: 20,
                            width: 18,
                            marginStart: 10,
                            tintColor: '#f79f00',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,

                    }}>Đổi mật khẩu</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Image source={require('../front_end/icons/exchange.png')}
                        style={{
                            height: 17,
                            width: 17,
                            marginEnd: 10,
                            tintColor: 'black',
                        }} />
                </View>
            </TouchableOpacity>
            {changepassword == 1 ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'column',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            marginBottom: 10,
                            borderRadius: 10,
                        }}
                        autoFocus
                        placeholder='Nhập mật khẩu cũ'
                        placeholderTextColor={'grey'}
                        value={passUser}
                        onChangeText={txt => {
                            setPassUser(txt);
                        }}
                    />
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            marginBottom: 10,
                            borderRadius: 10,
                        }}
                        autoFocus
                        placeholder='Nhập mật khẩu mới'
                        placeholderTextColor={'grey'}
                        value={reType1}
                        onChangeText={txt => {
                            setreType1(txt);
                        }}
                    />
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            marginBottom: 10,
                            borderRadius: 10,
                        }}
                        autoFocus
                        placeholder='Nhập lại mật khẩu mới'
                        placeholderTextColor={'grey'}
                        value={reType2}
                        onChangeText={txt => {
                            setreType2(txt);
                        }}
                    />

                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setchangepassword(0);
                            updatePass();
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height: 35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}> Lưu </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Bảo mật 2 lớp */}
            <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                alignItems: 'center'
            }} >
                <Image source={require('../front_end/icons/two-factor-authentication.png')}
                    style={{
                        height: 20,
                        width: 20,
                        marginStart: 10,
                        // tintColor: 'black',
                    }} />
                <Text style={{
                    color: 'black',
                    fontSize: 15,
                    paddingStart: 5,

                }}>Bảo mật tin nhắn</Text>
                <View style={{ flex: 1 }} ></View>
                <Switch
                    trackColor={{ false: 'grey', true: 'skyblue' }}
                    thumbColor={isEnabledChangePassword2factor ? 'skyblue' : 'grey'}
                    onValueChange={() => {
                        isEnabledChangePassword2factor == false
                            ? (
                                setEnabledChangePassword2factor(true),
                                setCheck2factor(true)
                            ) : (setEnabledChangePassword2factor(false))
                    }}
                    value={isEnabledChangePassword2factor}
                    style={{
                        paddingEnd: 10
                    }}
                />
            </View>
            {check2factor == true ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            height: 37,
                            width: 250,
                            color: 'black',
                            borderRadius: 10,
                        }}
                        autoFocus
                        value={passClass2}
                        onChangeText={txt => {
                            setPassClass2(txt); //aaa
                        }}
                        placeholder='Nhập mật khẩu bảo mật'
                        placeholderTextColor={'grey'}
                    />
                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setCheck2factor(false)
                            verifyPass2();
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height: 35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',
                                }}> Đặt </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            {/* Đăng nhập bằng vân tay */}
            <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                alignItems: 'center'
            }} >
                <Image source={require('../front_end/icons/fingerprint.png')}
                    style={{
                        height: 20,
                        width: 20,
                        marginStart: 10,
                        tintColor: 'blue',
                    }} />
                <Text style={{
                    color: 'black',
                    fontSize: 15,
                    paddingStart: 5,

                }}>Vân tay</Text>
                <View style={{ flex: 1 }} ></View>
                <Switch
                    trackColor={{ false: 'grey', true: 'skyblue' }}
                    thumbColor={isEnabledFingerprint ? 'skyblue' : 'grey'}
                    onValueChange={() => {
                        setEnabledFingerprint(!isEnabledFingerprint)
                    }}
                    value={isEnabledFingerprint}
                    style={{
                        paddingEnd: 10
                    }}
                />
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>khác</Text>
            </View>
            <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', opacity: 0.3 }}></View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Login')
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Image source={require('../front_end/icons/logout.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'blue',
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 5,
                    }}>Đăng xuất</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    </View>
}
export default Setting;