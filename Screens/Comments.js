import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import UpAv from './tabs/UpAv'
import UpName from './tabs/UpName'
let userId = '';
let comments = [];
let postId = '';
let name = '';
let profile = '';
const Comments = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [comment, setComment] = useState('');
    const inputRef = useRef();
    const [commentsList, setCommentsList] = useState([]);

    const [fakeLike, setfakeLike] = useState(0);
    const [fakeLikevalue, setfakeLikevalue] = useState(0);

    useEffect(() => {
        getUserId();
        comments = route.params.comments;
        console.log(comments);
        setCommentsList(comments);
        postId = route.params.postId;
    }, []);

    const getUserId = async () => {
        userId = await AsyncStorage.getItem('USERID');
        name = await AsyncStorage.getItem('NAME');
        profile = await AsyncStorage.getItem('PROFILE_PIC');

    };
    const postComment = () => {
        let temComments = comments;
        temComments.push({
            userId: userId,
            comment: comment,
            postId: postId,
            name: name,
            profile: profile,
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
    };

    const coverTime = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth();
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();// phút
        let hh = date.getHours(); // giờ
        date = hh + ':' + munis; ``
        return date;
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
                data={commentsList}
                renderItem={({ item, index }) => {
                    return (
                        <><View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                height: 60,
                                alignItems: 'center',
                            }}>
                            {/* {item.profile == null ? (
                                <Image
                                    source={require('../front_end/icons/user_1.png')}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginLeft: 10,
                                        marginRight: 15,
                                        borderRadius: 20,
                                    }} />
                            ) : (
                                <Image
                                    source={{ uri: item.profile }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginLeft: 10,
                                        marginRight: 15,
                                        borderRadius: 20,
                                    }} />
                            )} */}
                            <UpAv cons={item.userId} />
                            <View>
                                {/* <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                    {item.name}
                                </Text> */}
                                <UpName cons={item.userId} />
                                <Text style={{ fontSize: 15, marginTop: 5, color: 'black' }}>
                                    {item.comment}
                                </Text>
                            </View>
                        </View>
                            <View style={{
                                flexDirection: 'row',
                                marginStart: 40,
                                marginEnd: 40,
                                flex: 1,
                                // backgroundColor:'green'
                            }}>
                                <Text style={{ color: 'black', marginEnd: 60 }}>2 hours</Text>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginEnd: 60,
                                    }}
                                    onPress={() => {
                                        fakeLike == 0 ? (setfakeLike(1), setfakeLikevalue(fakeLikevalue + 1)) : (setfakeLike(0), setfakeLikevalue(fakeLikevalue - 1))
                                    }}>
                                    <Text style={{ color: 'black', marginEnd: 5 }}>{fakeLikevalue}</Text>
                                    {fakeLike == 0 && userId == item.userId ? (
                                        <Image
                                            source={require('../Screens/images/love.png')}
                                            style={{ width: 20, height: 20, tintColor: 'black', marginEnd: 10 }}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../Screens/images/heart.png')}
                                            style={{ width: 20, height: 20, tintColor: 'red', marginEnd: 10 }}
                                        />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                }}>
                                    <Image
                                        source={require('../Screens/images/comment.png')}
                                        style={{ width: 19, height: 19, marginEnd: 10 }}
                                    />
                                </TouchableOpacity >

                            </View></>
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
                        postComment();
                    }}>
                    Send
                </Text>
            </View>
        </View>
    );
};

export default Comments;