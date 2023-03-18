import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
let userId = '';
let names = '';

const Profile = () => {
    const navigation = useNavigation();
    const [imageData, setImageData] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [bio, setBio] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [morInfo, setmorInfo] = useState(0);
    const [address, setAddress] = useState('');
    const [mail, setMail] = useState('');
    useEffect(() => {
        getProfileData();
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
                    setBio(documentSnapshot.data().bio);
                    setNumberPhone(documentSnapshot.data().numberPhone);
                    setAddress(documentSnapshot.data().address);
                    setMail(documentSnapshot.data().email);
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
        saveProfileToStore(url);
        setImagePicked(false);
    };

    const saveProfileToStore = async url => {
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
    const getFollowStatus = followers => {
        let status = false;

        followers.map(item => {
            if (item.userId == userId) {
                status = true;
            } else {
                status = false;
            }
        });
        return status;
    };
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 60,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#8e8e8e',
                    alignItems: 'center',
                    backgroundColor: 'skyblue',
                    justifyContent: 'center',
                }}>
                <View style={{ flex: 1 }}></View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Profile
                </Text>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Setting')
                }}>
                    <Image source={require('../../front_end/icons/settings.png')}
                        style={{
                            height: 25,
                            width: 25,
                            marginEnd: 10,
                        }} />
                </TouchableOpacity>
            </View>
            <ImageBackground 
                source={require('../../front_end/hoa_giay_1.jpg')}
                style={{width:'100%', height:200}}    
            >
                <TouchableOpacity
                    style={{
                        width: 100,
                        height: 100,
                        alignSelf: 'center',
                        marginTop: 80,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom:10,
                    }}>
                    {
                        imagePicked == true && imageData != null ? (
                            <Image
                                source={{ uri: imageData.assets[0].uri }}
                                style={{ width: 120, height: 120, borderRadius: 60 }}
                            />
                        ) : UploadedPicUrl === '' ? (
                            <Image
                                source={require('../images/user.png')}
                                style={{ width: 120, height: 120, borderRadius: 60 }}
                            />
                        ) : (
                            <Image
                                source={{ uri: UploadedPicUrl }}
                                style={{ width: 120, height: 120, borderRadius: 60 }}
                            />
                        )}
                </TouchableOpacity>
            </ImageBackground>
            <Text style={{
                alignItems: 'center',
                fontSize: 20,
                color: 'black',
                // justifyContent:'center',
                textAlign: 'center',
            }}>
                {names}
            </Text>
            {/* edit avatars */}
            {/* <TouchableOpacity
                style={{
                    width: 200,
                    height: 40,
                    borderWidth: 0.3,
                    alignSelf: 'center',
                    borderRadius: 8,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'orange',
                }}
                onPress={() => {
                    // Remove set status of selected image here
                    // Reason: When you open a galary, user maybe not select any photo
                    // so it can make imageData to null => You must check that user has selected
                    // the photo or not. And then you'll set the status of selected and data of image.
                    if (imagePicked === false) {
                        openGallery();
                    } else {
                        uploadProfilePic();
                    }
                }}>
                <Text style={{ color: 'orange' }}>
                    {imagePicked === true ? 'Save Pic' : 'Edit Profile'}
                </Text>
            </TouchableOpacity> */}
            {/* Bio */}
            <View style={{
                alignSelf: 'center',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginStart: 20,
                marginEnd: 20,
            }}>
                <Text style={{
                    color: 'black',
                    textAlign: 'center',
                }}>
                    {bio}
                </Text>
            </View>
            {/* More  Information */}
            <TouchableOpacity onPress={() => {
                morInfo == 0 ? setmorInfo(1) : setmorInfo(0);

            }}
                style={{
                    alignSelf: 'center',
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'orange',
                }}
            >
                <View>
                    <Text style={{ color: 'grey' , fontSize:13}}>
                        More Information
                    </Text>
                </View>
            </TouchableOpacity>
            {morInfo == 1 ? (<View style={{
                borderWidth: 0.2,
                borderColor: 'grey',
                marginStart: 10,
                marginEnd: 10,
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 5,
                    alignItems: 'center',
                    marginStart: 20,
                    marginEnd: 20,
                }} >
                    <Image source={require('../../front_end/icons/mail.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 14,
                        paddingStart: 5,
                    }}>{mail} </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 5,
                    alignItems: 'center',
                    marginStart: 20,
                    marginEnd: 20,
                }} >
                    <Image source={require('../../front_end/icons/telephone.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 14,
                        paddingStart: 5,
                    }}>{numberPhone}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 5,
                    alignItems: 'center',
                    marginStart: 20,
                    marginEnd: 20,
                }} >
                    <Image source={require('../../front_end/icons/location.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                        }} />
                    <Text style={{
                        color: 'black',
                        fontSize: 14,
                        paddingStart: 5,
                    }}>{address}</Text>
                </View>
            </View>) : ""}
            {/* follower */}
            <View
                style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 20,
                }}>
                <TouchableOpacity
                    style={{
                        width: '50%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: selectedTab == 0 ? '#fff' : 'rgba(0,0,0,0)',
                    }}
                    onPress={() => {
                        setSelectedTab(0);
                    }}>
                    <Text style={{ fontSize: 18, color: 'black' }}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: '50%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: selectedTab == 1 ? '#fff' : 'rgba(0,0,0,0)',
                    }}
                    onPress={() => {
                        setSelectedTab(1);
                    }}>
                    <Text style={{ fontSize: 18, color: 'black' }}>Following</Text>
                </TouchableOpacity>
            </View>

            {selectedTab == 1 ? null : (
                <FlatList
                    data={followers}
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
                                <TouchableOpacity
                                    style={{ marginRight: 20 }}
                                    onPress={() => {
                                        navigation.navigate('NewMessage', {
                                            data: {
                                                userId: item.userId,
                                                name: item.name,
                                                myId: userId,
                                                profilePic:
                                                    item.profilePic == '' || item.profilePic == null
                                                        ? ''
                                                        : item.profilePic,
                                            },
                                        });
                                    }}>
                                    <Image
                                        source={require('../images/chat.png')}
                                        style={{ width: 24, height: 24, tintColor: 'orange' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            )}

            {selectedTab == 0 ? null : (
                <FlatList
                    data={following}
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
                                <TouchableOpacity
                                    style={{ marginRight: 20 }}
                                    onPress={() => {
                                        navigation.navigate('Messages', {
                                            data: item,
                                        });
                                    }}>
                                    <Image
                                        source={require('../images/chat.png')}
                                        style={{ width: 24, height: 24, tintColor: 'orange' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

export default Profile;