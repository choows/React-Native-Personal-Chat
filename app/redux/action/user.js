import {
    USER_SETUP,
    CONVO_SETUP,
    USER_LOG_OUT,

} from './types';
export const Setup =(accid , display_n)=>{
    return {type : USER_SETUP , AccountId : accid , DisplayName : display_n}
}
export const CSetup =(ID)=>{
    //console.log("Here : " + ID);
    return{type : CONVO_SETUP , CID : ID}
}
export const Logout=()=>{
    return {type : USER_LOG_OUT}
}