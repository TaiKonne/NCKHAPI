import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import VisitUser from '../VisitUser';
import GetPost from '../GetPost'
let userId = '';

const Profile = () => {
    const navigation = useNavigation();
    // image
    const [imageData, setImageData] = useState(null);
    const [imageWall, setImageWall] = useState('');
    const [imagePicked, setImagePicked] = useState(false);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');
    // selectedTab
    const [tabdefault, settabdefault] = useState(1)
    const [selectedTabPost, setSelectedTabPost] = useState(0);
    const [selectedTabFollower, setSelectedTabFollower] = useState(0);
    const [selectedTabFollowing, setSelectedTabFollowing] = useState(0);
    // follower
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    // bio
    const [bio, setBio] = useState('');
    // number
    const [numberPhone, setNumberPhone] = useState('');
    // info
    const [morInfo, setmorInfo] = useState(0);
    //address
    const [address, setAddress] = useState('');
    // Gender
    const [gender, setgender] = useState('');
    // mail
    const [mail, setMail] = useState('');
    // post
    const [PS, setPS] = useState([]);
    // name
    const [Name, setName] = useState('');
    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        userId = await AsyncStorage.getItem('USERID');
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                console.log('User exists: ', documentSnapshot.exists);
                let temp = [];
                if (documentSnapshot.exists) {
                    console.log('User data: ', documentSnapshot.data());
                    setUploadedPicUrl(documentSnapshot.data().profilePic);
                    setFollowers(documentSnapshot.data().followers);
                    setFollowing(documentSnapshot.data().following);
                    setBio(documentSnapshot.data().bio);
                    setNumberPhone(documentSnapshot.data().numberPhone);
                    setAddress(documentSnapshot.data().address);
                    setMail(documentSnapshot.data().email);
                    setImageWall(documentSnapshot.data().picWal);
                    temp = (documentSnapshot.data().posts);
                    setName(documentSnapshot.data().name);
                    setgender(documentSnapshot.data().gender);
                    console.log('data ', documentSnapshot.data().following);
                    temp.sort((a, b) => b.time - a.time);
                    setPS(temp);

                    let flo = followers;
                    let co = 0;
                    for (let i = 0; i < flo.length - 1; i++) {
                        for (let j = i + 1; j < flo.length; j++) {
                            if (flo[i].userId == flo[j].userId) {
                                co = 1;
                            }
                        }
                    }
                    if (co == 1) {
                        
                        const unique = flo.filter((obj, index) =>
                            flo.findIndex((item) => item.userId == obj.userId) == index
                        );
                        if (unique != null) {
                            
                            firestore()
                                .collection('Users')
                                .doc(userId)
                                .update({
                                    followers: unique,
                                })
                            setFollowers(unique);
                    
                        }
                    }
                    let flo1 = following;
                    let co1 = 0;
                    for (let i = 0; i < flo1.length - 1; i++) {
                        for (let j = i + 1; j < flo1.length; j++) {
                            if (flo1[i].userId == flo1[j].userId) {
                                co1 = 1;
                            }
                        }
                    }
                    if (co1 == 1) {
                        const unique1 = flo1.filter((obj, index) =>
                            flo1.findIndex((item) => item.userId == obj.userId) == index
                        );
                        if (unique1 != null) {
                            setFollowing(unique1);
                            firestore()
                                .collection('Users')
                                .doc(userId)
                                .update({
                                    following: unique1
                                })
                        }
                    }
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
        <>
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
                    Trang cá nhân
                </Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Setting');
                }}>
                    <Image source={require('../../front_end/icons/settings.png')}
                        style={{
                            height: 27,
                            width: 27,
                            marginEnd: 10,
                            tintColor: 'white',
                        }} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, marginBottom: 70 }}>
                {imageWall == '' ?
                    (<ImageBackground
                        source={require('../../front_end/hoa_giay_1.jpg')}
                        // source={{ uri: imageWall }}
                        style={{ width: '100%', height: 200, }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                alignSelf: 'center',
                                marginTop: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10,

                            }}>
                            {imagePicked == true && imageData != null ? (
                                <Image
                                    source={{ uri: imageData.assets[0].uri }}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            ) : UploadedPicUrl === '' ? (
                                <Image
                                    source={require('../images/user.png')}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            ) : (
                                <Image
                                    source={{ uri: UploadedPicUrl }}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            )}
                        </View>
                    </ImageBackground>) :
                    (<ImageBackground
                        // source={require('../../front_end/hoa_giay_1.jpg')}
                        source={{ uri: imageWall }}
                        style={{ width: '100%', height: 200 }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                alignSelf: 'center',
                                marginTop: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}>
                            {imagePicked == true && imageData != null ? (
                                <Image
                                    source={{ uri: imageData.assets[0].uri }}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            ) : UploadedPicUrl === '' ? (
                                <Image
                                    source={require('../images/user.png')}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            ) : (
                                <Image
                                    source={{ uri: UploadedPicUrl }}
                                    style={{ width: 120, height: 120, borderRadius: 60 }} />
                            )}
                        </View>
                    </ImageBackground>)}

                <Text style={{
                    alignItems: 'center',
                    fontSize: 20,
                    color: 'black',
                    // justifyContent:'center',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {Name}
                </Text>
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
                        {morInfo == 0 ? (<Text style={{ color: 'grey', fontSize: 12 }}>
                            Xem thêm
                        </Text>) :
                            (<Text style={{ color: 'grey', fontSize: 12 }}>
                                Ẩn bớt
                            </Text>)}
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
                    }}>
                        <Image source={require('../../front_end/icons/email.png')}
                            style={{
                                height: 18,
                                width: 18,
                                marginStart: 10,
                                tintColor: '#1877f2',
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
                    }}>
                        <Image source={require('../../front_end/icons/phone-call.png')}
                            style={{
                                height: 18,
                                width: 18,
                                marginStart: 10,
                                tintColor: 'green',
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
                    }}>
                        <Image source={require('../../front_end/icons/check-in.png')}
                            style={{
                                height: 18,
                                width: 18,
                                marginStart: 10,
                                // tintColor: 'black',
                            }} />
                        <Text style={{
                            color: 'black',
                            fontSize: 14,
                            paddingStart: 5,
                        }}>{address}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingVertical: 5,
                        alignItems: 'center',
                        marginStart: 20,
                        marginEnd: 20,
                    }}>
                        <Image source={require('../../front_end/icons/gender.png')}
                            style={{
                                height: 18,
                                width: 18,
                                marginStart: 10,
                                // tintColor: 'black',
                            }} />
                        <Text style={{
                            color: 'black',
                            fontSize: 14,
                            paddingStart: 5,
                        }}>{gender} </Text>
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
                            width: '33.3%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: (selectedTabPost == 1 || tabdefault == 1) ? '#fff' : 'rgba(0,0,0,0)',
                            flexDirection: 'column',
                        }}
                        onPress={() => {
                            setSelectedTabPost(1);
                            setSelectedTabFollower(0);
                            setSelectedTabFollowing(0);
                            settabdefault(0);
                        }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Bài viết của tôi</Text>
                        {/* chiều dài của post */}
                        <Text style={{ fontSize: 15, color: 'grey' }}>{PS.length}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: '33.3%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: selectedTabFollowing == 1 ? '#fff' : 'rgba(0,0,0,0)',
                            flexDirection: 'column'
                        }}
                        onPress={() => {
                            setSelectedTabPost(0);
                            setSelectedTabFollower(0);
                            setSelectedTabFollowing(1);
                            settabdefault(0);
                        }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Người theo dõi</Text>
                        <Text style={{ fontSize: 15, color: 'grey' }}>{followers.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: '33.3%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: selectedTabFollower == 1 ? '#fff' : 'rgba(0,0,0,0)',
                            flexDirection: 'column'
                        }}
                        onPress={() => {
                            setSelectedTabPost(0);
                            setSelectedTabFollower(1);
                            setSelectedTabFollowing(0);
                            settabdefault(0);
                        }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Đang theo dõi</Text>
                        <Text style={{ fontSize: 15, color: 'grey' }}>{following.length}</Text>
                    </TouchableOpacity>
                </View>
                {(selectedTabPost == 0 && tabdefault == 0) ? null : (
                    <FlatList
                        data={PS}
                        renderItem={({ item, index }) => {
                            return (
                                <GetPost cons={{ item: item, myId: userId, check: 1 }} />
                            );
                        }} />
                )}
                {selectedTabFollowing == 0 ? null : (
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
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            // Alert.alert('Nút vào profile người khác','Vào profile')
                                            navigation.navigate('VisitUser', item.userId);
                                        }}>
                                        <Image
                                            source={item.profilePic == ''
                                                ? require('../images/user.png')
                                                : { uri: item.profilePic }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                marginLeft: 20,
                                                marginRight: 10,
                                            }} />
                                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginRight: 20 }}
                                        onPress={() => {
                                            navigation.navigate('NewMessage', {
                                                data: {
                                                    userId: item.userId,
                                                    name: item.name,
                                                    myId: userId,
                                                    profilePic: item.profilePic == '' || item.profilePic == null
                                                        ? ''
                                                        : item.profilePic,
                                                },
                                            });
                                        }}>
                                        <Image
                                            source={require('../images/chat.png')}
                                            style={{ width: 24, height: 24, tintColor: 'orange' }} />
                                    </TouchableOpacity>
                                </View>
                            );
                        }} />
                )}
                {selectedTabFollower == 0 ? null : (
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
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            // Alert.alert('Nút vào profile người khác','Vào profile')
                                            navigation.navigate('VisitUser', item.userId);
                                        }}>
                                        <Image
                                            source={item.profilePic == ''
                                                ? require('../images/user.png')
                                                : { uri: item.profilePic }}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                marginLeft: 20,
                                                marginRight: 10,
                                            }} />
                                        <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginRight: 20 }}
                                        onPress={() => {
                                            navigation.navigate('NewMessage', {
                                                data: {
                                                    userId: item.userId,
                                                    name: item.name,
                                                    myId: userId,
                                                    profilePic: item.profilePic == '' || item.profilePic == null
                                                        ? ''
                                                        : item.profilePic,
                                                },
                                            });
                                        }}>
                                        <Image
                                            source={require('../images/chat.png')}
                                            style={{ width: 24, height: 24, tintColor: 'orange' }} />
                                    </TouchableOpacity>
                                </View>
                            );
                        }} />
                )}
            </ScrollView>
        </>
    );
};

export default Profile;