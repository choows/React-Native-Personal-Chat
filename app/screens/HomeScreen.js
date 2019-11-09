import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView , Image} from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import { MESSAGE_URL } from '../constants/url';
import { asyncGetUserCID } from '../util/UserSetup';

class MessageDetail extends React.Component {
    state = {
        UserId: ''
    }
    componentDidMount() {
        const state = store.getState();
        this.setState({ UserId: state.users.accountId });
        //console.log(state.users.accountId);
    }
    render() {
        if (this.props.message_detail.message.SendBy === this.state.UserId) {
            //self
            return (
                <View style={styles.SelfTextContainer}>
                    <Text>{this.props.message_detail.message.Detail}</Text>
                </View>
            )
        } else {
            //oppo
            return (
                <View style={styles.OpoTextContainer}>
                    <Text>{this.props.message_detail.message.Detail}</Text>
                </View>
            )
        }

    }
}

export default class HomeScreen extends React.Component {

    state = {
        message: '',
        chat_message: [],
        startlisten: false
    }

    /**
     * convert to milli second ...
     * later will convert it back to date time format using following method :
     * 
     * 
     * var date = new Date(inmillisecond)
     */
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
            firebase.database().ref(MESSAGE_URL + state.users.conversationID + "/" + date_nw.toString()).set({
                message: message_send
            }).then(()=>{
                this.setState({message : ''});
            }).catch((err)=>{
                console.log("Send Message Error : " + err);
            });
        }

    }
    componentDidMount() {
        const state = store.getState();
        //console.log("User ID : " + state.users.accountId);
        asyncGetUserCID(state.users.accountId).then((CID) => {
            let one_week_ago = new Date();
            one_week_ago.setDate(one_week_ago.getDate() - 7);
            var to_milli = one_week_ago.getTime();
            CID = "\"" + CID + "\"";
            firebase.database().ref(MESSAGE_URL + CID).once('value', (snapshot) => {
                let temp_arr = [];
                if (snapshot.val()) {
                    let keys = Object.keys(snapshot.toJSON());
                    keys.filter((key) => {
                        return parseInt(key) > to_milli;
                    }).sort((key_a, key_b) => {
                        return parseInt(key_a) < parseInt(key_b);
                    }).map((key) => {
                        temp_arr.push(snapshot.toJSON()[key.toString()]);
                    });

                    this.setState({ chat_message: temp_arr });
                }
            });


            firebase.database().ref(MESSAGE_URL + CID).on('child_added', (snapshot) => {
                if (snapshot.exists()) {
                    console.log("Added");
                    let key = Object.keys(snapshot.toJSON())[0];
                    //alert(key);
                    if (parseInt(snapshot.toJSON()[key]["DateTime"]) > one_week_ago.getTime()) {
                        this.state.chat_message = [snapshot.toJSON()].concat(this.state.chat_message);
                        this.setState({ chat_message: this.state.chat_message });
                    }

                }
            })
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
                                this.state.chat_message.map((message_detail) =>
                                    <MessageDetail message_detail={message_detail} key={message_detail.message.DateTime} />
                                )
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.senderContainer}>
                        <TextInput style={styles.textinput} value={this.state.message} onChangeText={(text) => { this.setState({ message: text }) }} />
                        <TouchableOpacity onPress={this.sendMessage} style={{width : '20%' , height : '100%'}}>
                            <Image source={require('../assets/arrow_icon.png')} style={{width : '100%' , height : '100%', resizeMode : 'contain'}}/>
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
        height: '100%'
    },
    messageContainer: {
        width: '100%',
        height: '93%',
        flexDirection: 'column-reverse'
    },
    senderContainer: {
        width: '100%',
        height: '7%',
        flexDirection: 'row'
    },
    textinput: {
        width: '80%',
        height: '100%',
        borderColor: 'black',
        borderWidth : 0.3,
    },
    SenderButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    SelfTextContainer: {
        marginRight: '2%',
        flexDirection: 'row-reverse',
        paddingRight : 5
    },
    OpoTextContainer: {
        marginLeft: '2%',
        flexDirection: 'row'
    }
})