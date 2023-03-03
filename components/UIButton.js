import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { colors } from '../constants/'


function UIButton(props) {
    const { onPress, title, isSelected } = props
    return <TouchableOpacity
        onPress={props.onPress} // truyền onPress từ bên welcome
        style={{ // bottom 1
            borderColor: 'white',
            borderWidth: 2,
            height: 45,
            borderRadius: 5,
            marginHorizontal: 15,
            marginVertical: 10,
            justifyContent: 'center',
            // alignSelf:'center',
            alignContent: 'center',
            color: 'skyblue',
            backgroundColor: (isSelected == true) ? 'white' : null
        }}>
        {isSelected == true && <Icon
            name={'check-circle'}
            style={{
                color: '#14d294',
                fontSize: 20,
                width: 20,
                position: 'absolute',
                marginLeft: 10,
                bottom: 12
            }} />}
        <Text
            style={{
                color: isSelected == true ? colors.primary : 'white',
                fontWeight: 'bold',
                alignSelf: 'center',
            }}>
            {props.title}
        </Text>
    </TouchableOpacity>
}

export default UIButton
