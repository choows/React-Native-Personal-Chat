import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, AsyncStorage } from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import { MESSAGE_URL } from '../constants/url';
import { GetDearImageAndName } from '../util/UserSetup';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';
import { EventRegister } from 'react-native-event-listeners';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
class MessageDetail extends React.Component {
    state = {
        UserId: '',
    }
    componentDidMount() {
        const state = store.getState();
        this.setState({ UserId: state.users.accountId });
        //console.log(state.users.accountId);
        // this.setState({New_Line : this.props.newLine(this.props.message_detail.message.SendBy)}) ;
    }

    /*
    this.props.newLine === false means first line 
    this.props.newLine === true means second line 
    */

    render() {

        switch (this.props.message_detail.message.Type) {
            case "text": {
                if (this.props.message_detail.message.SendBy === this.state.UserId) {
                    //self
                    return (
                        <View style={[styles.SelfTextContainer, styles.CommonTextContainer]}>
                            <View style={[styles.SelfTextView, { backgroundColor: dynamic_side_drawer_item_background() }]}>
                                <View style={{ margin: 8 }}>
                                    <Text style={styles.ChatMessageText}>{this.props.message_detail.message.Detail}</Text>
                                </View>
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View style={[styles.OpoTextContainer, styles.CommonTextContainer]}>
                            <View style={styles.OpoTextView}>
                                <View style={{ margin: 8 }}>
                                    <Text style={styles.ChatMessageText}>{this.props.message_detail.message.Detail}</Text>
                                </View>
                            </View>
                        </View>
                    )
                }
                break;
            }
            case 'image': {
                if (this.props.message_detail.message.SendBy === this.state.UserId) {
                    //self
                    return (
                        <View style={[styles.SelfTextContainer, styles.CommonTextContainer]}>
                            <View style={[styles.SelfTextView, { backgroundColor: dynamic_side_drawer_item_background() , borderTopLeftRadius : 0 , borderBottomLeftRadius : 0 , borderTopRightRadius : 0 }]}>
                                <View>
                                    <Image style={{height : 250 , width : 170}} source={{ uri: this.props.message_detail.message.Detail }} />
                                </View>
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View style={[styles.OpoTextContainer, styles.CommonTextContainer]}>
                            <View style={[styles.OpoTextView , {borderTopRightRadius : 0 , borderBottomLeftRadius : 0 , borderBottomRightRadius : 0 }]}>
                                <View>
                                    <Image style={{height : 250 , width : 170}} source={{ uri: this.props.message_detail.message.Detail }} />
                                </View>
                            </View>
                        </View>
                    )
                }
                break;
            }
        }


    }
}

export default class HomeScreen extends React.Component {

    state = {
        message: '',
        chat_message: [],
        startlisten: false,
        oppoImage: '',
        oppoDisplay_Name: '',
        Message_UID: ''
    }
    sendMessage = () => {
        const state = store.getState();
        if (this.state.message != "") {
            let date_nw = new Date().getTime();
            let message_send = {
                "Detail": this.state.message,
                "Type": 'text',
                "SendBy": state.users.accountId,
                "DateTime": date_nw
            }
            firebase.database().ref(MESSAGE_URL + "/" + date_nw.toString()).set({
                message: message_send
            }).then(() => {
                this.setState({ message: '' });
            }).catch((err) => {
                console.log("Send Message Error : " + err);
            });
        }

    }

    SetUpOppoDetails = () => {
        const state = store.getState();
        firebase.database().ref('Users/').once('value', (snapshot) => {
            if (snapshot.exists) {
                const result = snapshot.toJSON();
                let keys = Object.keys(snapshot.toJSON());
                keys.map((key) => {
                    if (key !== state.users.accountId) {
                        //later have to change here... Display Name Spelling Error 
                        this.setState({ oppoImage: result[key]["ProfileImage"], oppoDisplay_Name: result[key]["DislpayName"] });
                    }
                });
            }
        }).catch((err) => {
            console.log("Get Dear Detail Error : " + err);
        });
    }
    SetToInitialState = () => {
        this.setState({ chat_message: [], oppoImage: '', oppoDisplay_Name: '' });
    }
    /**
     * when last line is self , then his line is oppo then return true 
     * */
    checker = store.getState().users.accountId;
    CheckNewLine = (UID) => {
        // const state = store.getState();
        // const currentUserID = state.users.accountId;
        // if (this.checker === currentUserID && UID !== currentUserID) {
        //     this.checker = UID;
        //     console.log("True : " + this.checker + "    " + UID);
        //     return true;
        // } else {
        //     if (this.checker !== UID) {
        //         this.checker = UID;
        //     }
        //     this.checker = UID;
        //     console.log("False : " + this.checker + "    " + UID);

        //     return false
        // }
        return false;
    }
    componentDidMount() {
        firebase.messaging().subscribeToTopic("ChooAndLeow");
        this.SetToInitialState();
        this.SetUpOppoDetails();
        let one_week_ago = new Date();
        one_week_ago.setDate(one_week_ago.getDate() - 7);
        var to_milli = one_week_ago.getTime();
        //EventRegister.emit('Toast' , "Hello Sample Toast Here");
        // firebase.database().ref(MESSAGE_URL).once('value', (snapshot) => {
        //     let temp_arr = [];
        //     if (snapshot.val()) {
        //         let keys = Object.keys(snapshot.toJSON());
        //         keys.filter((key) => {
        //             return parseInt(key) > to_milli;
        //         }).sort((key_a, key_b) => {
        //             return parseInt(key_a) < parseInt(key_b);
        //         }).map((key) => {
        //             temp_arr.push(snapshot.toJSON()[key.toString()]);
        //         });

        //         this.setState({ chat_message: temp_arr });
        //     }
        // });


        firebase.database().ref(MESSAGE_URL).on('child_added', (snapshot) => {
            if (snapshot.exists()) {
                let key = Object.keys(snapshot.toJSON())[0];
                //alert(key);
                if (parseInt(snapshot.toJSON()[key]["DateTime"]) > one_week_ago.getTime()) {
                    this.state.chat_message = [snapshot.toJSON()].concat(this.state.chat_message);
                    this.setState({ chat_message: this.state.chat_message });
                }

            }
        })

    }
    OnNewImageClicked = () => {
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
    UploadToFirebaseStorage = (path) => {
        const currentDate = new Date().getTime();
        let storage_path = currentDate.toString();
        firebase.storage().ref(storage_path).putFile(path).then((response) => {
            this.SendImage(response.downloadURL);
            this.UploadToFirebaseDatabase(response.downloadURL, path);
            console.log('Uploaded To Image');
        }).catch((err) => {
            console.log("Upload Error : " + err);
        });
    }

    SendImage = (path) => {
        console.log("In Send Image.");
        const state = store.getState();
        let date_nw = new Date().getTime();
        let message_send = {
            "Detail": path,
            "Type": 'image',
            "SendBy": state.users.accountId,
            "DateTime": date_nw
        }
        firebase.database().ref(MESSAGE_URL + "/" + date_nw.toString()).set({
            message: message_send
        }).then(() => {
            EventRegister.emit("Toast", "Image Sended");
        }).catch((err) => {
            console.log("Send Message Error : " + err);
        });
    }
    UploadToFirebaseDatabase = (path, url) => {
        const currentDate = new Date().getTime().toString();
        firebase.database().ref(IMAGE_URL + "/" + currentDate).set({
            path: path,
            DateTime: currentDate,
            url: url
        }).then(() => {
            EventRegister.emit("Toast", "Upload Image Successfully");
        })
            .catch((err) => {
                console.log("Upload to Database Error : " + err);
            });
    }
    //scrollTo() used to scroll to latest news 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <ScrollView style={{ height: '93%', width: '100%' }}
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.scrollView.scrollToEnd({ animated: true });
                        }}>
                        <View style={[styles.messageContainer, { height: '100%' }]}>
                            {
                                this.state.oppoImage !== '' && this.state.oppoDisplay_Name !== '' ?
                                    this.state.chat_message.map((message_detail) =>
                                        <MessageDetail message_detail={message_detail} key={message_detail.message.DateTime} oppoImage={this.state.oppoImage} oppoName={this.state.oppoDisplay_Name} newLine={this.CheckNewLine(message_detail.message.SendBy)} />
                                    )
                                    : <View></View>
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.senderContainer}>
                        <View style={{ height: '100%', width: '60%', marginBottom: 5, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                            <TextInput style={styles.textinput} value={this.state.message} onChangeText={(text) => { this.setState({ message: text }) }} />
                        </View>
                        <View style={{ width: '40%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Icon
                                raised
                                name='camera'
                                type='font-awesome'
                                color={dynamic_side_drawer_icon_color()}
                                onPress={this.OnNewImageClicked}
                                style={{ width: 25, height: 25, marginRight: 5 }}
                            />
                            <Icon
                                raised
                                name='arrow-right'
                                type='font-awesome'
                                color={dynamic_side_drawer_icon_color()}
                                onPress={this.sendMessage}
                                style={{ width: 25, height: 25 }}
                            />
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: dynamic_main_background_color()
    },
    messageContainer: {
        width: '100%',
        height: '93%',
        flexDirection: 'column-reverse'
    },
    senderContainer: {
        width: '100%',
        height: '8%',
        flexDirection: 'row',
        marginBottom: '1%'
    },
    textinput: {
        width: '100%',
        height: 35,
        borderColor: 'black',
        borderWidth: 0.3,
        borderRadius: 50,
        marginLeft: 8,
        paddingVertical: 5,
        paddingLeft: 10
    },
    SenderButton: {
        justifyContent: 'center',
        alignItems: 'center',
        tintColor: dynamic_side_drawer_icon_color()
    },
    SelfTextContainer: {
        flexDirection: 'row-reverse',
    },
    OpoTextContainer: {
        flexDirection: 'row',
    },
    CommonTextContainer: {
        width: '100%',
        backgroundColor: '#ffffff00',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: '1%'
    },
    ChatMessageText: {
        fontSize: 17,
    },
    OpoTextView: {
        maxWidth: '60%',
        marginLeft: '5%',
        marginTop: 5,
        borderWidth: 0.4,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
        borderTopRightRadius: 150
    },
    SelfTextView: {
        maxWidth: '60%',
        marginTop: 5,
        marginRight: '5%',
        borderWidth: 0.4,
        borderBottomLeftRadius: 150,
        borderTopRightRadius: 150,
        borderTopLeftRadius: 150
    },
    Chat_Message_Profile_Image: {
        height: 40,
        width: 40,
        borderRadius: 400,
        margin: '3%'
    }
})