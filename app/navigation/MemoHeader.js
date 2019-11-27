import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
export default class MemoHeader extends React.Component {

    OnImageIconPressed = () => {
        EventRegister.emit("AddNewMemo" , null);
    }

    render() {
        return (
            <View style={styles.HeaderContainer}>
                <View style={styles.TextContainer}>
                    <Text>Memo</Text>
                </View>
                <View style={styles.ImageContainer}>
                    <TouchableOpacity onPress={this.OnImageIconPressed} style={styles.HeaderContainer}>
                        <Image source={require("../assets/plus_icon.jpg")} style={styles.Image} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    HeaderContainer: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    Image: {
        height: '100%',
        width: '100%',
        right: 0,
        resizeMode: 'contain'
    },
    ImageContainer: {
        width: '20%',
        height: '100%',
        flexDirection: 'row-reverse'
    },
    TextContainer: {
        width: '80%',
        height: '100%'
    }
})