import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from '../screens/LoadingScreen';
import {Platform} from 'react-native';
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
const HomeStack = createStackNavigator({
    Home : {
        screen : HomeScreen,
        navigationOptions : {
            title : 'Home'
        }
    }
});
const MapStack = createStackNavigator({
    Map : {
        screen : MapScreen,
        navigationOptions : {
            title : 'Map'
        }
    }
})
const MemoStack = createStackNavigator({
    Memo : {
        screen : MemoScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle:<MemoHeader navigate={navigation}/>
        })
    },
    NewMemo : {
        screen : NewMemoScreen,
        navigationOptions : {
            title : 'New Memo'
        }
    },
    EditMemo : {
        screen : MemoScreenEdit,
        navigationOptions : {
            title : 'Edit'
        }
    }
})
const GalleryStack = createStackNavigator({
    Gallery : {
        screen : GalleryScreen,
        navigationOptions: ({ navigation }) => ({
            headerForceInset: Platform.OS === "ios" ? {
                top: 'never',
                bottom: 'never'
            } : {},
            headerTitle:<GalleryHeader navigate={navigation}/>
        })
    }
});
const SettingStack = createStackNavigator({
    Setting : {
        screen : SettingScreen,
        navigationOptions : {
            title : 'Setting'
        }
    }
});
const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeStack
    },
    Map : {
        screen : MapStack
    },
    Gallery : {
        screen : GalleryStack
    },
    Memo : {
        screen : MemoStack
    },
    Setting : {
        screen : SettingStack
    }
},
    {
        contentComponent : SideMenu,
        navigationOptions : null
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