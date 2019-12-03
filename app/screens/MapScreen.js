import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native'
import firebase from 'react-native-firebase';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { LOCATION_URL } from '../constants/url';
import store from '../redux/store';
import { EventRegister } from 'react-native-event-listeners';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';

export default class MapScreen extends React.Component {
    state = {
        GeoWatchID: null,
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
    RequestLocationPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location Request',
            'message': 'Location is required to access the function ... ',
        }).then((granted) => {
            console.log('granted', granted);
            // always returns never_ask_again
        })
    }
    componentDidMount() {
        this.RequestLocationPermission();
        //this.GetInitialLocation(state.users.accountId);
        //Geolocation.requestAuthorization();
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
        const state = store.getState();
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
                if (state.users.accountId === unknown_marker["UID"]) {
                    let new_region = {
                        latitude: unknown_marker.latitude,
                        longitude: unknown_marker.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                    this.setState({ region: new_region });
                }
                this.focusOnMarkers();
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
        console.log(location);
        firebase.database().ref(LOCATION_URL + state.users.accountId).update({
            location: location
        }).then(() => {
            console.log("Done Upload To firebase");
        })
            .catch((err) => {
                console.log("Send Message Error : " + err);
            });
    }

    SendLocation = () => {
        if (this.state.listening) {
            //clearInterval(sender);
            this.state.GeoWatchID !== null ? Geolocation.clearWatch(this.state.GeoWatchID) : null;
        } else {
            let watchID = Geolocation.watchPosition((position) => {
                let region = {
                    longitudeDelta: 0.0922,
                    latitudeDelta: 0.0922,
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                }
                this.UploadLocation(region);
            }, (err) => {
                console.log("Watch Location Error : " + err.message);
            }, { enableHighAccuracy: true, maximumAge: 0 });
            this.setState({ GeoWatchID: watchID });
        }
        this.setState({ listening: !this.state.listening });

    }
    focusOnMarkers = () => {
        let markerID = [];
        this.state.marker.map((mark) => {
            markerID.push({
                latitude: mark.latitude,
                longitude: mark.longitude
            });
        });
        this.MapView.fitToCoordinates(markerID, { animated: true })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.display_map ?
                    <MapView

                        style={styles.MapViewContainer}
                        initialRegion={this.state.region}
                        region={this.state.region}
                        ref={ref => this.MapView = ref}
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
                    <Text style={styles.ButtonText}>{this.state.listening ? "STOP" : "START"}</Text>
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
        height: '10%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dynamic_side_drawer_icon_color()
    },
    ButtonText: {
        fontSize: 20
    }
})