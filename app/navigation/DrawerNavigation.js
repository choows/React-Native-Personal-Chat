
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as UserAction from '../redux/action/user';
import { Icon } from 'react-native-elements'
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color } from '../theme/DynamicStyles';
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
    Logout = () => {
        firebase.auth().signOut().then((res) => {
            store.dispatch(UserAction.Logout());
            this.navigateToScreen("Login");
        }).catch((err) => {
            console.log("Logout Error : " + err);
        });
    }
    render() {
        const state = store.getState();
        return (
            <SafeAreaView>
                <View style={[{ height: '100%', width: '100%' }]}>
                    <ScrollView>
                        <TouchableOpacity style={[cus_style.Profile_View_Container , {backgroundColor: dynamic_side_drawer_header_color()}]} onPress={() => { this.navigateToScreen('Setting') }}>
                            <View style={cus_style.ProfileImageViewContainer}>
                                <Image source={{ uri: state.users.ProfileImage }} style={cus_style.ProfileImage} />
                            </View>
                            <Text style={cus_style.DisplayNameStyle}>{state.users.displayName}</Text>
                            <Text style={cus_style.EmailDisplay}>{state.users.Email}</Text>
                        </TouchableOpacity>
                        <View style={{backgroundColor : dynamic_main_background_color()}}>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Home') }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='home'
                                    type='ionicons'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>HOME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Map') }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='map'
                                    type='ionicons'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>MAP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Gallery') }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='image'
                                    type='font-awesome'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>GALLERY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Memo') }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='today'
                                    type='material'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>MEMO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Setting') }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='settings'
                                    type='ionicons'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>SETTING</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.Logout() }} style={cus_style.NavigationSelectionView}>
                                <Icon
                                    name='sign-out'
                                    type='font-awesome'
                                    color={dynamic_side_drawer_icon_color()}
                                    size={cus_style.NavigationItem_Icon.fontSize}
                                    style={cus_style.NavigationItem_Icon}
                                />
                                <Text style={cus_style.NavigationItem_Text}>LOGOUT</Text>
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
    Profile_View_Container: {
        height: 180,
        width: '100%',
        alignItems: 'center'
    },
    ProfileImageViewContainer: {
        height: 100,
        width: '100%',
        marginTop: '1%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ProfileImage: {
        resizeMode: 'cover',
        borderRadius: 200,
        height: 90,
        width: 90
    },
    DisplayNameStyle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    EmailDisplay: {
        fontSize: 15,
        fontWeight: '100'
    },
    NavigationSelectionView: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        alignItems : 'center',
        borderWidth : 0.3
    },
    NavigationItem_Text : {
        fontSize: 15,
        marginLeft : '10%',
        textAlign : 'left'
    },
    NavigationItem_Icon : {
        marginLeft : '1%',
        fontSize : 35
    }
})