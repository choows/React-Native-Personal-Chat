import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

export default class SettingScreen extends React.Component {
    state = {
        profile_image: 'https://firebasestorage.googleapis.com/v0/b/dearapp-debe1.appspot.com/o/profile_Image.png?alt=media&token=540c023f-c81a-40c0-a963-61b468340503',
        display_name: '',
        email: '',
    }
    componentDidMount() {
        const state = store.getState();
        state.users.ProfileImage !== '' ? this.setState({ profile_image: state.users.ProfileImage }) : null;
        state.users.displayName !== "" ? this.setState({ displayName: state.users.displayName }) : null;
        state.users.Email !== '' ? this.setState({ email: state.users.Email }) : null;
    }
    ShowImagePicker = () => {
        ImagePicker.showImagePicker({
            title: 'Photo',
            takePhotoButtonTitle: 'Take Photo',
            chooseFromLibraryButtonTitle: 'Library',
            cancelButtonTitle: 'Cancel',
            mediaType: 'photo',
            quality: 1,
        }, (response) => {
            if (!response.didCancel) {
                this.UploadToFirebaseStorage(response.path);
            }
        })
    }

    UpdateProfile = () => {
        firebase.auth().currentUser.updateProfile({
            photoURL: this.state.profile_image,
            displayName: this.state.display_name,
        }).then(() => {
            console.log("Done Update Profile");
        })
    }
    UploadToFirebaseStorage = (path) => {
        const currentDate = new Date().getTime();
        let storage_path = currentDate.toString();
        firebase.storage().ref(storage_path).putFile(path).then((response) => {
            this.setState({ profile_image: response.downloadURL });
        }).catch((err) => {
            console.log("Update Error : " + err);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.ImageViewcontainer}>
                        <TouchableOpacity onPress={this.ShowImagePicker} style={styles.Image}>
                            <Image source={{ uri: this.state.profile_image }} style={styles.Image} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ProfileNamecontainer}>
                        <Text>{this.state.display_name}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    ImageViewcontainer: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    Image: {
        height: 80,
        width: 80,
        borderRadius: 300,
        borderWidth: 0.5
    },
    ProfileNamecontainer: {
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    ProfileName: {
        fontSize: 20,
        textAlign: 'center'
    }
})