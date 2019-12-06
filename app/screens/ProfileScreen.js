import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import * as useractions from '../redux/action/user';
import { EventRegister } from 'react-native-event-listeners';
export default class ProfileScreen extends React.Component {
    state = {
        profile_image: '',
        display_name: 'No Display Name',
        email: '',
        EditProfile: false
    }
    componentDidMount() {
        const state = store.getState();
        state.users.ProfileImage !== '' ? this.setState({ profile_image: state.users.ProfileImage }) : null;
        state.users.displayName !== "" ? this.setState({ display_name: state.users.displayName }) : null;
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
        const state = store.getState();
        firebase.auth().currentUser.updateProfile({
            photoURL: this.state.profile_image,
            displayName: this.state.display_name,
        }).then(() => {
            store.dispatch(useractions.Setup(state.users.accountId, this.state.display_name, state.users.Email, this.state.profile_image));
            EventRegister.emit("Toast", "Update Profile Successfully");
        }).catch((err) => {
            console.log("Error : " + err);
        });
    }
    ProfileEdit = () => {
        if (this.state.EditProfile) {
            this.UpdateProfile();
        }
        this.setState({ EditProfile: !this.state.EditProfile });
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
                    <View style={styles.ProfileEditButtonView}>
                        {
                            this.state.EditProfile ?
                                <TouchableOpacity onPress={() => { this.setState({ EditProfile: !this.state.EditProfile }) }} style={{ backgroundColor: 'blue', borderRadius: 50, marginTop: 10, marginRight: 10 }}>
                                    <Text style={{ marginHorizontal: 10, marginVertical: 1, color: 'white' }}>Cancel</Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                        <TouchableOpacity onPress={this.ProfileEdit} style={{ backgroundColor: 'blue', borderRadius: 50, marginTop: 10, marginRight: 10 }}>
                            <Text style={{ marginHorizontal: 10, marginVertical: 1, color: 'white' }}>{this.state.EditProfile ? "Done" : "Edit"}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.ImageViewcontainer}>
                        <TouchableOpacity onPress={this.state.EditProfile ? this.ShowImagePicker : null} style={styles.Image}>
                            <Image source={{ uri: this.state.profile_image }} style={styles.Image} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ProfileNamecontainer}>
                        {
                            this.state.EditProfile ?
                                <TextInput value={this.state.display_name} onChangeText={(text) => { this.setState({ display_name: text }) }} multiline={false} style={{ borderWidth: 0.2, textAlign: 'center', borderRadius: 50, marginVertical: 2, marginHorizontal: 5 }} />
                                :
                                <Text>{this.state.display_name}</Text>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', height: '20%', borderWidth: 0.1 }}>
                        <View style={{ width: '20%', borderWidth: 0.1 }}>
                            <Text style={{ margin: 5 }}>Email</Text>
                        </View>
                        <View style={{ width: '80%', borderWidth: 0.1 }}>
                            <Text style={{ margin: 5 }}>{this.state.email}</Text>
                        </View>
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
    },
    ProfileEditButtonView: {
        flexDirection: 'row-reverse'
    }
})