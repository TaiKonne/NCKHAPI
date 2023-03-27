import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import UpName from './tabs/UpName';
import UpAv from './tabs/UpAv';
const GetPost = (props) => {
    useEffect(() => {
        getUser();
        getPost();
    }, []);

    // post
    const [caption, setCaption] = useState('');
    const [cmt, setCmt] = useState([]);
    const [image, setImage] = useState('');
    const [like, setLike] = useState([]);
    // user
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    let postId = props.cons.postId;
    let time = props.cons.time;
    let userId = props.cons.userId;

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
    const getUser = async () => {

        firestore().
            collection('Users')
            .doc(userId)
            .get()
            .then(document => {
                if (document.exists) {
                    setName(document.data().name);
                    setProfilePic(document.data().profilePic);
                }
            })

    }
    const getPost = async () => {

        firestore().
            collection('posts')
            .doc(postId)
            .get()
            .then(document => {
                if (document.exists) {
                    setCaption(document.data().caption);
                    setCmt(document.data().comments);
                    setImage(document.data().image);
                    setLike(document.data().likes)
                }
            })

    }
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
    const [settingpost, setsettingpost] = useState(0)
    return (
        <View
            style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                marginBottom: 70,
            }}>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                }}>
                <UpAv cons={userId} />
                <View style={{ flexDirection: 'column' }}>
                    <UpName cons={userId} />
                    <Text style={{ fontSize: 10, marginLeft: 15, fontWeight: '600', color: 'grey' }}>
                        {/* {coverTime(item.createdAt)} */}
                    </Text>
                </View>
                <View style={{ flex: 1 }}></View>
                {/* update posts nè chú */}
                <TouchableOpacity
                    onPress={() => {
                        settingpost == 0 ? setsettingpost(1) : setsettingpost(0)
                    }}
                >
                    <Image
                        style={{
                            // backgroundColor: 'red',
                            width: 25,
                            height: 25,
                            marginRight: 10,
                        }}
                        size={20}
                        source={require('../front_end/icons/dots.png')} />
                </TouchableOpacity>

            </View>

            {settingpost == 1 ?
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

                                }}
                                style={{
                                    flexDirection: 'row',
                                    padding: 5,
                                    alignItems: 'center'
                                }}>
                                <Image source={require('../front_end/icons/pen.png')}
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
                                    // deletePost(item.postId);
                                    setsettingpost(0)
                                }}
                                style={{
                                    flexDirection: 'row',
                                    padding: 5,
                                    alignItems: 'center'
                                }}>
                                <Image source={require('../front_end/icons/trash-can.png')}
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
                {caption}
            </Text>

            <Image
                source={{ uri: image }}
                style={{
                    width: '90%',
                    height: (image != '') ? 300 : 'auto',
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
                        {like.length}
                    </Text>
                    {getLikesStaus(like) ? (
                        <Image
                            source={require('./images/heart.png')}
                            style={{ width: 24, height: 24, tintColor: 'red' }}
                        />
                    ) : (
                        <Image
                            source={require('./images/love.png')}
                            style={{ width: 24, height: 24 }}
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        navigation.navigate('Comments', {
                            postId: postId,
                            comments: cmt,
                        });
                    }}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        {cmt.length}
                    </Text>
                    <Image
                        source={require('./images/comment.png')}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        navigation.navigate('Comments', {
                            postId: postId,
                            comments: cmt,
                        });
                    }}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        {cmt.length}
                    </Text>
                    <Image
                        source={require('../front_end/icons/share.png')}
                        style={{ width: 24, height: 24, tintColor: 'black' }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default GetPost;