import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { EventRegister } from 'react-native-event-listeners';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import {IMAGE_URL} from '../constants/url';
class Card extends React.Component {
    render() {
        return (
            <View style={styles.CardView}>
                <Text>{this.props.text}</Text>
            </View>
        )
    }
}
//https://github.com/alexbrillant/react-native-deck-swiper/blob/master/Example/App.js
export default class GalleryScreen extends React.Component {
    state = {
        cards: ["hello", "Here", "Is", "Sample"]
    }
    componentDidMount = () => {
        EventRegister.addEventListener("AddNewImage", () => {

            //At here initialize the new image upload to firebase 
            ImagePicker.showImagePicker({
                title: 'Photo',
                takePhotoButtonTitle: 'Take Photo',
                chooseFromLibraryButtonTitle: 'Library',
                cancelButtonTitle: 'Cancel',
                mediaType: 'photo',
                quality: 1,
            }, (response) => {
                // console.log("Uri : " +response.uri);
                // console.log("path : "+response.path);
                // console.log("Type : " + response.type);
                // console.log("File Name" + response.fileName);
                // console.log("TimeStamp : " + response.timestamp);
                this.UploadToFirebaseStorage(response.path);
            })
        })
    }
    componentWillUnmount = () => {
        EventRegister.removeEventListener("AddNewImage");
    }
    UploadToFirebaseStorage=(path)=>{
        const currentDate =  new Date().getTime();
        let storage_path = currentDate.toString();
        firebase.storage().ref(storage_path).putFile(path).then((response)=>{
            //console.log("Download Url : " + response.downloadURL);
            this.UploadToFirebaseDatabase(response.downloadURL);
        }).catch((err)=>{
            console.log("Upload Error : " + err);
        });
    }

    UploadToFirebaseDatabase=(path)=>{
        const currentDate =  new Date().getTime().toString();
        firebase.database().ref(IMAGE_URL + "/" + currentDate).set({
            path : path
        }).catch((err)=>{
            console.log("Upload to Database Error : " + err);
        });
    }
    GoToPrevious = () => {
        this.swiper.swipeBack();
    }
    GoToNext = () => {
        this.swiper.swipeRight();
    }

    render() {
        return (
            <View style={styles.Container}>
                <View style={styles.SwpView}>
                    <Swiper
                        ref={swiper => {
                            this.swiper = swiper
                        }}
                        cards={this.state.cards}
                        renderCard={(card) => {
                            return (
                                <Card text={card} />
                            )
                        }}
                        cardIndex={0}
                        onSwipedLeft={() => { this.GoToPrevious }}
                        goBackToPreviousCardOnSwipeRight={true}
                        stackSize={3}
                        backgroundColor={"#2e3659"}
                        childrenOnTop={true}
                        infinite={true}
                        cardHorizontalMargin={10}
                        cardVerticalMargin={10}
                    >
                    </Swiper>
                </View>
                {
                    /**
                     * <View style={styles.NavigationView}>
                        <TouchableOpacity onPress={this.GoToPrevious} style={styles.ButtonView}>
                            <Text>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.GoToNext} style={styles.ButtonView}>
                            <Text>Next</Text>
                        </TouchableOpacity>
                </View>
                     */
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        height: '100%',
        width: '100%',
        alignContent: 'center',
        flex: 1
    },
    SwpView: {
        height: '100%',
        width: '100%'
    },
    NavigationView: {
        height: '5%',
        width: '100%',
        flexDirection: 'row'
    },
    ButtonView: {
        width: '50%',
        height: '100%'
    },
    CardView: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%'
    }
})