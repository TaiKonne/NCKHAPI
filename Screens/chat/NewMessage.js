import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { Router, urlencoded } from 'express';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import UpName from '../tabs/UpName'
import UpAv from '../tabs/UpAv'

const NewMessage = (props) => {
  let Data = props.route.params.data;
  let user1 = Data.myId;
  let user2 = Data.userId;
  let chatUser = user1 + "|" + user2;
  let get = uuid.v1();
  // 5a346a5a-b545-4dc1-a821-fdead8c1bead
  // 9fda510a-409f-4cbe-9fa9-5ec52d6105a7
  // user1|user2
  //   data: {
  //     userId: item.userId,
  //     name: item.name,
  //     myId: userId,
  //     profilePic:
  //         item.profilePic == '' || item.profilePic == null
  //             ? ''
  //             : item.profilePic,
  // },

  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [chatedUser1, setChatedUser1] = useState([]);
  const [chatedUser2, setChatedUser2] = useState([]);
  const route = useRoute();
  useEffect(() => {

    const querySnapShot = firestore()
      .collection('chats')
      .doc(chatUser)
      .collection('messages')
      .orderBy('createdAt', 'desc')
    querySnapShot.onSnapshot(snapShot => {
      const allMessages = snapShot.docs.map(snap => {
        return { ...snap.data(), createdAt: new Date() };
      });
      setMessages(allMessages);
    });
  }, []);

  const onSend = messageArray => {

    let myMsg = null;
    if (imageUrl !== '') {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.data.myId,
        receiverId: route.params.data.userId,
        image: imageUrl,
      };
    } else {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.data.myId,
        receiverId: route.params.data.userId,
        image: '',
      };
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    let chatUser2 = user2 + "|" + user1;
    let tam = [];
    
    firestore()
      .collection('chats')
      .doc(chatUser)
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    setImageUrl('');
    setImageData(null);
    let temp = [];
    let co = 0;
    firestore()
      .collection('Users')
      .doc(user1)
      .get()
      .then(Snap => {
        temp = Snap._data.chatList;
        temp.map(item => {

          if (item.chatUserId === user2) {
            co = 1;
          }
        })
        if (co === 0) {
          temp.push({
            chatUserId: user2,
          })
          firestore()
            .collection('Users')
            .doc(user1)
            .update({
              chatList: temp,
            })
          let temp1 = [];
          firestore()
            .collection('Users')
            .doc(user2)
            .get()
            .then(Snap => {
              temp1 = Snap._data.chatList;
              temp1.push({
                chatUserId: user1,
              })
              firestore()
                .collection('Users')
                .doc(user2)
                .update({
                  chatList: temp1,
                })
            })
        }
      })
  };

  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });
    console.log(result);
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImageData(result);
      uplaodImage(result);
    }
  };

  const uplaodImage = async imageDataa => {
    const reference = storage().ref(imageDataa.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log('url', url);
    setImageUrl(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 60,
          borderBottomWidth: 0.5,
          borderBottomColor: '#8e8e8e',
          alignItems: 'center',
          backgroundColor: 'skyblue',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('HomeSC')
        }}>
          <Image source={require('../../front_end/icons/left.png')}
            style={{
              height: 25,
              width: 25,
              marginStart: 10,
              tintColor: 'white',
            }} />
        </TouchableOpacity>
        {/* <View style={{ flex: 1 }}></View> */}
        {/* <View style={{
          marginStart: 10,
        }}>
        <Image source={require('../images/user.png')}
            style={{
              height: 50,
              width: 50,
              marginEnd: 10,
            }} />
        </View> */}
        {<UpAv cons={user2} />}

        <View style={{
          borderWidth: 1,
          borderColor: '#64b72e',
          backgroundColor: '#64b72e',
          height: 12,
          width: 12,
          borderRadius: 6,
          position: 'absolute',
          left: 135,
          bottom: 6,
        }}>
        </View>
        {/* <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
          Tai con
        </Text> */}
        {<UpName cons={user2} />}

        <View style={{ flex: 1 }}></View>
        <TouchableOpacity onPress={() => {
          Alert.alert('Messenger', 'Call')
          // navigation.navigate('Setting')
        }}>
          <Image source={require('../../front_end/icons/phone-call.png')}
            style={{
              height: 25,
              width: 25,
              marginEnd: 20,
              tintColor: 'white'
            }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Alert.alert('Messenger', 'Video call')
          // navigation.navigate('Setting')
        }}>
          <Image source={require('../../front_end/icons/facetime-button.png')}
            style={{
              height: 25,
              width: 25,
              marginEnd: 10,
              tintColor: 'white'
            }} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        // style={{marginTop:50}}
        alwaysShowSend
        textInputStyle={{ color: 'black' }}
        renderSend={props => {
          return (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
              {imageUrl !== '' ? (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    marginRight: 10,
                  }}>
                  <Image
                    source={{ uri: imageData.assets[0].uri }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      position: 'absolute',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setImageUrl('');
                    }}>
                    <Image
                      source={require('../images/cross.png')}
                      style={{ width: 16, height: 16, tintColor: '#fff' }}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  alert('attach clicked');
                }}>
                <Image
                  source={require('../images/attach.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  alert('mic clicked');
                }}>
                <Image
                  source={require('../images/mic.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                  openCamera();
                }}>
                <Image
                  source={require('../images/image.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                <Image
                  source={require('../images/send.png')}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 10,
                    tintColor: 'orange',
                  }}
                />
              </Send>
            </View>
          );
        }}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.data.myId,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'orange',
                  marginStart: 50,
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default NewMessage;
