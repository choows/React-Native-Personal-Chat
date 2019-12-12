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
            EventRegister.emit("Toast", "Profile updated successfully");
        }).catch((err) => {
            EventRegister.emit("Toast", "Profile updated failed");
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
    getUserID = () => {
        const state = store.getState();
        const Email = state.users.Email;
        const UserID = Email.split('@')[0];
        return '@' + UserID;
    }
    Cancel=()=>{
        this.props.navigation.navigate('Home');
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={[styles.container, { alignContent: 'center', alignItems: 'center' }]}>
                        <View style={styles.ImageViewcontainer}>
                            <TouchableOpacity onPress={this.ShowImagePicker} style={styles.Image}>
                                <Image source={{ uri: this.state.profile_image }} style={styles.Image} />
                            </TouchableOpacity>
                        </View>

                        {/*Below is the details of users ::: */}
                        <View style={styles.SegmentDetailOuterLayer}>
                            <Text style={styles.SegmentTitle}>User Name</Text>
                            <View style={styles.SegmentDetailInnerDetail}>
                                <Text>{this.getUserID()}</Text>
                            </View>
                        </View>
                        <View style={styles.SegmentDetailOuterLayer}>
                            <Text style={styles.SegmentTitle}>Display Name</Text>
                            <View style={[styles.SegmentDetailInnerDetail , {height : 40}]}>
                                <TextInput value={this.state.display_name} onChangeText={(text) => { this.setState({ display_name: text }) }} multiline={false} style={{ borderWidth: 0, width : '100%', color : 'black', padding : 0 }} />
                            </View>
                        </View>
                        <View style={styles.SegmentDetailOuterLayer}>
                            <Text style={styles.SegmentTitle}>Email</Text>
                            <View style={styles.SegmentDetailInnerDetail}>
                                <Text>{this.state.email}</Text>
                            </View>
                        </View>
                        <View style={[styles.SegmentDetailOuterLayer , { flexDirection : 'row', alignItems : 'center' , alignContent : 'center', marginTop : '15%'}]}>
                            <TouchableOpacity style={{height : 50 , width : '40%' ,justifyContent : 'center' , borderWidth : 0.2 , borderRadius : 10 , alignContent : 'center' , alignItems : 'center' , backgroundColor : '#3ded37'}} onPress={this.UpdateProfile}> 
                                <Text style={{fontWeight : 'bold'}}>SAVE</Text>
                            </TouchableOpacity>
                            <View style={{width : '20%'}}>
                                <Text></Text>
                            </View>
                            <TouchableOpacity style={{height : 50 , width : '40%' , justifyContent : 'center' , borderWidth : 0.2 , borderRadius : 10, alignContent : 'center' , alignItems : 'center'}} onPress={this.Cancel}>
                                <Text style={{fontWeight : 'bold'}}>CANCEL</Text>
                            </TouchableOpacity>
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
        height: '100%',
        backgroundColor: '#d6d9d0'
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
    },
    SegmentDetailOuterLayer: {
        width: '90%',
    },
    SegmentTitle: {
        fontSize: 14,
        color: '#9c9a97'
    },
    SegmentDetailInnerDetail: {
        width: '100%',
        height: 30,
        borderRadius: 7,
        borderWidth: 0.2,
        backgroundColor: 'white',
        justifyContent: 'center',
        textAlign: 'right',
        padding: 5
    }
})