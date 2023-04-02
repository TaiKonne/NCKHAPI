import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal } from 'react-native';

const SimpleModal = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={{color:'black'}}>Show Popup</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                        <Text style={{color:'black'}}>This is a simple modal</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ marginTop: 20, color: 'black' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SimpleModal;
