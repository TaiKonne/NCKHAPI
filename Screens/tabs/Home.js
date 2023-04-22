import { View, Text, FlatList, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpName from './UpName';
import UpAv from './UpAv';
import { request } from 'express';
import { Picker } from '@react-native-picker/picker';
let userId = '';
const Home = (props) => {
    //props;
    const navigation = useNavigation();
    const [onLikeClick, setOnLikeCLick] = useState(false);
    const isFocused = useIsFocused();
    const [postData, setPostData] = useState([]);
    const [upCap, setUpCap] = useState('');
    //filter stt
    const [viewFilter, setViewFilter] = useState(0)
    const [filterDay, setFilterDay] = useState('')
    const [filterMonth, setFilterMonth] = useState('')
    const [filterYear, setFilterYear] = useState('')

    useEffect(() => {
        getUserId();
        let temp = [];
        const gett = firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
        gett.onSnapshot(Snap => {
            const g = Snap.docs.map(S => {
                return { ...S.data() };
            })

            setPostData(g);
        });

    }, []);

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


    const countLike = item => {
        let tempLikes = item.share;
        tempLikes.push(userId);


        firestore()
            .collection('posts')
            .doc(item.postId)
            .update({
                share: tempLikes,
            })
            .then(() => { })
            .catch(error => { });
    };

    const [checkpost, setpost] = useState(0)
    const coverTime = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();
        let munis = date.getMinutes();// phút
        let hh = date.getHours(); // giờ
        if (dd < '10')
            dd = '0' + dd;
        if (mm < '10')
            mm = '0' + mm;
        if (hh < '10')
            hh = '0' + hh;
        if (munis < '10')
            munis = '0' + munis;
        date = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mm;
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
    //setting post
    const [settingpost, setsettingpost] = useState(0)
    const [SimpleModal, setSimpleModal] = useState(false);
    const [postids, setpostids] = useState('')

    const [SimpleModalshare, setSimpleModalShare] = useState(false);

    const [abc, setAbc] = useState(null)

    // const [checkdots,setcheckdots] = useState(1);

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    backgroundColor: 'skyblue',
                }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Bảng tin
                </Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
            }}>
                <UpAv cons={userId} />
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => {
                        navigation.navigate('Add')
                    }}>

                    <View style={{

                        color: 'black',
                        borderWidth: 0.5,
                        borderRadius: 10,
                        borderColor: 'black',
                        width: 250,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginStart: 10,
                        marginRight: 10,
                        marginTop: 3,
                    }}>
                        <Text style={{ color: 'grey' }}>Bạn đang nghĩ gì ?</Text>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        height: 35,
                        marginTop: 3,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        viewFilter == 0 ? setViewFilter(1) : setViewFilter(0);
                    }}
                >
                    <Image
                        source={require('../../front_end/icons/filter-filled-tool-symbol.png')}
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 15,
                            tintColor: 'orange',
                        }}
                    />
                </TouchableOpacity>
            </View>
            {
                viewFilter == 1 ?
                    (
                        <View style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: 'grey',
                            marginTop: 10,
                            marginStart: 15,
                            marginEnd: 15,
                            borderRadius: 10,
                            justifyContent: 'space-between'
                            // marginBottom:10,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginEnd: 5, marginStart: 10 }}>Ngày</Text>
                                <View style={{
                                    width: 30,
                                    height: 25,
                                    flexDirection: 'row',
                                }}>
                                    <Picker
                                        selectedValue={filterDay}
                                        value={filterDay}
                                        onValueChange={(itemValue) => setFilterDay(itemValue)}
                                        dropdownIconColor={'black'}
                                        style={{
                                            flex: 1,
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <Picker.Item label="Hủy" value="Hủy" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="10" value="10" />
                                        <Picker.Item label="11" value="11" />
                                        <Picker.Item label="12" value="12" />
                                        <Picker.Item label="13" value="13" />
                                        <Picker.Item label="14" value="14" />
                                        <Picker.Item label="15" value="15" />
                                        <Picker.Item label="16" value="16" />
                                        <Picker.Item label="17" value="17" />
                                        <Picker.Item label="18" value="18" />
                                        <Picker.Item label="19" value="19" />
                                        <Picker.Item label="20" value="20" />
                                        <Picker.Item label="21" value="21" />
                                        <Picker.Item label="22" value="22" />
                                        <Picker.Item label="23" value="23" />
                                        <Picker.Item label="24" value="24" />
                                        <Picker.Item label="25" value="25" />
                                        <Picker.Item label="26" value="26" />
                                        <Picker.Item label="27" value="27" />
                                        <Picker.Item label="28" value="28" />
                                        <Picker.Item label="29" value="29" />
                                        <Picker.Item label="30" value="30" />
                                        <Picker.Item label="31" value="31" />

                                    </Picker>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginEnd: 5, marginStart: 10 }}>Tháng</Text>
                                <View style={{
                                    width: 30,
                                    height: 25,
                                    flexDirection: 'row',
                                }}>
                                    <Picker
                                        selectedValue={filterMonth}
                                        value={filterMonth}
                                        onValueChange={(itemValue) => setFilterMonth(itemValue)}
                                        dropdownIconColor={'black'}
                                        style={{
                                            flex: 1,
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <Picker.Item label="Hủy" value="Hủy" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="10" value="10" />
                                        <Picker.Item label="11" value="11" />
                                        <Picker.Item label="12" value="12" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginEnd: 5, marginStart: 10 }}>Năm</Text>
                                <View style={{
                                    width: 30,
                                    height: 25,
                                    flexDirection: 'row',
                                }}>
                                    <Picker
                                        selectedValue={filterYear}
                                        value={filterYear}
                                        onValueChange={(itemValue) => setFilterYear(itemValue)}
                                        dropdownIconColor={'black'}
                                        style={{
                                            flex: 1,
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <Picker.Item label="Hủy" value="Hủy" />
                                        <Picker.Item label="2023" value="2023" />
                                        <Picker.Item label="2022" value="2022" />
                                        <Picker.Item label="2021" value="2021" />
                                        <Picker.Item label="2020" value="2020" />
                                        <Picker.Item label="2019" value="2019" />
                                        <Picker.Item label="2018" value="2018" />
                                        <Picker.Item label="2017" value="2017" />
                                        <Picker.Item label="2016" value="2016" />
                                        <Picker.Item label="2015" value="2015" />
                                        <Picker.Item label="2014" value="2014" />
                                        <Picker.Item label="2013" value="2013" />
                                    </Picker>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    // marginEnd: 10,
                                    borderColor: 'skyblue',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'skyblue',
                                    borderRadius: 10,
                                }}
                                onPress={() => {
                                    setViewFilter(0)
                                }}
                            >
                                <Text style={{ color: 'black', margin: 10, fontSize: 18 }}>Lọc</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    : ''
            }
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
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 10,
                                        }}
                                        onPress={() => {
                                            {
                                                userId != item.userId ? (navigation.navigate('VisitUser', {
                                                    userId: item.userId,
                                                    myId: userId,
                                                })) : ''
                                            }
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
                                                // size={20}
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
                                                        navigation.navigate('Editpost', { post: item.postId, user: item.userId, caption: item.caption, image: item.image })
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
                                                    <Text style={{ color: 'black', fontSize: 15 }}>Chỉnh sửa</Text>
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, borderWidth: 0.2, borderColor: 'grey', width: 123, }}></View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSimpleModal(true)
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
                                                    <Text style={{ color: 'black', fontSize: 15 }}>Xóa bài viết</Text>
                                                </TouchableOpacity>
                                                <Modal
                                                    visible={SimpleModal}
                                                    animationType="fade"
                                                    transparent={true}
                                                >
                                                    <View
                                                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View
                                                            style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, flexDirection: 'column', borderWidth: 0.3, borderColor: 'grey' }}>
                                                            <Text
                                                                style={{ color: 'black' }}>Bạn muốn xóa bàn viết này?</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setSimpleModal(false)
                                                                        setsettingpost(0)
                                                                    }}>
                                                                    <Text
                                                                        style={{ marginTop: 20, color: 'black', marginStart: 20, fontWeight: 'bold' }}>Hủy</Text>
                                                                </TouchableOpacity>
                                                                <View style={{ flex: 1 }}></View>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setSimpleModal(false)
                                                                        deletePost(item.postId);
                                                                        setsettingpost(0)
                                                                    }}>
                                                                    <Text
                                                                        style={{ marginTop: 20, color: 'blue', marginEnd: 20, fontWeight: 'bold' }}>Xóa</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Modal>
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
                                                likes: item.comments.likes,
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
                                    {userId != item.userId ?
                                        (<><TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                // navigation.navigate('Comments', {
                                                //     postId: item.postId,
                                                //     comments: item.comments,
                                                // });
                                                // userId  == item.userId ? setSimpleModalShare(true) : setSimpleModalShare(false)
                                                setSimpleModalShare(true);
                                                setAbc(item);
                                                // sharePost(item);
                                                // countLike(item);
                                            }}>
                                            <Text style={{ marginRight: 10, color: 'black' }}>
                                                {item.share.length}
                                            </Text>
                                            <Image
                                                source={require('../../front_end/icons/share.png')}
                                                style={{ width: 22, height: 22, tintColor: 'black' }} />
                                        </TouchableOpacity>
                                            <Modal
                                                visible={SimpleModalshare}
                                                animationType="fade"
                                                transparent={true}
                                            >
                                                <View
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <View
                                                        style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, flexDirection: 'column', borderWidth: 0.3, borderColor: 'grey' }}>
                                                        <Text
                                                            style={{ color: 'black' }}>Bạn muốn chia sẻ bài viết này? </Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setSimpleModalShare(false);
                                                                }}>
                                                                <Text
                                                                    style={{ marginTop: 20, color: 'black', marginStart: 20, fontWeight: 'bold' }}>Hủy</Text>
                                                            </TouchableOpacity>
                                                            <View style={{ flex: 1 }}></View>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    sharePost(abc);
                                                                    countLike(abc);
                                                                    setSimpleModalShare(false);
                                                                }}>
                                                                <Text
                                                                    style={{ marginTop: 20, color: 'blue', marginEnd: 20, fontWeight: 'bold' }}>Chia sẻ</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </>
                                        ) :
                                        ''}

                                </View>
                            </View>
                        );
                    }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 30, fontWeight: 'bold' }}>NO POST FOUND</Text>
                </View>
            )}
        </View >
    );
};

export default Home;