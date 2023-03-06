import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
    const [postData, setPostData] = useState([]);
    useEffect(() => {
        getData();
    },)
    const getData = () => {
        let tempData = [];
        firestore()
            .collection('posts')
            .get()
            .then(querySnapshot => {
                console.log('Total posts: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    tempData.push(documentSnapshot.data());
                    console.log('User ID: ',
                        documentSnapshot.id,
                        documentSnapshot.data());
                });
                setPostData(tempData);
            });
    }
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={{
                width: '100%',
                height: 60,
                justifyContent: 'center',
                paddingLeft: 20,
                backgroundColor: '#fff',
            }}>
                <Text style={{
                    fontSize: 20,
                    color: '#000',
                    fontWeight: '700',
                }}>
                    firebase demo
                </Text>
            </View>
            {postData.length > 0 ? (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={postData}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                width: '90%',
                                // height: 200,
                                alignSelf: 'center',
                                marginTop: 20,
                                backgroundColor: '#fff',
                                borderRadius: 20,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}>
                                    <Image source={require('../../front_end/icons/user_1.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            marginLeft: 15,
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: 10,
                                        marginLeft: 15,
                                        fontWeight: '600',
                                        color: 'black',
                                    }} >
                                        {item.name}
                                    </Text>
                                </View>
                                <Text style={{
                                    marginTop: 10,
                                    color: 'black',
                                    marginRight:20,
                                    marginBottom:10,
                                }}>
                                    {item.caption}
                                </Text>
                                < Image source={{ uri: item.image }}
                                    style={{
                                        width: '90%',
                                        height: 200, // sửa khác so với video, video là 120
                                        alignSelf: 'center',
                                        borderRadius: 10,
                                        marginBottom:20,

                                    }}
                                />
                            </View>
                        )
                    }}
                />) : (
                < View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: 'black',
                    }}>
                        No Post Found
                    </Text>
                </View >
            )}

        </View >
    )
}
/** INFJ
 * D
    1 2
    1

 */
export default Home;