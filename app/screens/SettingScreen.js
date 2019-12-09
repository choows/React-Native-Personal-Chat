import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import { Themes, FontSizeWording, FontSizeNumber } from '../constants/Themes';
import { ButtonGroup, Icon } from 'react-native-elements';
import themeStyles from '../theme/ThemeManager';
import * as settingsAction from '../redux/action/settings';

export default class SettingScreen extends React.Component {
    state = {
        selectedTheme: 0,
        selectedFS: 0
    }
    componentDidMount = () => {
        const currentTheme = themeStyles.getTheme();
        const index = Themes.indexOf(currentTheme);
        this.setState({ selectedTheme: index });
    }
    changeTheme = (themeindex) => {
        this.setState({ selectedTheme: themeindex });
        themeStyles.setTheme(Themes[themeindex]);
        AsyncStorage.setItem('Theme', Themes[themeindex]);
    }
    changeFont = (fontIndex) => {
        this.setState({ selectedFS: fontIndex });
        AsyncStorage.setItem('FontSize', FontSizeNumber[fontIndex]);
        store.dispatch(settingsAction.SetupFont_Size(FontSizeNumber[fontIndex]));
    }
    getUserID = () => {
        const state = store.getState();
        const Email = state.users.Email;
        const UserID = Email.split('@')[0];
        return '@' + UserID;
    }
    GoToProfile =()=>{
        this.props.navigation.navigate('Profile');
    }
    render() {
        const state = store.getState();
        return (
            <View style={styles.container}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                    <Text style={[styles.TitleText, { marginTop: 20 }]}>Profile</Text>
                    <TouchableOpacity style={[styles.SegmentView, { flexDirection: 'row', padding: 5 }]} onPress={this.GoToProfile}>
                        <Image source={{ uri: state.users.ProfileImage }} style={{ height: 50, width: 50, resizeMode: 'stretch', borderRadius: 5, marginLeft : '3%' }} />
                        <View style={{ justifyContent: 'center',marginLeft : '40%', alignContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Text style={{fontSize : 20}}>{this.getUserID()}</Text>
                        </View>
                        <View style={{ justifyContent: 'center',marginLeft : '2%', alignContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Icon
                                name='chevron-right'
                                type='font-awesome'
                                color={'#d6d9d0'}
                                style={{ width: 25, height: 25, marginRight: 5, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}
                            />
                        </View>

                    </TouchableOpacity>
                    <Text style={styles.TitleText}>Themes </Text>
                    <View style={{ width: '95%', alignSelf: 'center' }}>
                        <ButtonGroup
                            onPress={this.changeTheme}
                            selectedIndex={this.state.selectedTheme}
                            buttons={Themes}
                            containerStyle={{ height: 30, width: '100%', alignSelf: 'center' }} />
                    </View>
                    <Text style={styles.TitleText}>Font Size </Text>
                    <View style={{ width: '95%', alignSelf: 'center' }}>
                        <ButtonGroup
                            onPress={this.changeFont}
                            selectedIndex={this.state.selectedFS}
                            buttons={FontSizeWording}
                            containerStyle={{ height: 30, width: '100%', alignSelf: 'center' }} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#d6d9d0',
        alignContent: 'center',
        alignItems: 'center'
    },
    SegmentView: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center'
    },
    TitleText: {
        marginLeft: '4%',
        marginTop: 10
    }
})