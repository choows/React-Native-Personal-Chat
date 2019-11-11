import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { LOCATION_URL } from '../constants/url';
import store from '../redux/store';
import { EventRegister } from 'react-native-event-listeners';

export default class MapScreen extends React.Component {
    state={
        self_latitude : 37.78825,
        self_longitude : -122.4324
    }
    componentDidMount(){
        const state = store.getState();
        Geolocation.setRNConfiguration({
            skipPermissionRequests : false,
            authorizationLevel : 'always'
        });
    }

    SendLocation=()=>{
        console.log("Here");
        const state = store.getState();
        
        Geolocation.getCurrentPosition((position)=>{
           let location = {
               latitude : position.coords.latitude,
               longitude : position.coords.longitude
           }
            firebase.database().ref(LOCATION_URL + state.users.accountId).set({
                location : location
            }).catch((err)=>{
                console.log("Send Message Error : " + err);
            });
        } , (err)=>{
            console.log("Error : " + err.message);
        } , {enableHighAccuracy : true});
    }

    StartListenLocation(){
       this.SendLocation();
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                style={styles.MapViewContainer}
                    initialRegion={{
                        latitude: this.state.self_latitude,
                        longitude: this.state.self_longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
                <TouchableOpacity style={styles.ButtonViewContainer} onPress={this.SendLocation}>
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