import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import UpAv from './tabs/UpAv'
import UpName from './tabs/UpName'
import { set } from 'lodash';
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
    const [fakeLikechoose, setfakeLikechoose] = useState('');
    const [check, setcheck] = useState([]);
    const [test, settest] = useState('red')
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
        let id = uuid.v4();
        temComments.push({
            userId: userId,
            comment: comment,
            postId: postId,
            name: name,
            profile: profile,
            cmtId: id,
            time : new Date(),
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

    const coverTime = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth();
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();// phút
        let hh = date.getHours(); // giờ
        if(hh < '10') 
            hh = '0' + hh;
        if(munis < '10')
            munis = '0' + munis;
        return (hh + ':' + munis);
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
                style={{marginBottom: 70}}
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
                            <UpAv cons={item.userId} />
                            <View>

                                <UpName cons={item.userId} />
                                <Text style={{ fontSize: 15, marginTop: 5, color: 'black', marginStart: 15 }}>
                                    {item.comment}
                                </Text>
                            </View>
                        </View>
                            <View style={{
                                flexDirection: 'row',
                                marginStart: 40,
                                marginEnd: 40,
                                flex: 1,

                            }}>
                                <Text style={{ color: 'grey', marginEnd: 60 , fontSize:15}}>{coverTime(item.time)}</Text>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginEnd: 60,
                                    }}
                                    onPress={() => {
                                        check[index] == '../Screens/images/love.png' ? check[index] = '../Screens/images/heart.png' : check[index] = '../Screens/images/love.png'
                                        fakeLike == 0 ? (setfakeLike(1), setfakeLikechoose(item.cmtId))
                                            : (setfakeLike(0), setfakeLikechoose(item.cmtId))
                                    }}>
                                    {
                                    
                                        check[index] == '../Screens/images/love.png' ?
                                            (
                                                <>
                                                    <Text style={{ color: 'black', marginEnd: 5 }}>{fakeLikevalue}</Text>
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
                                                    <Text style={{ color: 'black', marginEnd: 5 }}>{fakeLikevalue}</Text>

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
                                }}>
                                    <Image
                                        source={require('../Screens/images/comment.png')}
                                        style={{ width: 19, height: 19, marginEnd: 10 , tintColor:'black' }}
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
                        comment !='' ? (postComment(),setComment('')) : (Alert.alert('','Nội dung hiện đang rỗng'))
                    }}>
                    Send
                </Text>
            </View>
        </View>
    );
};

export default Comments;