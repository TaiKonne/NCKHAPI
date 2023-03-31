import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import UpAv from './tabs/UpAv'
import UpName from './tabs/UpName'
import { set, times } from 'lodash';
let userId = '';
let comments = [];
let postId = '';
let name = '';
let profile = '';
let likes = '';
const Comments = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [comment, setComment] = useState('');
    const inputRef = useRef();
    const [commentsList, setCommentsList] = useState([]);

    const [fakeLike, setfakeLike] = useState(0);
    const [fakeLikevalue, setfakeLikevalue] = useState(0);
    const [fakeLikechoose, setfakeLikechoose] = useState('');
    const [check, setcheck] = useState([]);

    useEffect(() => {
        getUserId();
        comments = route.params.comments;
        postId = route.params.postId;
        likes = route.params.comments.likes;
        console.log(comments);
        setCommentsList(comments);
    }, []);

    const getUserId = async () => {
        userId = await AsyncStorage.getItem('USERID');
        name = await AsyncStorage.getItem('NAME');

    };

    const postComment = () => {
        let times = coverTime(new Date());
        let temComments = comments;
        let id = uuid.v4();
        temComments.push({
            userId: userId,
            comment: comment,
            postId: postId,
            name: name,
            profile: profile,
            cmtId: id,
            time: times,
            likes: [],
        });
        firestore()
            .collection('posts')
            .doc(postId)
            .update({
                comments: temComments,
            })
            .then(() => {
                console.log('post updated!');
                getNewComments();
            })
            .catch(error => { });
        inputRef.current.clear();
    };
    const getNewComments = () => {
        firestore()
            .collection('posts')
            .doc(postId)
            .get()
            .then(documentSnapshot => {
                setCommentsList(documentSnapshot.data().comments);
            });
        let check1 = []
        for (let i = 0; i < commentsList.length; i++) {
            check1[i] = '../Screens/images/love.png';
        }
        setcheck(check1);
    };

    const onLike = item => {
        let tempLikes = item;
        if (tempLikes.likes.length > 0) {
            tempLikes.likes.map(item1 => {
                if (userId === item1) {
                    const index = tempLikes.likes.indexOf(item1);
                    if (index > -1) {
                        // only splice array when item is found
                        tempLikes.likes.splice(index, 1); // 2nd parameter means remove one item only
                    }
                } else {
                    console.log('diliked');
                    tempLikes.likes.push(userId);
                }
            });
        } else {
            tempLikes.likes.push(userId);
        }

        firestore()
            .collection('posts')
            .doc(item.postId)
            .update({
                comments: tempLikes,
            })
            .then(() => { })
            .catch(error => { });

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

    const coverTime = (timestamp) => {
        let date = new Date();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();
        let hh = date.getHours();
        if (dd < '10')
            dd = '0' + dd;
        if (mm < '10')
            mm = '0' + mm;
        let dates = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + munis;
        return dates;

    }

    return (
        <View style={{ flex: 1 }}>
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
                    Bình luận
                </Text>
                <View style={{ width: 50, height: 50 }} />
            </View>
            <FlatList
                style={{ marginBottom: 70 }}
                data={commentsList}
                renderItem={({ item, index }) => {
                    return (
                        <><View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                // height: 60,
                                alignItems: 'center',
                                marginTop: 10,
                            }}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <UpAv cons={item.userId} />
                                    <View style={{
                                        flexDirection: 'column',
                                    }}>
                                        <UpName cons={item.userId} />
                                        <Text style={{ color: 'grey', fontSize: 10, marginStart: 15 }}>{item.time}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                                    <Text style={{ fontSize: 15, color: 'black', marginStart: 70 }}>
                                        {item.comment}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginStart: 10,
                                            marginEnd: 10,
                                            flex: 1,
                                            marginTop: 5,
                                        }}>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                marginStart: 80,
                                                marginEnd: 110,
                                            }}
                                            onPress={() => {
                                                onLike(item);
                                            }}>
                                            {

                                                getLikesStaus(item.likes) == true ?
                                                    (
                                                        <>
                                                            <Text style={{ color: 'black', marginEnd: 5 }}>{item.likes.length}</Text>
                                                            <Image
                                                                source={require('../Screens/images/heart.png')}
                                                                style={{
                                                                    width: 20, height: 20, marginEnd: 10,
                                                                    tintColor: 'red'
                                                                }} />
                                                        </>

                                                    ) :
                                                    (
                                                        <>
                                                            <Text style={{ color: 'black', marginEnd: 5 }}>{item.likes.length}</Text>
                                                            <Image
                                                                source={require('../Screens/images/love.png')}
                                                                style={{
                                                                    width: 20, height: 20, marginEnd: 10,
                                                                    tintColor: 'black'
                                                                }} />
                                                        </>
                                                    )
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            flexDirection: 'row',
                                            // marginEnd:60,
                                        }}>
                                            <Image
                                                source={require('../Screens/images/comment.png')}
                                                style={{ width: 19, height: 19, marginEnd: 10, tintColor: 'black' }}
                                            />
                                        </TouchableOpacity >
                                    </View>
                                </View>

                            </View>
                        </View>

                        </>
                    );
                }}
            />
            <View
                style={{
                    width: '100%',
                    height: 60,
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    color: 'black',
                }}>
                <TextInput
                    ref={inputRef}
                    value={comment}
                    onChangeText={txt => {
                        setComment(txt);
                    }}
                    placeholder="type comment here..."
                    placeholderTextColor={'gray'}
                    style={{ width: '80%', marginLeft: 20, color: 'black' }}
                />
                <Text
                    style={{
                        marginRight: 10, fontSize: 18, fontWeight: 'bold',
                        color: comment == '' ? 'grey' : 'blue',
                    }}
                    onPress={() => {
                        comment != '' ? (postComment(), setComment('')) : (Alert.alert('', 'Nội dung hiện đang rỗng'))
                    }}>
                    Đăng
                </Text>
            </View>
        </View>
    );
};

export default Comments;