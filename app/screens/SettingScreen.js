import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import store from '../redux/store';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import {Themes , FontSizeWording , FontSizeNumber} from '../constants/Themes';
import {ButtonGroup} from 'react-native-elements';
import themeStyles from '../theme/ThemeManager';
import * as settingsAction from '../redux/action/settings';
export default class SettingScreen extends React.Component {
    state = {
        selectedTheme : 0,
        selectedFS : 0
    }
    
    componentDidMount=()=>{
        const currentTheme = themeStyles.getTheme();
        const index = Themes.indexOf(currentTheme);
        this.setState({selectedTheme : index});
    }
    changeTheme=(themeindex)=>{
        this.setState({selectedTheme : themeindex});
        themeStyles.setTheme(Themes[themeindex]);
        AsyncStorage.setItem('Theme' , Themes[themeindex]);
    }
    changeFont=(fontIndex)=>{
        this.setState({selectedFS : fontIndex});
        AsyncStorage.setItem('FontSize' , FontSizeNumber[fontIndex]);
        store.dispatch(settingsAction.SetupFont_Size(FontSizeNumber[fontIndex]));
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.SegmentView}>
                        <Text style={styles.TitleText}>Themes </Text>
                        <ButtonGroup
                        onPress={this.changeTheme}
                        selectedIndex={this.state.selectedTheme}
                        buttons={Themes} 
                        containerStyle={{height : 30, width : '100%'}}/>
                    </View>
                    <View style={styles.SegmentView}>
                        <Text style={styles.TitleText}>Font Size </Text>
                        <ButtonGroup
                        onPress={this.changeFont}
                        selectedIndex={this.state.selectedFS}
                        buttons={FontSizeWording} 
                        containerStyle={{height : 30, width : '100%'}}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    SegmentView : {
        width : '100%'
    },
    TitleText: {
        marginLeft : '4%'
    }
})