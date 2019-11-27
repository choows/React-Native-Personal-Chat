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
})
const MainDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeStack
    },
    Map : {
        screen : MapStack
    },
    Gallery : {
        screen : GalleryStack
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