import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, AsyncStorage, Alert } from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import { MESSAGE_URL, TOKEN_URL, ANI_URL } from '../constants/url';
import { GetDearImageAndName } from '../util/UserSetup';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';
import { EventRegister } from 'react-native-event-listeners';
import ImagePicker from 'react-native-image-picker';
import { Icon, Overlay } from 'react-native-elements';
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
                            <TouchableOpacity onPress={() => { this.props.DisplayOverLay(this.props.message_detail.message.Detail) }} style={[styles.SelfTextView, { backgroundColor: dynamic_side_drawer_item_background(), borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0 }]}>
                                <View>
                                    <Image style={{ height: 250, width: 170 }} source={{ uri: this.props.message_detail.message.Detail }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                } else {
                    return (
                        <View style={[styles.OpoTextContainer, styles.CommonTextContainer]}>
                            <TouchableOpacity onPress={() => { this.props.DisplayOverLay(this.props.message_detail.message.Detail) }} style={[styles.OpoTextView, { borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
                                <View>
                                    <Image style={{ height: 250, width: 170 }} source={{ uri: this.props.message_detail.message.Detail }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }
            }
            default: {
                return (
                    <View><Text>Data type not supported</Text></View>
                )
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
        Message_UID: '',
        OverLay_Visible: false,
        OverLay_Image_Path: '',
        Timer: '',
        Aniv_OverLay: false,
        Aniv_Word: '',
        Aniv_Voucher: '',
        Aniv_Validity: '',
        Aniv_Title: ''
    }

    setFirebasePushToken = (acc_id) => {
        firebase.messaging().getToken().then((token) => {
            firebase.database().ref(TOKEN_URL + acc_id + "/").set({ token: token }).catch((err) => {
                console.log("Set Token Error : " + err);
            });
        }).catch((err) => {
            console.log("Get Token Error : " + err);
        });
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

    DisplayOverLay = (path) => {
        this.setState({ OverLay_Image_Path: path }, () => {
            this.setState({ OverLay_Visible: !this.state.OverLay_Visible });
        })
    }

    SetUpSelfInfo = () => {
        const state = store.getState();
        firebase.database().ref('Users/' + state.users.accountId).set({
            ProfileImage: state.users.ProfileImage,
            DisplayName: state.users.displayName
        }).catch((err) => {
            console.log("Setup Self Info Error : " + err);
        });
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
                        this.setState({ oppoImage: result[key]["ProfileImage"], oppoDisplay_Name: result[key]["DisplayName"] });
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
        return false;
    }
    checkAnniversary = () => {
        const currentDate = new Date();
        if (currentDate.getDate() == 13) {
            const ani_date = new Date("2019-05-13");
            var difference = currentDate - ani_date;
            var day = difference / (1000 * 60 * 60 * 24);
            var fixed_day = parseInt(day.toFixed(0));
            var year = 0;
            var month = 0;
            while (fixed_day > 365) {
                year = year + 1;
                fixed_day = fixed_day - 365;
            }
            while (fixed_day > 30) {
                month = month + 1;
                fixed_day = fixed_day - 30;
            }
            this.showAnniversary(year, month);
        }
    }

    GetNum = (count) => {
        switch (count) {
            case "1":
                {
                    return 'st';
                }
            case "2":
                {
                    return "nd";
                }
            case "3":
                {
                    return "rd";
                }
            default:
                {
                    return "th";
                }
        }
    }

    Aniversary_path = "";

    showAnniversary = (year, month) => {
        const state = store.getState();
        const UID = state.users.accountId;
        const path = ANI_URL + year.toString() + month.toString();
        var Title = "Today is ";
        if (year.toString() !== "0") {
            Title = Title + year.toString() + this.GetNum(year.toString()) + " ";
        }
        if (month.toString() !== "0") {
            Title = Title + month.toString() + this.GetNum(month.toString()) + " ";
        }
        Title = Title + "Anniversary.";
        firebase.database().ref(path).once('value', (snapshot) => {
            if (!snapshot.exists()) {
                if (UID === "5EmUBjYLKLWM3M5PdB9O9BH7OXj1") {
                    this.Aniversary_path = path;
                    this.setState({ Aniv_Title: Title, Aniv_OverLay: true });
                }
            } else {
                if (UID === "QzALepVqIaZ6b3rkk7r685aQ6Ow2") {
                    const result = snapshot.toJSON();
                    if (result["Status"] !== "Received") {
                        this.setState({
                            Aniv_Title: Title,
                            Aniv_Word: result["Words"],
                            Aniv_Voucher: result["Voucher"],
                            Aniv_Validity: result["Validity"],
                            Aniv_OverLay: true
                        });
                    }
                }
            }
        }).catch((err) => {
            console.log("Get Aniversary Present Error : " + err);
        });
    }

    ConfirmSubmitVoucher = () => {
        firebase.database().ref(this.Aniversary_path).set({
            Words: this.state.Aniv_Word,
            Voucher: this.state.Aniv_Voucher,
            Validity: this.state.Aniv_Validity,
            Read: 'false'
        }).then(() => {
            EventRegister.emit("Toast", "Done Setup Anniversary.");
            this.setState({ Aniv_OverLay: false });
        }).catch((err) => {
            console.log("Setup Aniversary Error : " + err);
        });
    }

    SendAnivPresent = () => {
        Alert.alert('Confirm to submit ? ',
            'This action cannot be reveal',
            [
                { text: 'Cancel', onPress: () => console.log("Cancelled."), style: 'cancel' },
                { text: 'Confirm', onPress: () => this.ConfirmSubmitVoucher(), style: 'default' }
            ],
            { cancelable: true }
        )
    }

    OnAnivPresentChange = (status) => {
        const currentDate = new Date();
        const ani_date = new Date("2019-05-13");
        var difference = currentDate - ani_date;
        var day = difference / (1000 * 60 * 60 * 24);
        var fixed_day = parseInt(day.toFixed(0));
        var year = 0;
        var month = 0;
        while (fixed_day > 365) {
            year = year + 1;
            fixed_day = fixed_day - 365;
        }
        while (fixed_day > 30) {
            month = month + 1;
            fixed_day = fixed_day - 30;
        }

        const path = ANI_URL + year.toString() + month.toString();
        firebase.database().ref(path).update({
            Words: this.state.Aniv_Word,
            Voucher: this.state.Aniv_Voucher,
            Validity: this.state.Aniv_Validity,
            Status: status
        }).then(() => {
            this.setState({ Aniv_OverLay: false });
        }).catch((err) => {
            console.log("Setup Aniversary Error : " + err);
        })
    }

    componentDidMount() {
        const state = store.getState();
        this.setFirebasePushToken(state.users.accountId);
        this.checkAnniversary();
        this.SetToInitialState();
        this.SetUpSelfInfo();
        this.SetUpOppoDetails();
        let one_week_ago = new Date();
        one_week_ago.setDate(one_week_ago.getDate() - 7);
        firebase.database().ref(MESSAGE_URL).on('child_added', (snapshot) => {
            if (snapshot.exists()) {
                let key = Object.keys(snapshot.toJSON())[0];
                if (parseInt(snapshot.toJSON()[key]["DateTime"]) > one_week_ago.getTime()) {
                    this.state.chat_message = [snapshot.toJSON()].concat(this.state.chat_message);
                    this.setState({ chat_message: this.state.chat_message });
                }
            }
        });
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
        }).catch((err) => {
            console.log("Upload Error : " + err);
        });
    }

    SendImage = (path) => {
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

    GetMonthString = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
    }

    time = "";

    CheckTimer = (timeStamp) => {
        const NumtimeStamp = parseInt(timeStamp);

        var currentDt = this.time === "" ? new Date() : new Date(this.time);
        currentDt.setDate(currentDt.getDate() - 1);
        if (this.time === "" || NumtimeStamp < currentDt.getTime()) {
            this.time = NumtimeStamp;
            const date = new Date(NumtimeStamp);
            return (
                <View style={{ width: '100%', alignContent: 'center', alignItems: 'center' }}><Text>{this.GetMonthString(date.getMonth()) + " " + date.getDate()}</Text></View>
            )
        }
        var currentDt2 = this.time === "" ? new Date() : new Date(this.time);
        currentDt2.setUTCHours(currentDt2.getUTCHours() - 1);
        if (this.time === "" || NumtimeStamp < currentDt2.getTime()) {
            this.time = NumtimeStamp;
            const date = new Date(NumtimeStamp);
            return (
                <View style={{ width: '100%', alignContent: 'center', alignItems: 'center' }}><Text>{date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())}</Text></View>
            )
        }
        this.time = NumtimeStamp;
        return null;
    }

    UploadToFirebaseDatabase = (path, url) => {
        const currentDate = new Date().getTime().toString();
        firebase.database().ref(IMAGE_URL + "/" + currentDate).set({
            path: path,
            DateTime: currentDate,
            url: url
        }).then(() => {
            EventRegister.emit("Toast", "Upload Image Successfully");
        }).catch((err) => {
            console.log("Upload to Database Error : " + err);
        });
    }

    //scrollTo() used to scroll to latest news 
    render() {
        const UID = store.getState().users.accountId;
        /**
         * Aniv_Word : '',
        Aniv_Voucher : '',
        Aniv_Validity : '',
        Aniv_Title : ''
         */
        return (
            <View style={styles.container}>
                <Overlay isVisible={this.state.Aniv_OverLay} onBackdropPress={() => this.setState({ Aniv_OverLay: false })}>
                    {
                        UID === "5EmUBjYLKLWM3M5PdB9O9BH7OXj1" ?
                            <View style={{ width: '100%', height: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>{this.state.Aniv_Title}</Text>
                                <TextInput value={this.state.Aniv_Word} onChangeText={(text) => { this.setState({ Aniv_Word: text }) }} placeholder={"Write Your Words For Dear Here."} />
                                <TextInput value={this.state.Aniv_Voucher} onChangeText={(text) => { this.setState({ Aniv_Voucher: text }) }} placeholder={"Write Your Offer For Dear Here."} />
                                <TextInput value={this.state.Aniv_Validity} onChangeText={(text) => { this.setState({ Aniv_Validity: text }) }} placeholder={"Write Your Offer Validity Here."} />
                                <TouchableOpacity onPress={this.SendAnivPresent}>
                                    <Text>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ width: '100%', height: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 'bold', marginTop: '3%' }}>{this.state.Aniv_Title}</Text>
                                <Text>Dear , Here is what i have to tell u in this Anniversary ....</Text>
                                <Text>{this.state.Aniv_Word}</Text>
                                <Text>Besides , I also prepared some present for you ...</Text>
                                <Text style={{ fontWeight: 'bold' }}>{this.state.Aniv_Voucher}</Text>
                                <Text>Which is valid until ...</Text>
                                <Text style={{ fontWeight: 'bold' }}>{this.state.Aniv_Validity}</Text>
                                <Text>Haha , quite ugly design right ...</Text>
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { this.OnAnivPresentChange("Received") }} style={{ padding: 10, marginTop: 10, borderWidth: 0.2, borderRadius: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Received</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: '15%' }}>

                                    </View>
                                    <TouchableOpacity onPress={() => { this.OnAnivPresentChange("Later") }} style={{ padding: 10, marginTop: 10, borderWidth: 0.2, borderRadius: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Later</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </Overlay>
                <Overlay isVisible={this.state.OverLay_Visible} onBackdropPress={() => this.setState({ OverLay_Visible: false })}>
                    <TouchableOpacity onPress={() => { this.setState({ OverLay_Visible: !this.state.OverLay_Visible }) }} style={{ width: '100%', height: '100%' }}>
                        <Image source={{ uri: this.state.OverLay_Image_Path }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </Overlay>
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
                                        <View key={message_detail.message.DateTime} >
                                            {this.CheckTimer(message_detail.message.DateTime)}
                                            <MessageDetail DisplayOverLay={this.DisplayOverLay} message_detail={message_detail} oppoImage={this.state.oppoImage} oppoName={this.state.oppoDisplay_Name} newLine={this.CheckNewLine(message_detail.message.SendBy)} />
                                        </View>
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
        marginLeft: '3%',
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
        borderWidth: 0.2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    SelfTextView: {
        maxWidth: '60%',
        marginTop: 5,
        marginRight: '5%',
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    Chat_Message_Profile_Image: {
        height: 40,
        width: 40,
        borderRadius: 400,
        margin: '3%'
    }
})