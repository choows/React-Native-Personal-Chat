
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, AsyncStorage, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as UserAction from '../redux/action/user';
class SideMenu extends Component {
    state = {
        username: '',
    }
    navigateToScreen = (route) => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount() {
    }
    Logout=()=>{
        firebase.auth().signOut().then((res)=>{
            store.dispatch(UserAction.Logout());
            this.navigateToScreen("Login");
        }).catch((err)=>{
            console.log("Logout Error : " + err);
        });
    }
    render() {
        return (
            <SafeAreaView>
                <View style={[{ height: '100%', width: '100%' }]}>
                    <ScrollView>
                        <View>
                            <Text>UserName</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={()=>{this.navigateToScreen('Home')}}>
                                <Text>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.navigateToScreen('Map')}}>
                                <Text>Map</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.navigateToScreen('Gallery')}}>
                                <Text>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.navigateToScreen('Memo')}}>
                                <Text>Memo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.Logout()}}>
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;

const cus_style = StyleSheet.create({
    SideMenuText: {
        width: '100%',
        height: '100%',
        fontSize: 14,
        textAlignVertical: 'center',
        paddingLeft: 15
    },
    MainHeaderTextUN: {
        fontSize: 14,
        paddingLeft: 15,
        marginTop: '4%'
    },
    MainHeaderTextAM: {
        fontSize: 14,
        paddingLeft: 15,
    },
    HeaderText: {
        width: '100%',
        fontSize: 15,
        textAlign: 'center',
        marginTop: '6%'

    },
    MainHeaderText: {
        width: '100%',
        height: '100%',
        fontSize: 18,
    },
    HeaderContainer: {
        width: '100%',
        height: 50,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    TextContainer: {
        height: 50,
        borderWidth: 0.3,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center'
    },
    RefreshIcon: {

    }
})