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


function Setting ( props)
{
    const [language, setlanguage] = useState('English')
    return <View style={{
        flex: 1 , 
        backgroundColor:'white',
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
            <View style={{
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.2)',
                opacity: 0.3,
                justifyContent: 'center',
            }} >
                <Text style={{
                    color: 'black',
                    fontSize: 15,
                    color: 'red',
                    paddingStart: 10,
                    fontWeight: 'bold'
                }}>Language</Text>
            </View>
            {/* ------------------------------------------------------------------------------------------------------------ */}
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
                    {/* <Icon
                        style={{ marginStart: 10 }}
                        name='language'
                        size={18}
                        color={'black'}
                    /> */}
                    <Text style={{
                        color: 'black',
                        fontSize: 15,
                        paddingStart: 10,

                    }}>Language</Text>
                    <View style={{ flex: 1 }} ></View>
                    <Text style={{
                        color:'grey',
                        fontSize: 15,
                        paddingStart: 10,
                        paddingEnd: 10
                    }}>{language}</Text>
                    {/* <Icon
                        style={{ marginEnd: 10 }}
                        name='chevron-right'
                        size={18}
                        color={colors.inactive}
                    /> */}
                </View>
            </TouchableOpacity>
        </ScrollView>
    </View>
}
export default Setting;