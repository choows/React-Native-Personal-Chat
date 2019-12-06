import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import themeStyles from '../theme/ThemeManager';
import * as userAction from '../redux/action/user';
import { Input, Icon } from 'react-native-elements';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';
import { FontSizeNumber } from '../constants/Themes';

export default class HomeScreen extends React.Component {

    state = {
        username: '',
        password: ''
    }
    Login = () => {
        if (this.state.username !== "" && this.state.password !== "") {
            firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).then((result) => {
                store.dispatch(userAction.Setup(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL));
                const checker = setInterval(() => {
                    const state = store.getState();
                    if (state.users.accountId !== "") {
                        clearInterval(checker);
                        this.props.navigation.navigate('Home');
                    }

                }, 2000);

            }).catch((err) => {
                console.log("Firebase Sign In Error : " + err);
                alert("Login Error : Please reenter the correct username and password");
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.TextInputView}>
                    <Input leftIcon={{ type: 'font-awesome', name: 'envelope' }} onChangeText={text => this.setState({ username: text })} value={this.state.username} />
                    <Input leftIcon={{ type: 'font-awesome', name: 'lock' }} onChangeText={text => this.setState({ password: text })} value={this.state.password} secureTextEntry={true} />
                </View>

                <TouchableOpacity style={styles.LoginButtonView} onPress={this.Login}>
                    <Text style={styles.LoginText}>
                        LOGIN
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextInputStyles: {
        width: '50%'
    },
    TextInputView: {
        width: '80%'
    },
    LoginButtonView: {
        alignItems: 'center',
        width: '75%',
        height: '7%',
        marginTop: '5%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: dynamic_side_drawer_header_color(),
        borderRadius : 300
    },
    LoginText : {
        fontWeight : 'bold',
        fontSize : 20,
        marginTop : '3%'
    }
})