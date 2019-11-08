import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import { MESSAGE_URL } from '../constants/url';

class MessageDetail extends React.Component {
    render() {
        return (
            <View>
                <Text>{this.props.message_detail.message.Detail}</Text>
            </View>
        )
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
        const state=store.getState();
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
            });
        }

    }
    componentDidMount() {
        let one_week_ago = new Date();
        one_week_ago.setDate(one_week_ago.getDate() - 7);
        var to_milli = one_week_ago.getTime();

        firebase.database().ref(MESSAGE_URL).once('value', (snapshot) => {
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
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.messageContainer}>
                    {
                        this.state.chat_message.map((message_detail) =>
                            <MessageDetail message_detail={message_detail} key={message_detail.message.DateTime}/>
                        )
                    }
                </View>
                <View style={styles.senderContainer}>
                    <TextInput style={styles.textinput} value={this.state.message} onChangeText={(text) => { this.setState({ message: text }) }} />
                    <TouchableOpacity onPress={this.sendMessage}>
                        <Text>SEND</Text>
                    </TouchableOpacity>
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
        borderColor: 0.3
    },
    SenderButton: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})