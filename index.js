
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import Index from './Screens/Index'
import NewMessage from './Screens/chat/NewMessage'
import Splash from './Screens/Splash'
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('vai lon luon', remoteMessage);
// });
AppRegistry.registerComponent(appName,
    () => () => <Index />)
