import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import UpName from './tabs/UpName';
import UpAv from './tabs/UpAv';

const GetPost = (props) => {
    const postId = props.cons.item.postId;
    const time = props.cons.item.time;
    const userId = props.cons.item.userId;
    const myId = props.cons.myId;
    useEffect(() => {
        getUser();
        getPost();
    }, []);
    const navigation = useNavigation();
    // post
    const [caption, setCaption] = useState('');
    const [cmt, setCmt] = useState([]);
    const [image, setImage] = useState('');
    const [like, setLike] = useState([]);
    // user
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [Item, setItem] = useState([]);
    const [onLikeClick, setOnLikeCLick] = useState(false);

    const coverTime = time => {
        let date = time.toDate();
        let mm = date.getMonth() + 1;
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
                    setLike(document.data().likes);
                    setItem(document.data());
                }
            });

    }
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
    const deletePost = async link_post => {
        let temp = [];
        let userha = 0;// =0 posts cua chinh minh
        let temp1 = [];
        firestore()
            .collection('Users')
            .doc(myId)
            .get()
            .then(item => {
                temp = item._data.posts;
                temp.map(item1 => {
                    if (item1.postId !== link_post) {
                        temp1.push(item1);
                    }
                    if (item1.postId === link_post && item1.userId !== myId) {
                        userha = 1;
                    }
                    else if (item1.postId === link_post && item1.userId === myId) {
                        userha = 0;
                    }
                })
                if (userha == 0)
                    deletePostHomeAndPosts(link_post);
                firestore()
                    .collection('Users')
                    .doc(myId)
                    .update({
                        posts: temp1,
                    })


            })

    }
    const deletePostHomeAndPosts = async link_post => {
        firestore()
            .collection('posts')
            .doc(link_post)
            .delete()
            .then(() => {
                deletePostProfile(link_post);
            })
    }


    const [settingpost, setsettingpost] = useState(0)
    return (
        <View
            style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                // marginBottom: 70,
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
                        {coverTime(time)}
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
                                    navigation.navigate('Editpost', { post: postId, user: userId })
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
                                    deletePost(postId);
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
                        onLike(Item);
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        {like.length}
                    </Text>
                    {getLikesStaus(like) ? (
                        <Image
                            source={require('./images/heart.png')}
                            style={{ width: 22, height: 22, tintColor: 'red' }}
                        />
                    ) : (
                        <Image
                            source={require('./images/love.png')}
                            style={{ width: 22, height: 22 }}
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
                        style={{ width: 20, height: 20, tintColor: 'black' }}
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
                        style={{ width: 22, height: 22, tintColor: 'black' }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default GetPost;