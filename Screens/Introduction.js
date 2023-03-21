import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Swiper from 'react-native-swiper';
import { useIsFocused, useNavigation } from '@react-navigation/native';



function Introduction(props) {
    const navigation = useNavigation();
    return <View style={{
        backgroundColor: '#fff',
        flex: 1,
    }}>
        <View
            style={{
                width: '100%',
                height: 60,
                justifyContent: 'center',
                // paddingLeft: 20,
                backgroundColor: 'skyblue',
            }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                User Guide For Newbies
            </Text>
        </View>
        <Swiper showsButtons={true} style={{
            marginTop:10,
        }}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../front_end/Intro/home.png')}
                    style={{
                        height: 600,
                        width: 300,
                        resizeMode: 'cover',
                    }}
                />
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../front_end/Intro/post.png')}
                    style={{
                        height: 600,
                        width: 300,
                        resizeMode: 'cover',
                    }}
                />
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../front_end/Intro/search.png')}
                    style={{
                        height: 600,
                        width: 300,
                        resizeMode: 'cover',
                    }}
                />
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../front_end/Intro/profile.png')}
                    style={{
                        height: 600,
                        width: 300,
                        resizeMode: 'cover',
                    }}
                />
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../front_end/Intro/settings.png')}
                    style={{
                        height: 600,
                        width: 300,
                        resizeMode: 'cover',
                    }}
                />
            </View>
        </Swiper>
        <TouchableOpacity 
        onPress={() => {
            navigation.navigate('HomeSC')
        }}
        style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf:'center',
            borderWidth: 1,
            borderColor: 'orange',
            borderRadius: 10, 
            marginBottom: 10,
            marginTop: 10,
            width:100,
            backgroundColor:'orange',
        }}>
            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 10 }}>OK</Text>
        </TouchableOpacity>
    </View>
}
export default Introduction