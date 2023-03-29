import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UpName from './UpName';
import UpAv from './UpAv';
import { request } from 'express';
let userId = '';
const Home = (props) => {
    //props;
    const navigation = useNavigation();
    const [onLikeClick, setOnLikeCLick] = useState(false);
    const isFocused = useIsFocused();
    const [postData, setPostData] = useState([]);
    const [upCap, setUpCap] = useState('');
    useEffect(() => {
        getUserId();
        getData();
    }, 1000);
    const getUserId = async () => {
        userId = await AsyncStorage.getItem('USERID');
    };
    const getData = () => {
        let tempData = [];
        const subscriber = firestore()
            .collection('posts')
            .get()
            .then(querySnapshot => {
                console.log('Total posts: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    tempData.push(documentSnapshot.data());
                    console.log(
                        'User ID: ',
                        documentSnapshot.id,
                        documentSnapshot.data(),
                    );
                });
                tempData.sort((a, b) => b.createdAt - a.createdAt);
                setPostData(tempData);
            });
        return () => subscriber();
    };

    const onLike = item => {
        let tempLikes = item.likes;
        if (tempLikes.length > 0) {
            tempLikes.map(item1 => {
                if (userId === item1) {
                    const index = tempLikes.indexOf(item1);
                    if (index > -1) {
                        // only splice array when item is found
                        tempLikes.splice(index, 1); // 2nd parameter means remove one item only
                    }
                } else {
                    console.log('diliked');
                    tempLikes.push(userId);
                }
            });
        } else {
            tempLikes.push(userId);
        }

        console.log(tempLikes);
        firestore()
            .collection('posts')
            .doc(item.postId)
            .update({
                likes: tempLikes,
            })
            .then(() => { })
            .catch(error => { });
        setOnLikeCLick(!onLikeClick);
    };

    const getLikesStaus = likes => {
        let status = false;
        likes.map(item => {
            if (item === userId) {
                status = true;
            } else {
                status == false;
            }
        });
        return status;
    };

    const [checkpost, setpost] = useState(0)
    const coverTime = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();// phút
        let hh = date.getHours(); // giờ
        date = dd + '/' + mm + '/' + yyyy;
        return date;
    }

    // update posts
    const deletePost = async link_post => {
        firestore()
            .collection('posts')
            .doc(link_post)
            .delete()
            .then(() => {
                deletePostProfile(link_post);
            })
    }

    const deletePostProfile = async link_post => {
        let temp = [];
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(item => {
                let temp1 = [];
                temp = item._data.posts;
                temp.map(item1 => {
                    if (item1.postId !== link_post) {
                        temp1.push(item1);
                    }
                })
                firestore()
                    .collection('Users')
                    .doc(userId)
                    .update({
                        posts: temp1,
                    })
            })
    }


    const updatePost = async link_post => {
        firestore()
            .collection('posts')
            .doc(link_post)
            .update({
                caption: upCap,
            })
            .then(() => {
                console.log('Post updated!')
            })
    }

    const sharePost = async item => {
        let time = new Date();
        let PS = [];
        firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(item_post => {
                PS = item_post._data.posts;
                PS.push({
                    postId: item.postId,
                    time: time,
                    userId: item.userId,
                });
                firestore()
                    .collection('Users')
                    .doc(userId)
                    .update({
                        posts: PS,
                    })
            })
    }

    const [settingpost, setsettingpost] = useState(0)
    const [postids, setpostids] = useState('')

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    // paddingLeft: 20,
                    backgroundColor: 'skyblue',
                }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Newfeeds
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
            }}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Add')
                }}>
                    <View style={{

                        color: 'black',
                        borderWidth: 0.2,
                        borderRadius: 5,
                        width: 90,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 10,
                        backgroundColor: 'skyblue',

                    }}>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold'
                        }}>Posts</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert('Image', 'Add Picture')
                }}>
                    <View style={{

                        color: 'black',
                        borderWidth: 0.2,
                        borderRadius: 5,
                        width: 90,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 10,
                        backgroundColor: 'skyblue',

                    }}>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                        }}> Images </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert('Album', 'Go to album')
                }}>
                    <View style={{

                        color: 'black',
                        borderWidth: 0.2,
                        borderRadius: 5,
                        width: 90,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 10,
                        backgroundColor: 'skyblue',

                    }}>
                        <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                        }}> Album </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {postData.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={postData}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{
                                    width: '90%',
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    backgroundColor: '#fff',
                                    borderRadius: 20,
                                    marginBottom: postData.length - 1 == index ? 70 : 0,
                                }}>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}> 
                                        <UpAv cons={item.userId} />
                                        <View style={{ flexDirection: 'column' }}>
                                            <UpName cons={item.userId} />
                                            <Text style={{ fontSize: 10, marginLeft: 15, fontWeight: '600', color: 'grey' }}>
                                                {coverTime(item.createdAt)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}></View>
                                    {/* update posts nè chú */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            settingpost == 0 ? (setsettingpost(1), setpostids(item.postId)) : (setsettingpost(0), setpostids(''))

                                        }}
                                    >
                                        {userId == item.userId ? (
                                            <Image
                                                style={{
                                                    // backgroundColor: 'red',
                                                    width: 22,
                                                    height: 22,
                                                    marginRight: 10,
                                                }}
                                                size={20}
                                                source={require('../../front_end/icons/dots.png')} />
                                        ) : ''}
                                    </TouchableOpacity>

                                </View>

                                {settingpost == 1 && userId == item.userId && postids == item.postId ?
                                    (
                                        <View style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                            backgroundColor: 'white',
                                            marginStart: 180,
                                            marginEnd: 21,
                                            borderWidth: 0.3,
                                            borderColor: 'grey',
                                            borderRadius: 5,
                                        }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        navigation.navigate('Editpost', { post: item.postId, user: item.userId })
                                                        setsettingpost(0)
                                                    }}
                                                    style={{
                                                        flexDirection: 'row',
                                                        padding: 5,
                                                        alignItems: 'center'
                                                    }}>
                                                    <Image source={require('../../front_end/icons/pen.png')}
                                                        style={{
                                                            height: 18,
                                                            width: 18,
                                                            marginEnd: 10,
                                                            tintColor: 'black',
                                                        }} />
                                                    <Text style={{ color: 'black', fontSize: 15 }}>Edit post</Text>
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', width: 123, }}></View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        deletePost(item.postId);
                                                        setsettingpost(0)
                                                    }}
                                                    style={{
                                                        flexDirection: 'row',
                                                        padding: 5,
                                                        alignItems: 'center'
                                                    }}>
                                                    <Image source={require('../../front_end/icons/trash-can.png')}
                                                        style={{
                                                            height: 18,
                                                            width: 18,
                                                            marginEnd: 10,
                                                            tintColor: 'black',
                                                        }} />
                                                    <Text style={{ color: 'black', fontSize: 15 }}>Delete post</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : ''}
                                <Text
                                    style={{
                                        marginTop: 10,
                                        marginLeft: 20,
                                        marginRight: 20,
                                        marginBottom: 10,
                                        color: 'black',
                                    }}>
                                    {item.caption}
                                </Text>

                                <Image
                                    source={{ uri: item.image }}
                                    style={{
                                        width: '90%',
                                        height: (item.image != '') ? 300 : 'auto',
                                        alignSelf: 'center',
                                        borderRadius: 10,
                                        marginBottom: 20,
                                    }}
                                />
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                        alignItems: 'center',
                                        height: 50,
                                        marginBottom: 10,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            onLike(item);
                                        }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10, color: 'black' }}>
                                            {item.likes.length}
                                        </Text>
                                        {getLikesStaus(item.likes) ? (
                                            <Image
                                                source={require('../images/heart.png')}
                                                style={{ width: 22, height: 22, tintColor: 'red' }}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../images/love.png')}
                                                style={{ width: 22, height: 22 }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            navigation.navigate('Comments', {
                                                postId: item.postId,
                                                comments: item.comments,
                                                userId: item.userId,
                                            });
                                        }}>
                                        <Text style={{ marginRight: 10, color: 'black' }}>
                                            {item.comments.length}
                                        </Text>
                                        <Image
                                            source={require('../images/comment.png')}
                                            style={{ width: 20, height: 20, tintColor: 'black' }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            // navigation.navigate('Comments', {
                                            //     postId: item.postId,
                                            //     comments: item.comments,
                                            // });
                                            sharePost(item);
                                        }}>
                                        <Text style={{ marginRight: 10, color: 'black' }}>
                                            {item.comments.length}
                                        </Text>
                                        <Image
                                            source={require('../../front_end/icons/share.png')}
                                            style={{ width: 22, height: 22, tintColor: 'black' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No Post Found</Text>
                </View>
            )}
        </View >
    );
};

export default Home;