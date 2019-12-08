import firebase from 'react-native-firebase';
import store from '../redux/store';
export const SendMessage=(Title , Detail)=>{
    const state = store.getState();
}

export const SendMessageWithImage=(Title , Detail , ImageUrl)=>{
    //Image Url should be Https: .png
}