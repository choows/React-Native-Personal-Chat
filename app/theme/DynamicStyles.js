import themeStyles from './ThemeManager';

const dynamic_main_background_color=()=>{
    return themeStyles.main_background_color;
}

const dynamic_side_drawer_icon_color=()=>{
    return themeStyles.side_drawer_icon_color;
}

const dynamic_side_drawer_header_color=()=>{
    return themeStyles.header_background_color;
}
export{
    dynamic_main_background_color,
    dynamic_side_drawer_icon_color,
    dynamic_side_drawer_header_color
}