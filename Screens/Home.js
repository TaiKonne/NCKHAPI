import { View, Text, TouchableOpacity, PermissionsAndroid, Image } from 'react-native'
import React, { useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
const Home = () => {
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const openCamera = async () => {
        // if(PermissionsAndroid.PERMISSIONS===)
        // {

        // }
        const result = await launchCamera({ mediaType: 'photo' });
        setImageData(result);
        console.log(result);
    };
    const requesPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera',
                    message:
                        'Bạn được app yêu cầu mở camera lên đóa',
                    buttonNeutral: 'Hỏi tôi sau',
                    buttonNegative: 'Hủy',
                    buttonPositive: 'OK mở lunn',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // if (type == 1) {
                openCamera();
                // }
                // else if (type == 2) {
                //     openGallery();
                // }
                // else if (type == 3) {
                //     openVideoCamera();
                // }
                // else {
                //     openVideoGallery();
                // }
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    const uploadImage = async () => {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        await reference.putFile(pathToFile);
        const url = await storage()
            .ref(imageData.assets[0].fileName)
            .getDownloadURL();
        console.log(url);
    }
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {imageData !== null ? (
                <Image
                    source={{ uri: imageData.assets[0].uri }}
                    style={{ width: 200, height: 200, marginBottom: 40 }} />) : null
            }
            <TouchableOpacity style={{
                // backgroundColor: 'red',
                width: 200,
                height: 50,
                borderRadius: 10,
                borderWidth: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
            }} onPress={() => {
                // requesPermission();
                openCamera();
            }}>
                <Text style={{ color: 'black' }}>
                    Mở camera
                </Text>

            </TouchableOpacity>
            <TouchableOpacity style={{
                // backgroundColor: 'red',
                width: 200,
                height: 50,
                borderRadius: 10,
                borderWidth: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
            }} onPress={() => {
                uploadImage();
            }}>
                <Text style={{ color: 'black' }}>
                    Tải ảnh lên
                </Text>

            </TouchableOpacity>
        </View>
    )
}

export default Home;