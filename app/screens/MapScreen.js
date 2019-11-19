import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { LOCATION_URL } from '../constants/url';
import store from '../redux/store';
import { EventRegister } from 'react-native-event-listeners';

export default class MapScreen extends React.Component {
    state = {
        self_latitude: 37.78825,
        self_longitude: -122.4324,
        d_latitude: 0.00,
        d_longitude: 0.00,
        marker : []
    }
    componentDidMount() {
        const state = store.getState();
        this.GetInitialLocation(state.users.accountId);
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'always'
        });
        this.StartListenLocation();
    }
    GetInitialLocation = (currentUserID) => {
        firebase.database().ref(LOCATION_URL).once('value', (snapshot) => {
            let keys = Object.keys(snapshot.toJSON());
            keys.map((key) => {
                // if(key === currentUserID){
                //     this.setState({self_latitude : snapshot.toJSON()[key]["location"]["latitude"]})
                //     this.setState({self_longitude : snapshot.toJSON()[key]["location"]["longititude"]})
                // }else{
                //     this.setState({d_latitude : snapshot.toJSON()[key]["location"]["latitude"]})
                //     this.setState({d_longitude : snapshot.toJSON()[key]["location"]["longititude"]})
                // }
            })
        })
    }
    StartListenLocation() {
        firebase.database().ref(LOCATION_URL).on('child_changed', (snapshot) => {
            if (snapshot.exists()) {
                console.log(JSON.stringify(snapshot.toJSON()));
                this.state.marker.map((individual_marker)=>{
                    if(individual_marker.UID === snapshot.toJSON()["location"]["UID"]){
                        individual_marker.latitude = snapshot.toJSON()["location"]["latitude"];
                        individual_marker.longitude = snapshot.toJSON()["location"]["longitude"];
                        this.setState({marker : this.state.marker});
                    }else{

                        this.state.marker.push({
                            latitude : snapshot.toJSON()["location"]["latitude"],
                            longitude : snapshot.toJSON()["location"]["longitude"],
                            UID : snapshot.toJSON()["location"]["UID"]
                        });
                        this.setState({marker : this.state.marker});
                    }
                })
            }
        })
    }

    SendLocation = () => {
        console.log("Sended");
        const state = store.getState();
        Geolocation.watchPosition((position) => {
            let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                UID: state.users.accountId
            }
            firebase.database().ref(LOCATION_URL + state.users.accountId).set({
                location: location
            }).catch((err) => {
                console.log("Send Message Error : " + err);
            });
        }, (err) => {
            console.log("Error : " + err.message);
        }, { enableHighAccuracy: true });
    }


    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.MapViewContainer}
                    initialRegion={{
                        latitude: 45.26,
                        longitude: -122.08,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {
                        this.state.marker.map((mark)=>
                        <Marker coordinate={{latitude: mark.latitude , longitude : mark.longitude}} title={mark.UID}/>
                        )
                    }
                </MapView>
                <TouchableOpacity style={styles.ButtonViewContainer} onPress={this.SendLocation}>
                    <Text style={{ height: '100%', width: '100%', textAlign: 'center' }}>Start Listen</Text>
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