import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Icon, Divider } from 'react-native-elements';

export default class MemoHeader extends React.Component {

    OnImageIconPressed = () => {
        EventRegister.emit("AddNewMemo" , null);
    }

    render() {
        return (
            <View style={styles.HeaderContainer}>
                 <View style={styles.TextContainer}>
                    <Text style={styles.TitleText}>Memo</Text>
                </View>
                <View style={styles.ImageContainer}>
                    <TouchableOpacity onPress={this.OnImageIconPressed} style={styles.HeaderContainer}>
                    <Icon name='plus' type='font-awesome'/>                    
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
        width: '10%',
        height: '100%',
        flexDirection: 'row-reverse'
    },
    TextContainer: {
        width: '90%',
        height: '50%',
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    TitleText: {
        height : '100%',
        flex : 1,
        fontSize : 20,
        marginLeft : 10,
        alignSelf : 'flex-start'
    }
})