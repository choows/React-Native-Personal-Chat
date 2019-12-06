import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { EventRegister } from 'react-native-event-listeners';
import { Button } from 'react-native-elements';
export default class MemoScreenEdit extends React.Component {
    /*
    path : path,
            color : this.props.color,
            text : this.props.text
            */
    state = {
        Title: '',
        Detail: '',
        TitleEdit: false,
        DetailEdit: false
    }
    OnSubmit = () => {
        firebase.database().ref(this.props.navigation.getParam('path')).update({
            title: this.state.Title,
            text: this.state.Detail,
            color: this.props.navigation.getParam('color')
        }).then(() => {
            this.RefreshMemo();
        }).catch((err) => {
            console.log("Updte Error : " + err);
        });
    }
    OnCancel = () => {
        this.props.navigation.goBack();
    }
    RefreshMemo = () => {
        EventRegister.emit("RefreshMemoWithDate", this.props.navigation.getParam('date'));
    }
    componentDidMount = () => {
        this.setState({ Title: this.props.navigation.getParam('title') });
        this.setState({ Detail: this.props.navigation.getParam('text') });
    }
    render() {
        //this.state.Title === this.props.navigation.getParam('title') && this.state.Title !== "" ? null : this.setState({ Title: this.props.navigation.getParam('title') })
        //this.state.Detail === this.props.navigation.getParam('text') && this.state.Detail !== "" ? null : this.setState({ Detail: this.props.navigation.getParam('text') })
        return (
            <View style={styles.container}>
                <View style={{ width: '90%', marginVertical: 15, marginHorizontal: '5%' }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Text style={{ fontSize: 18, margin: 5 }}>Title</Text>
                        <TouchableOpacity onPress={() => { this.setState({ TitleEdit: !this.state.TitleEdit }) }} style={{ backgroundColor: 'blue', borderRadius: 200, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginVertical: 1, color: 'white', borderRadius: 100, marginHorizontal: 10 }}>{this.state.TitleEdit === true ? "Done Edit" : "EDIT"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '95%', borderWidth: 0.2, borderRadius: 100 }}>
                        <TextInput value={this.state.Title} onChangeText={(text) => { this.setState({ Title: text }) }} editable={this.state.TitleEdit} />
                    </View>
                </View>
                <View style={{ width: '90%', marginVertical: 15, marginHorizontal: '5%' }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Text style={{ fontSize: 18, margin: 5 }}>Detail</Text>
                        <TouchableOpacity onPress={() => { this.setState({ DetailEdit: !this.state.DetailEdit }) }} style={{ backgroundColor: 'blue', borderRadius: 200, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginVertical: 1, color: 'white', borderRadius: 100, marginHorizontal: 10 }}>{this.state.DetailEdit === true ? "Done Edit" : "EDIT"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '95%', borderWidth: 0.2, borderRadius: 10 , minHeight : 200 }}>
                        <TextInput value={this.state.Detail} onChangeText={(text) => { this.setState({ Detail: text }) }} editable={this.state.DetailEdit} multiline={true} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop : '2%', marginHorizontal : '5%' }}>
                <Button
                        onPress={this.OnSubmit}
                        title="Save"
                        containerStyle={{width : '40%' , height : 50 , margin : 10}}
                    />
                    <Button
                        onPress={this.OnCancel}
                        title="Cancel"
                        containerStyle={{width : '40%' , height : 50 , margin : 10}}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    }
})