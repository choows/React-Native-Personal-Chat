import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { EventRegister } from 'react-native-event-listeners';

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
    RefreshMemo=()=>{
        EventRegister.emit("RefreshMemoWithDate" , this.props.navigation.getParam('date'));
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
                <View >
                    <Text>Title : </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput value={this.state.Title} onChangeText={(text) => { this.setState({ Title: text }) }} editable={this.state.TitleEdit} />
                        <TouchableOpacity onPress={() => { this.setState({ TitleEdit: !this.state.TitleEdit }) }}>
                            <Text>{this.state.TitleEdit === true ? "Done Edit" : "Edit"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text>Detail</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput value={this.state.Detail} onChangeText={(text) => { this.setState({ Detail: text }) }} editable={this.state.DetailEdit} multiline={true} />
                        <TouchableOpacity onPress={() => { this.setState({ DetailEdit: !this.state.DetailEdit }) }}>
                            <Text>{this.state.DetailEdit === true ? "Done Edit" : "Edit"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.OnSubmit}>
                        <Text>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.OnCancel}>
                        <Text>
                            Cancel
                        </Text>
                    </TouchableOpacity>
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