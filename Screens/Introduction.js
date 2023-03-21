import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';





function Introduction(props) {
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
    </View>

}
export default Introduction