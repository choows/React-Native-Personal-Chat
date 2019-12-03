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

export const FirebaseSetupUserDetail=(User_Id , Dislpay_Name , ProfileImage)=>{
    firebase.database().ref('Users/'+ User_Id +  "/").set({
        DislpayName : Dislpay_Name,
        UID : User_Id,
        ProfileImage : ProfileImage
    }).then((res)=>{
        console.log("Updated User Detail");
    }).catch((err)=>{
        console.log("Error Update User Detail : " + err);
    });
}

export const GetDearImageAndName=()=>{
    const state = store.getState();
    firebase.database().ref('Users/').once('value' , (snapshot)=>{
        if(snapshot.exists){
            const result = snapshot.toJSON();
            let keys = Object.keys(snapshot.toJSON());
            keys.map((key)=>{
                if(key !== state.users.accountId){
                   return result[key];
                }
                
            });
        }
    }).then((result)=>{
        return result;
    }).catch((err)=>{
        console.log("Get Dear DEtail Error : " + err);
    });
}