import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Splash from './Splash'
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
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
                    name="Home"
                    component={props => <Home {...props} />}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;