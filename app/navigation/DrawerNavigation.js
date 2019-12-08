
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import firebase from 'react-native-firebase';
import store from '../redux/store';
import * as UserAction from '../redux/action/user';
import { Icon, Divider } from 'react-native-elements';
import { MEMO_URL } from '../constants/url';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';
class Seperator extends Component {
    render() {

        return (
            <View style={{ height: 3, width: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', borderBottomWidth: 0.5, borderBottomColor: 'grey' }}></View>
            </View>
        )
    }
}
class SideMenu extends Component {
    state = {
        username: '',
        Memos: []
    }
    navigateToScreen = (route) => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount() {
        this.GetCurrentDayMemo();
    }
    GetCurrentDayMemo = () => {
        const date = new Date();
        const correct_date = date.getDate() < 10 ? "0"+ date.getDate().toString() : date.getDate.toString();
        const dayString = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + correct_date;
        const path = MEMO_URL + "Detail/" + dayString + "/";
        this.GetMemoOnce(path, dayString);
        this.GetMemoOn(path , dayString);
    }
    NavigateToMemoDetail = (memo) => {
        //console.log("Memo Here");
        
        const path = MEMO_URL + "Detail/" + memo.date + "/" + memo.key ;

        this.props.navigation.navigate('EditMemo', {
            path : path,
            color : memo.color,
            text : memo.text,
            title : memo.title,
            date : memo.date
        });
    }
    GetMemoOn =(path , yearmonthday)=>{
        firebase.database().ref(path).on('child_added', (snapshot) => {
            if (snapshot.exists) {
                if (snapshot.toJSON() !== null) {
                    this.GetMemoOnce(path , yearmonthday);
                }
            }
        })
    }
    GetMemoOnce = (path, yearmonthday) => {
        firebase.database().ref(path).once('value', (snapshot) => {
            if (snapshot.exists) {
                if (snapshot.toJSON() !== null) {
                    let new_arr = [];
                    const result = snapshot.toJSON();
                    let keys = Object.keys(snapshot.toJSON());
                    keys.map((key) => {
                        const details = result[key];
                        new_arr.push({
                            text: details["text"],
                            date: yearmonthday,
                            key: key,
                            color: details["color"],
                            title: details["title"]
                        });
                    });
                    this.setState({ Memos: new_arr });
                }
            }
        })
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
                <View style={[{ height: '100%', width: '100%', backgroundColor: dynamic_side_drawer_item_background() }]}>
                    <ScrollView>
                        <TouchableOpacity style={[cus_style.Profile_View_Container, { backgroundColor: dynamic_side_drawer_header_color() }]} onPress={() => { this.navigateToScreen('Profile') }}>
                            <View style={cus_style.ProfileImageViewContainer}>
                                <Image source={{ uri: state.users.ProfileImage }} style={cus_style.ProfileImage} />
                            </View>
                            <Text style={cus_style.DisplayNameStyle}>{state.users.displayName}</Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: dynamic_main_background_color() }}>
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Home') }} style={cus_style.NavigationSelectionView}>
                                <View style={cus_style.NavigationItem_Icon_Container}>
                                    <Icon
                                        name='home'
                                        type='ionicons'
                                        color={dynamic_side_drawer_icon_color()}
                                        size={cus_style.NavigationItem_Icon.fontSize}
                                        style={cus_style.NavigationItem_Icon}
                                    />
                                </View>
                                <View style={cus_style.NavigationItem_Text_Container}>
                                    <Text style={cus_style.NavigationItem_Text}>HOME</Text>
                                </View>
                            </TouchableOpacity>
                            <Seperator />
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Map') }} style={cus_style.NavigationSelectionView}>
                                <View style={cus_style.NavigationItem_Icon_Container}>
                                    <Icon
                                        name='map'
                                        type='ionicons'
                                        color={dynamic_side_drawer_icon_color()}
                                        size={cus_style.NavigationItem_Icon.fontSize}
                                        style={cus_style.NavigationItem_Icon}
                                    />
                                </View>
                                <View style={cus_style.NavigationItem_Text_Container}>
                                    <Text style={cus_style.NavigationItem_Text}>MAP</Text>
                                </View>
                            </TouchableOpacity>
                            <Seperator />
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Gallery') }} style={cus_style.NavigationSelectionView}>
                                <View style={cus_style.NavigationItem_Icon_Container}>
                                    <Icon
                                        name='image'
                                        type='font-awesome'
                                        color={dynamic_side_drawer_icon_color()}
                                        size={cus_style.NavigationItem_Icon.fontSize}
                                        style={cus_style.NavigationItem_Icon}
                                    />
                                </View>
                                <View style={cus_style.NavigationItem_Text_Container}>
                                    <Text style={cus_style.NavigationItem_Text}>GALLERY</Text>
                                </View>
                            </TouchableOpacity>
                            <Seperator />
                            <TouchableOpacity onPress={() => { this.navigateToScreen('Memo') }} style={cus_style.NavigationSelectionView}>
                                <View style={cus_style.NavigationItem_Icon_Container}>
                                    <Icon
                                        name='today'
                                        type='material'
                                        color={dynamic_side_drawer_icon_color()}
                                        size={cus_style.NavigationItem_Icon.fontSize}
                                        style={cus_style.NavigationItem_Icon}
                                    />
                                </View>
                                <View style={cus_style.NavigationItem_Text_Container}>
                                    <Text style={cus_style.NavigationItem_Text}>MEMO</Text>
                                </View>
                            </TouchableOpacity>
                            <Seperator />
                            <View style={{ height: 250, width: '100%', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>REMINDER</Text>
                                <View><Text> </Text></View>
                                {
                                    this.state.Memos.length <= 0 ?
                                        <Text>No reminder for today</Text>
                                        :
                                        <ScrollView style={{ width: '100%' }}>
                                            {
                                                this.state.Memos.map((memo) =>
                                                    <TouchableOpacity key={memo.key} onPress={() => { this.NavigateToMemoDetail(memo) }} style={{ width: '100%', alignItems: 'flex-start', marginBottom: '2%' }}>
                                                        <View style={{ marginLeft: '3%', flexDirection: 'row' }}>
                                                            <Icon
                                                                name='ios-checkmark'
                                                                type='ionicon'
                                                                color={dynamic_side_drawer_icon_color()}
                                                                size={20}
                                                            />
                                                            
                                                            <Text> {memo.title}</Text>
                                                        </View>

                                                        <Seperator />
                                                    </TouchableOpacity>

                                                )
                                            }
                                        </ScrollView>

                                }
                            </View>
                        </View>
                    </ScrollView>
                    <View style={cus_style.BottomView}>
                        <TouchableOpacity onPress={() => { this.navigateToScreen('Setting') }} style={cus_style.BottomIconView}>
                            <Icon
                                name='settings'
                                type='ionicons'
                                color={dynamic_side_drawer_icon_color()}
                                size={cus_style.NavigationItem_Icon.fontSize}
                                style={cus_style.NavigationItem_Icon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.Logout() }} style={cus_style.BottomIconView}>
                            <Icon
                                name='sign-out'
                                type='font-awesome'
                                color={dynamic_side_drawer_icon_color()}
                                size={cus_style.NavigationItem_Icon.fontSize}
                                style={cus_style.NavigationItem_Icon}
                            />
                        </TouchableOpacity>
                    </View>
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
        height: 160,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 2
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
        alignItems: 'center',
        backgroundColor: 'white'
    },
    NavigationItem_Text: {
        fontSize: 15,
        textAlign: 'left',
        fontWeight: "bold",
        marginLeft: '10%'
    },
    NavigationItem_Icon: {
        marginLeft: '1%',
        fontSize: 35
    },
    NavigationItem_Icon_Container: {
        height: '100%',
        width: '20%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    NavigationItem_Text_Container: {
        height: '100%',
        width: '80%',
        alignContent: 'center',
        justifyContent: 'center'
    },
    BottomView: {
        marginBottom: 0,
        flexDirection: 'row',
        height: 40
    },
    BottomIconView: {
        width: '50%',
        justifyContent: 'center',
        borderTopWidth: 0.2,
        borderRightWidth: 0.2
    },
    MemoDetail: {
        width: '90%',
        height: 50
    }
})