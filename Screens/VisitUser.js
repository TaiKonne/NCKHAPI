import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import GetPost from './GetPost';

const VisitUser = (props) => {

    // <GetPost cons={{ item: item, myId: userId }} />
    const navigation = useNavigation();
    const [imageData, setImageData] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);
    const [UploadedPicUrl, setUploadedPicUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [bio, setBio] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [numberPhone, setNumberPhone] = useState('');
    const [morInfo, setmorInfo] = useState(0);
    const [address, setAddress] = useState('');
    const [mail, setMail] = useState('');
    const [name, setName] = useState([]);
    const [gender,setGender] = useState('');
    const [PS, setPS] = useState([]);
    const userId = props.route.params;

    //  Follow button :))) 
    const [buafl, setbuafl] = useState(0)
    //  selectedTab
    const [tabdefault, settabdefault] = useState(1)
    const [selectedTabPost, setSelectedTabPost] = useState(0);
    const [selectedTabFollower, setSelectedTabFollower] = useState(0);
    const [selectedTabFollowing, setSelectedTabFollowing] = useState(0);

    useEffect(() => {
        getProfileVisit();
    }, 100);
    const getProfileVisit = async () => {
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setUploadedPicUrl(documentSnapshot.data().profilePic);
                    setBio(documentSnapshot.data().bio);
                    setNumberPhone(documentSnapshot.data().numberPhone);
                    setAddress(documentSnapshot.data().address);
                    setMail(documentSnapshot.data().email);
                    setName(documentSnapshot.data().name);
                    setGender(documentSnapshot.data().gender);
                    setFollowers(documentSnapshot.data().followers);
                    setFollowing(documentSnapshot.data().following);
                    setPS(documentSnapshot.data().posts);
                }
            })
    }

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
                <TouchableOpacity onPress={() => {
                    navigation.navigate('HomeSC');
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
                    {name}
                </Text>
                <View style={{ width: 50, height: 50 }} />
            </View>
            <ScrollView style={{
                flex: 1
            }}>
                <ImageBackground
                    source={require('../front_end/hoa_giay_1.jpg')}
                    style={{ width: '100%', height: 200 }}
                >
                    <TouchableOpacity
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
                                source={require('./images/user.png')}
                                style={{ width: 120, height: 120, borderRadius: 60 }} />
                        ) : (
                            <Image
                                source={{ uri: UploadedPicUrl }}
                                style={{ width: 120, height: 120, borderRadius: 60 }} />
                        )}
                    </TouchableOpacity>
                </ImageBackground>
                <Text style={{
                    alignItems: 'center',
                    fontSize: 20,
                    color: 'black',
                    // justifyContent:'center',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {name}
                </Text>
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
                {/* bùa follow button */}
                <TouchableOpacity
                    onPress={() => {
                        buafl == 0 ? setbuafl(1) : setbuafl(0);
                    }}
                    style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'skyblue',
                        borderWidth: 0.2,
                        backgroundColor: 'skyblue',
                        borderRadius: 10
                    }}>
                    {buafl == 0 ?
                        (<Text style={{ color: 'black', fontSize: 16, marginRight: 10, marginLeft: 10, marginTop: 5, marginBottom: 5 }}>Theo dõi</Text>) :
                        (<Text style={{ color: 'black', fontSize: 16, marginRight: 10, marginLeft: 10, marginTop: 5, marginBottom: 5 }}>Bỏ theo dõi</Text>)}
                </TouchableOpacity>
                {/* More  Information */}
                <TouchableOpacity onPress={() => {
                    morInfo == 0 ? setmorInfo(1) : setmorInfo(0);

                }}
                    style={{
                        alignSelf: 'center',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
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
                        <Image source={require('../front_end/icons/email.png')}
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
                        <Image source={require('../front_end/icons/phone-call.png')}
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
                        <Image source={require('../front_end/icons/check-in.png')}
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
                        <Image source={require('../front_end/icons/gender.png')}
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
                        }}>{gender}</Text>
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
                            flexDirection: 'column'
                        }}
                        onPress={() => {
                            setSelectedTabPost(1);
                            setSelectedTabFollower(0);
                            setSelectedTabFollowing(0);
                            settabdefault(0);
                        }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Bài viết gần đây</Text>
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
                                <GetPost cons={{ item: item, myId: userId }} />
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
                                                ? require('./images/user.png')
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
                                                ? require('./images/user.png')
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
                                            source={require('./images/chat.png')}
                                            style={{ width: 24, height: 24, tintColor: 'orange' }} />
                                    </TouchableOpacity>
                                </View>
                            );
                        }} />
                )}
            </ScrollView>
        </>
    )
}

export default VisitUser;