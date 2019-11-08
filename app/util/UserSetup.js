import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as userAction from '../redux/action/user';

export const GetUserCID = (user_id)=>{

    //console.log("User Id : " + user_id);
    firebase.database().ref("Users/" + user_id + "/").once('value', (snapshot) => {
        //console.log(JSON.stringify(snapshot.toJSON()["CID"]));
        store.dispatch(userAction.CSetup(JSON.stringify(snapshot.toJSON()["CID"])));
        //return snapshot.toJSON()["CID"];
    });
}

export const asyncGetUserCID =(user_id)=>{
    return new Promise((resolve,reject)=>{
        firebase.database().ref("Users/" + user_id + "/").once('value', (snapshot) => {
            //console.log(JSON.stringify(snapshot.toJSON()["CID"]));
            //store.dispatch(userAction.CSetup(JSON.stringify(snapshot.toJSON()["CID"])));
            //return snapshot.toJSON()["CID"];
            resolve(snapshot.toJSON()["CID"]);
        }).catch((err)=>{
            console.log("Error getting CONVO_ID : " + err);
            reject();
        });
    });
}

