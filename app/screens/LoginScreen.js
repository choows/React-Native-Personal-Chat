import React from 'react';
import { View, Text , TextInput, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';

export default class HomeScreen extends React.Component {

    state={
        username : '',
        password : ''
    }
    Login=()=>{
      
        firebase.auth().signInWithEmailAndPassword(this.state.username , this.state.password).then((result)=>{
            console.log("Successfully signed in ...");
            //console.log(JSON.stringify(result.user));
            this.props.navigation.navigate('Home');
        }).catch((err)=>{
            console.log("Firebase Sign In Error : " + err);
            alert("Login Error : Please reenter the correct username and password");
        })
    }

    render() {
        return (
            <View style={{height : '100%' , width : '100%' , justifyContent : 'center' , flex :1 , alignItems : 'center'}}>
                <TextInput style={{width : '30%',  borderColor :'black'}} onChangeText={text=>this.setState({username : text})} value={this.state.username} placeholder = 'User Name'/>
                <TextInput style={{width : '30%', borderColor :'black'}} onChangeText={text=>this.setState({password : text})} value={this.state.password} placeholder="Password" secureTextEntry={true}/>
                <TouchableOpacity style={{alignItems : 'center' , width : '30%'}} onPress={this.Login}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}