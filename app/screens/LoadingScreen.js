import React, {Component} from 'react';
import {View , Text , StyleSheet, Image} from 'react-native'
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
                    this.props.navigation.navigate('Home');
                }
            } , 1000)
        }else{
            this.props.navigation.navigate('Login');
        }
    }   
    render(){
        return(
            <View style={styles.container}>
                <Image source={require('../assets/TransparentSplashScreen.jpg') } style={styles.ImageStyle}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flex : 1,
        justifyContent : 'center',
        alignContent : 'center',
        alignItems: 'center',
    },
    ImageStyle : {
        width : '100%',
        height : '70%'
    }
})