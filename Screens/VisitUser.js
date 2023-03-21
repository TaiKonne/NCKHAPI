import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';


const VisitUser = ({ navigation }) => {
    const [viUser, setViUser] = useState([]);

    useEffect(() => {

    }, []);
    const getProfileVisit = async () => {

    }

    return (
        <View style={{
            width: '100%',
            height: 50,
            backgroundColor: 'green',
        }}>
            <Text>chao mung</Text>
        </View>
    )
}

export default VisitUser;