import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Switch,
    toggleSwitch,
    TextInput
} from 'react-native'


function Setting(props) {
    const [language, setlanguage] = useState('English')

    const [addressInput, setAddressInput] = useState(0)
    const [usernames , setUsernames] = useState(0)
    return <View style={{
        flex: 1,
        backgroundColor: 'white',
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
                Setting
            </Text>
        </View>
        <ScrollView>
            {/* language */}
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Language</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (language == 'English')
                        setlanguage('Vietnamese')
                    else
                        setlanguage('English')
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 10,

                    }}>Language</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Text style={{
                        color: 'grey',
                        fontSize: 15,
                        paddingStart: 10,
                        paddingEnd: 10
                    }}>{language}</Text>
                </View>
            </TouchableOpacity>
            {/* Infor */}
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 18,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Information</Text>
            </View>
            {/* userName */}
            <TouchableOpacity onPress={() => {
                usernames == 0 ? setUsernames(1) : setUsernames(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 10,

                    }}>Usernames</Text>
                    <View style={{ flex: 1 }} ></View>
                </View>
            </TouchableOpacity>
            {usernames == 1 ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 35,
                            width: 250,
                            color: 'black',
                        }}
                        autoFocus
                    />
                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setUsernames(0)
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height:35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
            {/* Avatar */}
            
            {/* Address */}
            <TouchableOpacity onPress={() => {
                addressInput == 0 ? setAddressInput(1) : setAddressInput(0)
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center'
                }} >
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 10,

                    }}>Address</Text>
                    <View style={{ flex: 1 }} ></View>
                </View>
            </TouchableOpacity>
            {addressInput == 1 ? (
                <View style={{
                    // backgroundColor: 'skyblue',
                    flexDirection: 'row',
                    // flex: 1,
                }}>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: 'gray',
                            marginStart: 30,
                            // marginEnd: 30,
                            height: 35,
                            width: 250,
                            color: 'black',
                        }}
                        autoFocus
                    />
                    <View style={{
                        // backgroundColor: 'skyblue',
                        flex: 1,
                        // marginEnd: 5,
                        marginBottom: 5
                    }}>
                        <TouchableOpacity onPress={() => {
                            setAddressInput(0)
                        }}>
                            <View style={{
                                alignSelf: 'flex-end',
                                borderWidth: 0.2,
                                borderRadius: 5,
                                backgroundColor: 'skyblue',
                                // marginTop: 10,
                                marginEnd: 30,
                                height:35,

                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 15,
                                    padding: 5,
                                    fontWeight: 'bold',

                                }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : ""}
        </ScrollView>
    </View>
}
export default Setting;