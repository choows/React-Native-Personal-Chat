import {
    SETUP_FONT_SIZE

} from './types';


export const SetupFont_Size = (font_Size) => {
    return { type: SETUP_FONT_SIZE, FontSize: font_Size }
}