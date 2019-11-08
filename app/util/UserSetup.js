import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as userAction from '../redux/action/user';

export const GetUserCID = (user_id)=>{
    firebase.database().ref("Users").once('value', (snapshot) => {
        console.log(snapshot.val());
    });
}