import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { Provider } from 'react-redux';
import store from './app/redux/store';
import SafeAreaView from 'react-native-safe-area-view';
import AppNavigator from './app/navigation/MainNavigation';
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() { }

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