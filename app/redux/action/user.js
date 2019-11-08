import {
    USER_SETUP,
    CONVO_SETUP
} from './types';
export const Setup =(accid , display_n)=>{
    return {type : USER_SETUP , AccountId : accid , DisplayName : display_n}
}
export const CSetup =(ID)=>{
    return{type : CONVO_SETUP , CID : ID}
}