import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { MemoColor } from '../constants/ColorCode';
import { ColorPicker, TriangleColorPicker, fromHsv } from 'react-native-color-picker'
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
        to_date: new Date().getTime(),
        display_from: false,
        display_to: false,
        text_detail: '',
        color_picker_visible: false,
        selected_color: '#ffffff'
    }
    setFrom_date = (date) => {
        if (date.type !== "dismissed") {
            this.setState({ from_date: date.nativeEvent.timestamp, display_from: !this.state.display_from });
        }
        this.setState({ display_from: !this.state.display_from });
    }
    setTo_date = (date) => {
        if (date.type !== "dismissed") {
            this.setState({ to_date: date.nativeEvent.timestamp, display_to: !this.state.display_to });
        }
    }
    OnCancelNewMemo=()=>{
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
    SubmitNewMemo=()=>{
        console.log("Submit New Memo");
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
                    <TouchableOpacity onPress={() => { this.setState({ display_from: !this.state.display_from }) }}>
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
                    <View style={{ backgroundColor: this.state.selected_color, 
                        borderRadius: 300, 
                        width: 20, 
                        height: 20,
                        marginRight: 10, 
                        borderWidth: 2, 
                        borderColor: 'black' , 
                        marginRight : 0}}>
                    <Text></Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Detail :   </Text>
                    <TextInput multiline={true} autoCorrect={true} editable={true} value={this.state.text_detail} onChangeText={(text) => { this.setState({ text_detail: text }) }} />
                </View>
                <View style={{flexDirection : 'row'}}>
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