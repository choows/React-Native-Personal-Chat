import React, {Component} from 'react';
import {View , Text} from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as userAction from '../redux/action/user';
import {GetUserCID} from '../util/UserSetup';
export default class HomeScreen extends Component{
    
    componentDidMount(){
        let user = firebase.auth().currentUser;
        if(user !== null){            
            store.dispatch(userAction.Setup(user.uid , user.displayName));
            console.log("User ID : " + user.uid);
            firebase.database().ref("Users/" + user.uid + "/").once('value', (snapshot) => {
                console.log(JSON.stringify(snapshot.val()));
            });
            this.props.navigation.navigate('Home');
        }else{
            this.props.navigation.navigate('Login');
        }
    }   
    render(){
        return(
            <View><Text>Loading Screen</Text></View>
        )
    }
}