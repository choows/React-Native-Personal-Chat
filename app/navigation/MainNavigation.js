import { createStackNavigator } from "react-navigation-stack";
import { Text } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from '../screens/LoadingScreen';
import { Platform } from 'react-native';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { createDrawerNavigator } from "react-navigation-drawer";
import SideMenu from './DrawerNavigation';
import MapScreen from '../screens/MapScreen';
import GalleryScreen from '../screens/GalleryScreen';
import GalleryHeader from './GalleryHeader';
import MemoScreen from '../screens/MemoScreen';
import MemoHeader from './MemoHeader';
import NewMemoScreen from '../screens/NewMemoScreen';
import MemoScreenEdit from '../screens/MemoScreenEdit';
import SettingScreen from '../screens/SettingScreen';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color } from '../theme/DynamicStyles';
import ProfileScreen from '../screens/ProfileScreen';
import CustomHeader from './CustomHeader';
import CustomInnerHeader from './CustomInnerHeader';
const HomeStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomHeader navigate={navigation} HeaderTitle={"Home"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
});

const ProfileStack = createStackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomHeader navigate={navigation} HeaderTitle={"Profile"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
})

const MapStack = createStackNavigator({
    Map: {
        screen: MapScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomHeader navigate={navigation} HeaderTitle={"Map"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
})
const MemoStack = createStackNavigator({
    Memo: {
        screen: MemoScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <MemoHeader navigate={navigation} HeaderTitle={"Memo"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    },
    NewMemo: {
        screen: NewMemoScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomInnerHeader navigate={navigation} HeaderTitle={"New Memo"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    },
    EditMemo: {
        screen: MemoScreenEdit,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomInnerHeader navigate={navigation} HeaderTitle={"Edit Memo"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
})
const GalleryStack = createStackNavigator({
    Gallery: {
        screen: GalleryScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <GalleryHeader navigate={navigation} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
});
const SettingStack = createStackNavigator({
    Setting: {
        screen: SettingScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle: <CustomHeader navigate={navigation} HeaderTitle={"Setting"} />,
            headerStyle: {
                backgroundColor: dynamic_side_drawer_header_color()
            },
        })
    }
});
const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeStack
    },
    Map: {
        screen: MapStack
    },
    Gallery: {
        screen: GalleryStack
    },
    Memo: {
        screen: MemoStack
    },
    Setting: {
        screen: SettingStack
    },
    Profile: {
        screen: ProfileStack
    }
},
    {
        contentComponent: SideMenu,

    }
)

const ApplicationMainNavigator = createSwitchNavigator({
    Loading: {
        screen: LoadingScreen
    },
    Login: {
        screen: LoginScreen
    },
    Home: {
        screen: MainDrawerNavigator
    }
}, {
    initialRouteName: 'Loading'
})


export default createAppContainer(ApplicationMainNavigator);