import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';


const VisitUser = (props) => {
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
    const userID = props.route.params;

    //  Follow button :))) 
    const [buafl, setbuafl] = useState(0)

    useEffect(() => {
        getProfileVisit();
    }, 100);
    const getProfileVisit = async () => {
        firestore()
            .collection('Users')
            .doc(userID)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setUploadedPicUrl(documentSnapshot.data().profilePic);
                    setBio(documentSnapshot.data().bio);
                    setNumberPhone(documentSnapshot.data().numberPhone);
                    setAddress(documentSnapshot.data().address);
                    setMail(documentSnapshot.data().email);
                    setName(documentSnapshot.data().name);
                    setFollowers(documentSnapshot.data().followers);
                    setFollowing(documentSnapshot.data().following);
                }
            })
    }

    return (
        <View style={{
            flex: 1
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
                    Profile
                </Text>
                <View style={{ width: 50, height: 50 }} />
            </View>
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
                    {
                        imagePicked == true && imageData != null ? (
                            <Image
                                source={{ uri: imageData.assets[0].uri }}
                                style={{ width: 120, height: 120, borderRadius: 60 }}
                            />
                        ) : UploadedPicUrl === '' ? (
                            <Image
                                source={require('./images/user.png')}
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
                    buafl == 0 ? setbuafl(1) : setbuafl(0)
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
                    (<Text style={{ color: 'black', fontSize: 16, marginRight: 10, marginLeft: 10, marginTop: 5, marginBottom: 5 }}>Follow</Text>) : 
                    (<Text style={{ color: 'black', fontSize: 16, marginRight: 10, marginLeft: 10, marginTop: 5, marginBottom: 5 }}>Unfollow</Text>)}
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
                    <Text style={{ color: 'grey', fontSize: 13 }}>
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
                    <Image source={require('../front_end/icons/mail.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'black',
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
                    <Image source={require('../front_end/icons/telephone.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'black',
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
                    <Image source={require('../front_end/icons/location.png')}
                        style={{
                            height: 18,
                            width: 18,
                            marginStart: 10,
                            tintColor: 'black',
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
                                                ? require('./images/user.png')
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
                                                ? require('./images/user.png')
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
                            </View>
                        );
                    }}
                />
            )}
        </View>
    )
}

export default VisitUser;