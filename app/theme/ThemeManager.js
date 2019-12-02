import ThemeManager from 'react-native-color-theme';

export default themeStyles = new ThemeManager({
    PinkTheme : {
        main_background_color : 'white',      //secondary color
        header_background_color : '#d6a3c3',    //major color
        side_drawer_icon_color : '#b8428c',      //tertialy color
        side_drawer_item_background : '#e7cadd'
    },
    BlueTheme : {
        main_background_color : 'white',
        header_background_color : '#69d2ff',
        side_drawer_icon_color : '#6399ab',
        side_drawer_item_background : '#99e0ff'
    }
});
