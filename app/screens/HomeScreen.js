import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, AsyncStorage } from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import { MESSAGE_URL } from '../constants/url';
import { GetDearImageAndName } from '../util/UserSetup';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color } from '../theme/DynamicStyles';

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
        if (this.props.message_detail.message.SendBy === this.state.UserId) {
            //self
            return (
                <View style={[styles.SelfTextContainer, styles.CommonTextContainer]}>
                    <View style={styles.SelfTextView}>
                        <View style={{ margin: 8 }}>
                            <Text style={styles.ChatMessageText}>{this.props.message_detail.message.Detail}</Text>
                        </View>
                    </View>
                </View>
            )
        } else {
            if (this.props.newLine === false) {
                return (
                    <View style={{ width: '100%', justifyContent: 'flex-start', alignContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Image source={{ uri: this.props.oppoImage }} style={styles.Chat_Message_Profile_Image} />
                        <View style={styles.OpoTextView}>
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
    checker = '';
    CheckNewLine = (UID) => {
        if (this.checker !== UID) {
            this.checker = UID;
            return true;
        } else {
            this.checker = '';
            return false;
        }
    }
    componentDidMount() {
        this.SetToInitialState();
        this.SetUpOppoDetails();
        let one_week_ago = new Date();
        one_week_ago.setDate(one_week_ago.getDate() - 7);
        var to_milli = one_week_ago.getTime();

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
                        <TextInput style={styles.textinput} value={this.state.message} onChangeText={(text) => { this.setState({ message: text }) }} />
                        <TouchableOpacity onPress={this.sendMessage} style={{ width: '20%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../assets/arrow_icon.png')} style={{ width: 40, height: 40, resizeMode: 'contain', tintColor: dynamic_side_drawer_icon_color() }} />
                        </TouchableOpacity>
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
        height: '6%',
        flexDirection: 'row',
        marginBottom: '1%'
    },
    textinput: {
        width: '80%',
        height: 40,
        borderColor: 'black',
        borderWidth: 0.3,
        borderRadius: 50,
        marginBottom: 10,
        marginLeft: 3
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
        borderBottomRightRadius: 150,
        borderTopLeftRadius: 150,
        backgroundColor : dynamic_side_drawer_icon_color()
    },
    Chat_Message_Profile_Image: {
        height: 40,
        width: 40,
        borderRadius: 400,
        margin: '3%'
    }
})