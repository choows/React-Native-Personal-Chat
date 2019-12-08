import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import store from './app/redux/store';
import SafeAreaView from 'react-native-safe-area-view';
import AppNavigator from './app/navigation/MainNavigation';
import themeStyles from './app/theme/ThemeManager';
import * as settingAction from './app/redux/action/settings';
import Toast, { DURATION } from 'react-native-easy-toast'
import { EventRegister } from 'react-native-event-listeners';
import firebase from 'react-native-firebase';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  OnFirebaseCloudMessageReceive = () => {
    this.MessageListener = firebase.messaging().onMessage((message) => {
      console.log("Cloud Message");
      console.log(message);
    });
    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
      this.refs.toast.show(notification.body, 1000);
    });
  }
  async componentDidMount() {
    this.OnFirebaseCloudMessageReceive();
    EventRegister.addEventListener('Toast', (message) => {
      this.refs.toast.show(message, 1000);
    })
    AsyncStorage.multiGet(['Theme', 'FontSize']).then((result) => {
      //setup theme
      const theme = result[0][1];
      if (theme !== null) {
        themeStyles.setTheme(theme);
      } else {
        themeStyles.setTheme('PinkTheme');
      }

      //setup font size 
      const fontSize = result[1][1];
      if (fontSize !== null) {
        store.dispatch(settingAction.SetupFont_Size(fontSize));
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <View>
          <SafeAreaView style={{ height: '100%', width: '100%' }}>
            <AppNavigator />
            <Toast ref="toast" />
          </SafeAreaView>
        </View>
      </Provider>
    );
  }
}