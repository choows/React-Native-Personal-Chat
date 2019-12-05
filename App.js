import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import store from './app/redux/store';
import SafeAreaView from 'react-native-safe-area-view';
import AppNavigator from './app/navigation/MainNavigation';
import themeStyles from './app/theme/ThemeManager';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() { 
    AsyncStorage.getItem("Theme" , (theme)=>{
      if(theme !== null){
        themeStyles.setTheme(theme);
      }else{
        throw new Error("No Theme had setted.");
      }
      
    }).catch((err)=>{
      themeStyles.setTheme('PinkTheme');
      console.log(err);
    });
  }

  render() {
    return (
      <Provider store={store}>
        <View>
          <SafeAreaView style={{ height: '100%', width: '100%' }}>
            <AppNavigator />
          </SafeAreaView>
        </View>
      </Provider>
    );
  }
}