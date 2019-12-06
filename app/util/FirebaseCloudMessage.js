import firebase from 'react-native-firebase';
import store from '../redux/store';
export const SendMessage=(Title , Detail)=>{
    const state = store.getState();
    const CurrentUserId = state.users.accountId
    firebase.messaging().sendMessage({
        from : state.users.displayName,
        data : {
            title : "Hello",
            body :'Body Here'
        }
    }).then((res)=>{
        console.log(JSON.stringify(res));
    }).catch((err)=>{
        console.log("Send Message Error : " + err);
    })
    
}

export const SendMessageWithImage=(Title , Detail , ImageUrl)=>{
    //Image Url should be Https: .png
}