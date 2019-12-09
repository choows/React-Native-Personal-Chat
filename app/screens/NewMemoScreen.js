import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { MemoColor } from '../constants/ColorCode';
import { ColorPicker, TriangleColorPicker, fromHsv } from 'react-native-color-picker'
import firebase from 'react-native-firebase';
import { MEMO_URL } from '../constants/url';
import { Button } from 'react-native-elements';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';
import { EventRegister } from 'react-native-event-listeners';
class Color extends React.Component {
    render() {
        return (
            <View>
                <TouchableOpacity
                    onLongPress={this.props.onlongpress}
                    onPress={() => { this.props.onpress(this.props.colorcode) }}
                    style={{ backgroundColor: this.props.colorcode, borderRadius: 300, width: 25, height: 25, marginRight: 10, borderWidth: 1, borderColor: 'black' }}>
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
        current_date_setted_color: '',
        text_title: ''
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
        const correct_date = datestr.getDate() < 10 ? "0" + datestr.getDate().toString() : datestr.getDate().toString();

        return datestr.getFullYear() + "-" + (datestr.getUTCMonth() + 1) + "-" + correct_date;
    }
    ColorPicked = (colorcode) => {
        this.setState({ selected_color: colorcode });
    }
    OnColorLongPress = () => {
        this.setState({ color_picker_visible: true });
    }
    GetMonthString = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
    }
    DisplayDateFormat = (timestamp) => {
        const date = new Date(timestamp);
        return date.getDate() + " " + this.GetMonthString(date.getMonth()) + " " + date.getFullYear();
    }
    SubmitNewMemo = () => {
        if (this.state.text_title !== "") {
            const date_submit = new Date(this.state.from_date);
            const yearmonth = date_submit.getFullYear().toString() + (date_submit.getMonth() + 1).toString();
            const yearmonthday = this.DateDisplay(this.state.from_date);
            //'2019-11-28': {dots: [{color: 'green'}, {color: 'red'}, {color: 'yellow'}]}
            const arry_color = this.state.current_date_setted_color.split(',');
            if (arry_color.includes(this.state.selected_color)) {
                EventRegister.emit("Toast", "Color is been used.");
            } else {
                arry_color.push(this.state.selected_color);
                const path = MEMO_URL + "Overall/" + yearmonth + "/" + yearmonthday;
                firebase.database().ref(path).set({
                    color: arry_color.toString(),
                    YMD: yearmonthday
                }).then(() => {
                    this.SubmitMemoDetail();
                    this.OnCancelNewMemo();
                }).catch((err) => {
                    console.log("Send Message Error : " + err);
                });
            }
        } else {
            EventRegister.emit("Toast", "Title is Required To Submit New Memo");
        }

    }
    SubmitMemoDetail = () => {
        const date = new Date(this.state.from_date);
        const correct_date = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
        const yearmonthday = date.getFullYear() + '-' + (date.getMonth() + 1).toString() + "-" + correct_date;
        const path = MEMO_URL + "Detail/" + yearmonthday + "/";
        firebase.database().ref(path).push({
            title: this.state.text_title,
            text: this.state.text_detail,
            color: this.state.selected_color
        }).then((res) => {
            console.log("Done Push To Firebase.");
        }).catch((err) => {
            console.log("Push To Firebase Error : " + err);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.color_picker_visible}
                    onRequestClose={() => { this.setState({ color_picker_visible: false }) }}
                    transparent={false}>
                    <View style={{ height: '100%', width: '100%', backgroundColor: dynamic_main_background_color() }}>
                        <TriangleColorPicker
                            onColorChange={(color) => { this.ColorPicked(fromHsv({ h: color.h, s: color.s, v: color.v })) }}
                            style={{ height: '80%', width: '100%' }}
                            onColorSelected={() => { this.setState({ color_picker_visible: false }) }}
                        />
                    </View>
                </Modal>
                <View style={{ flexDirection: 'row', height: '10%', width: '95%', alignContent: 'center', alignItems: 'center', margin: '2%' }}>
                    <Text style={{ width: '20%', fontSize: 25 }}>Date : </Text>
                    <TouchableOpacity style={{ width: '80%', flexDirection: 'row-reverse' }} onPress={() => { this.setState({ display_from: true }) }}>
                        <Text style={{ fontSize: 20 }}>{this.DisplayDateFormat(this.state.from_date)}</Text>
                    </TouchableOpacity>

                    {
                        this.state.display_from && <DateTimePicker
                            value={new Date(this.state.from_date)}
                            mode={"date"}
                            display="calendar"
                            onChange={this.setFrom_date} />
                    }
                </View>
                <View style={{ flexDirection: 'row', height: '10%', width: '95%', alignContent: 'center', alignItems: 'center', margin: '2%' }}>
                    <ScrollView horizontal={true} style={{ width: '90%' }}>
                        {
                            MemoColor.map((color) =>
                                <Color colorcode={color} key={color} onpress={this.ColorPicked} onlongpress={this.OnColorLongPress} />
                            )
                        }
                    </ScrollView>
                    <View style={{ width: '10%' , flexDirection : 'row-reverse' }}>
                        <View style={{
                            backgroundColor: this.state.selected_color,
                            borderRadius: 300,
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            borderWidth: 2,
                            borderColor: 'black',
                            marginRight: 0
                        }}>
                            <Text></Text>
                        </View>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', minHeight: '10%', width: '95%', alignContent: 'center', alignItems: 'center', margin: '2%' }}>
                    <Text style={{ width: '20%', fontSize: 25 }}>Title :   </Text>
                    <TextInput
                        multiline={false}
                        autoCorrect={true}
                        editable={true}
                        value={this.state.text_title}
                        onChangeText={(text) => { this.setState({ text_title: text }) }}
                        style={{ width: '80%', borderWidth: 0.3, maxHeight: 40, fontSize: 20, borderRadius: 200, textAlign: 'center' }} />
                </View>
                <View style={{ flexDirection: 'row', minHeight: '10%', width: '95%', alignContent: 'center', alignItems: 'center', margin: '2%', borderWidth: 0.2, borderRadius: 10 }}>
                    <TextInput
                        multiline={true}
                        autoCorrect={true}
                        editable={true}
                        value={this.state.text_detail}
                        onChangeText={(text) => { this.setState({ text_detail: text }) }} style={styles.MemoDetail} />
                </View>
                <View style={styles.ButtonContainer}>
                    <Button
                        onPress={this.SubmitNewMemo}
                        title="Done"
                        containerStyle={styles.DoneButton}
                    />
                    <Button
                        onPress={this.OnCancelNewMemo}
                        title="Cancel"
                        containerStyle={styles.CancelButton}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems : 'center',
        alignContent : 'center',
        backgroundColor: dynamic_side_drawer_item_background()
    },
    SectionView: {
        width: '98%',
        flexDirection: 'row',
        marginLeft: '2%',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        marginRight: '2%',
        marginTop: '2%'
    },
    TitleTextView: {
        borderWidth: 0.4,
    },
    TextStyle: {
        width: '20%',
        height: '100%',
        fontSize: 20
    },
    MemoDetail: {
        width: '100%',
        height: '100%'
    },
    DoneButton: {
        width: '40%',
        height: 100,
        marginRight: 5
    },
    CancelButton: {
        width: '40%',
        height: 100,
        marginLeft: 5
    },
    ButtonContainer: {
        flexDirection: 'row',
        minHeight: '10%',
        width: '95%',
        alignContent: 'center',
        alignItems: 'center',
        margin: '2%',
        justifyContent: 'center'
    }
})