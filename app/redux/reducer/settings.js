import {
    SETUP_FONT_SIZE
} from '../action/types';
import { FontSizeNumber } from '../../constants/Themes';
const initialState =
{
    font_size: 18
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SETUP_FONT_SIZE: {
            return {
                ...state,
                font_size: action.FontSize
            }
        }
        default:
            {
                return state;
            }
    }

};