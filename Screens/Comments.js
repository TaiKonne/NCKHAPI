import { View, Text, TextInput, FlatList, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
let userId = '';
let comments = [];
let postId = '';
let name = '';
let profile = '';
const Comments = () => {
    const route = useRoute();
    const [comment, setComment] = useState('');
    const inputRef = useRef();
    const [commentsList, setCommentsList] = useState([]);

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
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#8e8e8e',
                    alignItems: 'center',
                    justifyContent:'center',
                    backgroundColor:'skyblue',
                }}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Comments
                </Text>
            </View>
            <FlatList
                data={commentsList}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                height: 60,
                                alignItems: 'center',
                            }}>
                            {item.profile == null ? (
                                <Image
                                    source={require('../front_end/icons/user_1.png')}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginLeft: 10,
                                        marginRight: 15,
                                        borderRadius: 20,
                                    }}
                                />
                            ) : (
                                <Image
                                    source={{ uri: item.profile }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginLeft: 10,
                                        marginRight: 15,
                                        borderRadius: 20,
                                    }}
                                />
                            )}

                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: 15, marginTop: 5, color: 'black'}}>
                                    {item.comment}
                                </Text>
                            </View>
                        </View>
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
                    style={{ marginRight: 10, fontSize: 18, fontWeight: 'bold', 
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