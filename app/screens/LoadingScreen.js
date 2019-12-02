import React, {Component} from 'react';
import {View , Text} from 'react-native'
import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as userAction from '../redux/action/user';
import {GetUserCID} from '../util/UserSetup';
import themeStyles from '../theme/ThemeManager';
export default class HomeScreen extends Component{
    
    componentDidMount(){
        let user = firebase.auth().currentUser;
        if(user !== null){            
            store.dispatch(userAction.Setup(user.uid , user.displayName , user.email , user.photoURL));
            GetUserCID(user.uid);
            const checker= setInterval(()=>{
                const state = store.getState();
                if(state.users.accountId !== ''){
                    clearInterval(checker);
                    themeStyles.setTheme('PinkTheme');
                    this.props.navigation.navigate('Home');
                }
            } , 1000)
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