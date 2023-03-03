
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import Index from './Screens/Index'
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('vai lon luon', remoteMessage);
// });
AppRegistry.registerComponent(appName,
    () => () => <Index />)
