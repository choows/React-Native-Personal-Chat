import {
    USER_SETUP,
    CONVO_SETUP,
    USER_LOG_OUT,
    USER_IMAGE_SETUP,
    USER_PUSH_TOKEN_SETUP

} from './types';

export const Setup =(accid , display_n , email , imageUrl)=>{
    return {type : USER_SETUP , AccountId : accid , DisplayName : display_n , Email : email , Url : imageUrl}
}
export const CSetup =(ID)=>{
    //console.log("Here : " + ID);
    return{type : CONVO_SETUP , CID : ID}
}
export const Logout=()=>{
    return {type : USER_LOG_OUT}
}
export const UpdateImage=(url)=>{
    return{type : USER_IMAGE_SETUP , Url : url}
}