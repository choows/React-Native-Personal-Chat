import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

export default class SettingScreen extends React.Component {
    state = {
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <Text>Setting Screen</Text>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})