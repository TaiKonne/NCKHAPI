import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { images, colors, icons, fontSizes } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'


function UIHeader(props)
{
    const{
        title, 
        leftIconName, 
        rightIconName,
        onPressLeftIcon,
        onPressRightIcon,
    } = props
    return <View style={{
        height : 55, 
        backgroundColor : colors.primary,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    }} >
        {leftIconName != undefined ?<Icon 
            style={{padding: 10}}
            name={leftIconName}
            size={18} 
            color = {'white'}
            onPress={onPressLeftIcon}       
        /> : <View style={{width:50 , height: 50 ,}} />}
       <Text style={{
            fontSize : fontSizes.h1,
            alignSelf : 'center',
            lineHeight: 45,
            color : 'white',
            fontWeight : 'bold'
       }}>{title}</Text>
       {rightIconName != undefined ?<Icon 
            style={{padding: 10}}
            name={rightIconName}
            size={18} 
            color = {'white'}
            onPress={onPressRightIcon}       
        /> : <View style={{width:50 , height: 50 ,}} />}
    </View>
}
export default UIHeader