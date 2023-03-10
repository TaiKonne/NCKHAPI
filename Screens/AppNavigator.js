import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from './Splash';
import Login from './Login';
import Signup from './Signup';
import HomeSC from './HomeSC';
import Comments from './Comments';
import Messages from './Messages';
import MyMessages from './MyMessages';
import NewMessage from './chat/NewMessage';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Splash"
                    component={props => <Splash {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={props => <Login {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Signup"
                    component={props => <Signup {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeSC"
                    component={props => <HomeSC {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Comments"
                    component={props => <Comments {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Messages"
                    component={props => <Messages {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyMessages"
                    component={MyMessages}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NewMessage"
                    component={NewMessage}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;