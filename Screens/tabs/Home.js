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
        let mm = date.getMonth();
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
                console.log('Post deleted!');
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
                        }}> Posts</Text>
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
                                    {/* <Image
                                        // source={require('../images/user.png')}
                                        source={{ uri: item.profilePic }}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            marginLeft: 15,
                                        }}
                                    /> */}
                                    <UpAv cons={item.userId} />
                                    <UpName cons={item.userId} />
                                    <Text style={{ fontSize: 10, marginLeft: 15, fontWeight: '600', color: 'black' }}>
                                        {coverTime(item.createdAt)}
                                    </Text>
                                    <View style={{ flex: 1 }}></View>
                                    {/* update posts nè chú */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            deletePost(item.postId);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                backgroundColor: 'red',
                                                width: 25,
                                                height: 25,
                                                marginRight: 10,
                                            }}
                                            size={20}
                                            source={require('../../front_end/icons/dots.png')} />
                                    </TouchableOpacity>
                                </View>
                                
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
                                        <Text style={{ marginRight: 10, fontSize: 18, color: 'black' }}>
                                            {item.likes.length}
                                        </Text>
                                        {getLikesStaus(item.likes) ? (
                                            <Image
                                                source={require('../images/heart.png')}
                                                style={{ width: 24, height: 24, tintColor: 'red' }}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../images/love.png')}
                                                style={{ width: 24, height: 24 }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row' }}
                                        onPress={() => {
                                            navigation.navigate('Comments', {
                                                postId: item.postId,
                                                comments: item.comments,
                                            });
                                        }}>
                                        <Text style={{ marginRight: 10, color: 'black' }}>
                                            {item.comments.length}
                                        </Text>
                                        <Image
                                            source={require('../images/comment.png')}
                                            style={{ width: 24, height: 24 }}
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
        </View>
    );
};

export default Home;