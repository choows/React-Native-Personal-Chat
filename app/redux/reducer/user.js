import {
    USER_LOG_OUT,
    USER_SETUP,
    CONVO_SETUP,
    USER_IMAGE_SETUP
}
    from '../action/types'


const initialState =
{
    accountId: '',
    displayName : '',
    conversationID : '',
    ProfileImage : 'https://firebasestorage.googleapis.com/v0/b/dearapp-debe1.appspot.com/o/profile_Image.png?alt=media&token=540c023f-c81a-40c0-a963-61b468340503',
    Email : ''
}
export default (state = initialState, action) => {
    switch (action.type) {
        case USER_SETUP :{
            return {
                ... state,
                accountId : action.AccountId,
                displayName : action.DisplayName,
                ProfileImage : action.Url,
                Email : action.Email
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
        case USER_IMAGE_SETUP : {
            return {
                ...state,
                ProfileImage : action.Url
            }
        }
        default:
            {
                return state;
            }
    }

};


