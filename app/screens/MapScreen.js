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
        marker: [],
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        display_map: false,
        listening: false
    }
    componentDidMount() {
        this.getCurrentLocation();
        //this.GetInitialLocation(state.users.accountId);
        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'always'
        });
        this.getCurrentLocation();

        this.StartListenLocation();

    }
    getCurrentLocation = () => {
        Geolocation.getCurrentPosition((position) => {
            let new_region = {
                longitudeDelta: 0.0922,
                latitudeDelta: 0.0922,
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            }
            this.setState({ region: new_region });
            this.setState({ display_map: true });
        });
    }
    StartListenLocation() {
        firebase.database().ref(LOCATION_URL).on('child_changed', (snapshot) => {
            if (snapshot.exists()) {
                let unknown_marker = {
                    latitude: snapshot.toJSON()["location"]["latitude"],
                    longitude: snapshot.toJSON()["location"]["longitude"],
                    UID: snapshot.toJSON()["location"]["UID"]
                }
                let index = this.state.marker.findIndex((x) => x.UID === unknown_marker.UID);
                if (index < 0) {
                    this.state.marker.push(unknown_marker);
                    this.setState({ marker: this.state.marker });
                } else {
                    this.state.marker[index] = unknown_marker;
                    this.setState({ marker: this.state.marker });
                }
                console.log("Done set marker ...");
            }
        })
    }

    CallergetCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition((position) => {
                let new_region = {
                    longitudeDelta: 0.0922,
                    latitudeDelta: 0.0922,
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                }
                resolve(new_region);
            });
        });

    }

    UploadLocation = (region) => {
        const state = store.getState();
        let location = {
            latitude: region.latitude,
            longitude: region.longitude,
            UID: state.users.accountId
        }
        firebase.database().ref(LOCATION_URL + state.users.accountId).set({
            location: location
        }).then(()=>{
            console.log("Done Upload To firebase");
        })
        .catch((err) => {
            console.log("Send Message Error : " + err);
        });
    }

    SendLocation = () => {
        if (this.state.listening) {
            clearInterval(sender);
        } else {
            sender = setInterval(() => {
                this.CallergetCurrentLocation().then((result)=>{
                    this.UploadLocation(result);
                })
            }, 15000);
        }
        this.setState({ listening: !this.state.listening });
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.display_map ?
                    <MapView
                        style={styles.MapViewContainer}
                        initialRegion={this.state.region}
                        region={this.state.region}
                    >
                        {
                            this.state.marker.map((mark) =>
                                <Marker
                                    key={mark.UID}
                                    coordinate={{ latitude: mark.latitude, longitude: mark.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003 }}
                                    title={mark.UID}
                                />
                            )
                        }
                    </MapView>
                    :
                    <View style={styles.MapViewContainer}>
                    </View>
                }

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