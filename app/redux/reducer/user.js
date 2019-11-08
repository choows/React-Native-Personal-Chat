import {
    USER_LOG_OUT,
    USER_SETUP,
    CONVO_SETUP
}
    from '../action/types'


const initialState =
{
    accountId: '',
    displayName : '',
    conversationID : ''
}
export default (state = initialState, action) => {
    switch (action.type) {
        case USER_SETUP :{
            return {
                ... state,
                accountId : action.AccountId,
                displayName : action.DisplayName
            }
        }
        case CONVO_SETUP :{
            return {
                ...state,
                conversationID : action.CID
            }
        }
        case USER_LOG_OUT:
            {
                return initialState;
            }
        default:
            {
                return state;
            }
    }

};


