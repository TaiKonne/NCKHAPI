
import { AppRegistry } from 'react-native'
import React from 'react'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import Index from './Screens/Index'
import NewMessage from './Screens/chat/NewMessage'
import Splash from './Screens/Splash'
import Add from './Screens/tabs/Add'
import Home from './Screens/tabs/Home'
import Setting from './Screens/Setting'
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('vai lon luon', remoteMessage);
// });
AppRegistry.registerComponent(appName,
    () => () => <Index/>)
