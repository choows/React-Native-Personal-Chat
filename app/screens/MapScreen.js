import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';
import MapView from 'react-native-maps';
export default class MapScreen extends React.Component {
    state = {

    }
    render() {
        return (
            <View style={styles.container}>
                <MapView
                style={styles.MapViewContainer}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
                <TouchableOpacity style={styles.ButtonViewContainer}>
                    <Text>Start Listen</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    MapViewContainer: {
        width: '100%',
        height: '90%'
    },
    ButtonViewContainer: {
        width: '100%',
        height: '10%'
    }
})