import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { MemoColor } from '../constants/ColorCode';
import { ColorPicker, TriangleColorPicker, fromHsv } from 'react-native-color-picker'
import firebase from 'react-native-firebase';
import { MEMO_URL } from '../constants/url';
class Color extends React.Component {
    render() {
        return (
            <View>
                <TouchableOpacity
                    onLongPress={this.props.onlongpress}
                    onPress={() => { this.props.onpress(this.props.colorcode) }}
                    style={{ backgroundColor: this.props.colorcode, borderRadius: 300, width: 20, height: 20, marginRight: 10, borderWidth: 1, borderColor: 'black' }}>
                    <View>
                        <Text></Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class NewMemoScreen extends React.Component {
    state = {
        from_date: new Date().getTime(),
        display_from: false,
        text_detail: '',
        color_picker_visible: false,
        selected_color: '#ffffff',
        current_date_setted_color: ''
    }
    componentDidMount() {
        this.GetCurrentDateColor(this.state.from_date);
    }
    setFrom_date = (date) => {
        if (date.type !== "dismissed") {
            this.setState({ from_date: date.nativeEvent.timestamp, display_from: false });
            this.GetCurrentDateColor(date.nativeEvent.timestamp);
        } else {
            this.setState({ display_from: false });

        }
    }
    GetCurrentDateColor = (datestring) => {
        this.setState({ current_date_setted_color: "" });
        const date = new Date(datestring);
        const yearmonth = date.getFullYear().toString() + (date.getMonth() + 1).toString();
        const yearmonthday = this.DateDisplay(datestring);
        firebase.database().ref(MEMO_URL + "Overall/" + yearmonth + "/" + yearmonthday + "/").once('value', (snapshot) => {
            if (snapshot.exists()) {
                this.setState({ current_date_setted_color: snapshot.toJSON()["color"] });
            }
        })
    }
    OnCancelNewMemo = () => {
        this.props.navigation.goBack();
    }
    DateDisplay = (dateString) => {
        let datestr = new Date(dateString);
        return datestr.getFullYear() + "-" + (datestr.getUTCMonth() + 1) + "-" + datestr.getDate();
    }
    ColorPicked = (colorcode) => {
        this.setState({ selected_color: colorcode });
    }
    OnColorLongPress = () => {
        this.setState({ color_picker_visible: true });
    }
    SubmitNewMemo = () => {
        const date_submit = new Date(this.state.from_date);
        const yearmonth = date_submit.getFullYear().toString() + (date_submit.getMonth() + 1).toString();
        const yearmonthday = this.DateDisplay(this.state.from_date);
        //'2019-11-28': {dots: [{color: 'green'}, {color: 'red'}, {color: 'yellow'}]}
        const arry_color = this.state.current_date_setted_color.split(',');
        if (arry_color.includes(this.state.selected_color)) {
            alert("Color Already In-Used.");
        } else {
            arry_color.push(this.state.selected_color);
            const path = MEMO_URL + "Overall/" + yearmonth + "/" + yearmonthday;
            firebase.database().ref(path).set({
                color: arry_color.toString(),
                YMD : yearmonthday
            }).then(() => {
                console.log("Done Upload To firebase");
                this.OnCancelNewMemo();
            }).catch((err) => {
                console.log("Send Message Error : " + err);
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.color_picker_visible}
                    onRequestClose={() => { this.setState({ color_picker_visible: false }) }}
                    transparent={false}>
                    <View style={{ height: '100%', width: '100%' }}>
                        <TriangleColorPicker
                            onColorChange={(color) => { this.ColorPicked(fromHsv({ h: color.h, s: color.s, v: color.v })) }}
                            style={{ height: '80%', width: '100%' }}
                            onColorSelected={() => { this.setState({ color_picker_visible: false }) }}
                        />
                    </View>
                </Modal>
                <View style={styles.SectionView}>
                    <Text>Date : </Text>
                    <TouchableOpacity onPress={() => { this.setState({ display_from: true }) }}>
                        <Text>{this.DateDisplay(this.state.from_date)}</Text>
                    </TouchableOpacity>

                    {
                        this.state.display_from && <DateTimePicker
                            value={new Date(this.state.from_date)}
                            mode={"date"}
                            display="calendar"
                            onChange={this.setFrom_date} />
                    }
                </View>
                <View style={styles.SectionView}>
                    <Text>Color :   </Text>
                    <ScrollView horizontal={true}>
                        {
                            MemoColor.map((color) =>
                                <Color colorcode={color} key={color} onpress={this.ColorPicked} onlongpress={this.OnColorLongPress} />
                            )
                        }
                    </ScrollView>
                    <View style={{
                        backgroundColor: this.state.selected_color,
                        borderRadius: 300,
                        width: 20,
                        height: 20,
                        marginRight: 10,
                        borderWidth: 2,
                        borderColor: 'black',
                        marginRight: 0
                    }}>
                        <Text></Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Detail :   </Text>
                    <TextInput multiline={true} autoCorrect={true} editable={true} value={this.state.text_detail} onChangeText={(text) => { this.setState({ text_detail: text }) }} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.SubmitNewMemo}>
                        <Text>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.OnCancelNewMemo}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center'
    },
    SectionView: {
        width: '100%',
        height: '10%',
        flexDirection: 'row'
    }
})