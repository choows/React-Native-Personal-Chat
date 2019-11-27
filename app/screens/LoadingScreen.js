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
            GetUserCID(user.uid);
            const checker= setInterval(()=>{
                const state = store.getState();
                if(state.users.accountId !== ''){
                    clearInterval(checker);
                    this.props.navigation.navigate('Home');

                }
            } , 2000)
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