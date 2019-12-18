import React from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableHighlight, TouchableOpacity , Alert } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { EventRegister } from 'react-native-event-listeners';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { MEMO_URL } from '../constants/url';
import { dynamic_main_background_color } from '../theme/DynamicStyles';
class Memo extends React.Component {

    navigateToDetails = () => {
        const path = MEMO_URL + "Detail/" + this.props.date + "/" + this.props.keyword;

        this.props.navigation.navigate('EditMemo', {
            path: path,
            color: this.props.color,
            text: this.props.text,
            title: this.props.title,
            date: this.props.date
        });
    }
    RemoveMemo=()=>{
        console.log("Remove Memo");
        const path = MEMO_URL + "Detail/" + this.props.date + "/" + this.props.keyword;
        firebase.database().ref(path).remove().then(()=>{
            EventRegister.emit("RefreshMemoWithDate" , this.props.date);
        }).then(()=>{
            this.RemoveColorFromDatabase();
        })
        .catch((err)=>{
            console.log("Remove Memo With Error : " + err);
        });
    }
    RemoveColorFromDatabase=()=>{
            var yearmonthdatearr = this.props.date.split("-");
            const yearmonth = yearmonthdatearr[0]+yearmonthdatearr[1];
            const path = MEMO_URL + "Overall/" + yearmonth + "/" + this.props.date + "/" ;
            firebase.database().ref(path).once('value', (snapshot) => {
                if (snapshot.exists()) {
                    
                    var colorarr = snapshot.toJSON()["color"].split(",");
                    const new_arr = colorarr.filter((color)=>{
                        color !== this.props.color;
                    });

                    firebase.database().ref(path).set({
                        color: new_arr.toString(),
                        YMD: this.props.date
                    }).catch((err) => {
                        console.log("Update Color Error : " + err);
                    });
                }
            }).catch((err)=>{
                console.log("Firebase Get Colro Value Error : " + err);
            })
            EventRegister.emit("RefreshMemoMonthWithDate" , yearmonth);
    }
    LongPress=()=>{
        Alert.alert('Actions' , 'Please select one of the action.' , [
            {text: 'Cancel' , onPress : ()=>console.log('Cancel...'), style : 'cancel'},
            {text: 'View' , onPress: ()=>this.navigateToDetails()},
            {text: 'Remove' , onPress: ()=>this.RemoveMemo()}
        ] , {
            cancelable : true
        });
    }
    render() {
        return (
            <View style={{ width: '100%', height: 40, flexDirection: 'row', alignContent: 'center', marginTop: 5, borderWidth: 0.1 }}>
                <TouchableOpacity onPress={this.navigateToDetails} onLongPress={this.LongPress} style={{ height: '100%', width: '100%', flexDirection: 'row', alignContent: 'stretch' }}>
                    <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ backgroundColor: this.props.color, borderRadius: 300, width: 30, height: 30, marginRight: 10, borderWidth: 1, borderColor: 'black' }}>
                            <Text></Text>
                        </View>
                    </View>
                    <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{this.props.title}</Text>
                    </View>

                </TouchableOpacity>

            </View>
        )
    }
}


export default class MemoScreen extends React.Component {
    /**
     * differentiate the important using dot color ,
     * database design as below : 
     * 
     * Memo -> All -> YearMonth(201911)->store all the dates with important color 
     * 
     * Memo -> Details -> YearMonthDay -> store all the memo and display at bottom 
     */
    state = {
        currentDate: '2019-12-01',
        maxDate: '2020-12-01',
        markedDates: {},
        visible: false,
        Memos: [],
        selectedDate: null
    }

    onMonthChange = (month) => {
        //this.setState({markedDates : {}});
        this.setUpMonthlyMemo(month.year.toString() + month.month.toString());
    }

    onDayPressed = (day) => {
        //this.state.markedDates[day["dateString"]] = {dotColor: 'red' , marked: true};
        this.setSelectedDay(day["dateString"]);
        this.setUpMemoDetail(day["dateString"]);
    }
    /**
     * Done Till Here
     */
    setSelectedDay = (daystring) => {
        //daystring format :  2019-11-29
        if (this.state.selectedDate !== null) {
            this.state.markedDates[this.state.selectedDate]["selected"] = false;
        }
        if (typeof this.state.markedDates[daystring] === "undefined") {
            this.state.markedDates[daystring] = {
                selected: true
            }
        } else {
            this.state.markedDates[daystring]["selected"] = true;
        }
        this.setState({ markedDates: this.state.markedDates }, () => {
            // this.setState({ visible: false }, () => {
            //     this.setState({ visible: true });
            // });
            this.setState({ selectedDate: daystring });
        });

    }
    componentDidMount = () => {
        const currentDate = new Date();
        // currentDate.setMonth(currentDate.getMonth());
        const currentDateString = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getDate();
        this.setUpMonthlyMemo(currentDate.getFullYear().toString() + (currentDate.getMonth() + 1).toString());
        const nxtyear = new Date();
        nxtyear.setMonth(nxtyear.getMonth() + 1);
        nxtyear.setDate(nxtyear.getDate() + 365);
        const nextYearDateString = nxtyear.getFullYear() + "-" + nxtyear.getMonth() + "-" + nxtyear.getDate();
        this.setState({ currentDate: currentDateString, maxDate: nextYearDateString }, () => {
            this.setState({ visible: true });
        });
        EventRegister.addEventListener("AddNewMemo", () => {
            const navigateAction = NavigationActions.navigate({
                routeName: "NewMemo"
            });
            this.props.navigation.dispatch(navigateAction);
        });
        EventRegister.addEventListener("RefreshMemoWithDate", (yearmonthday) => {
            this.setUpMemoDetail(yearmonthday);
        });
        EventRegister.addEventListener("RefreshMemoMonthWithDate" , (yearmonth)=>{
            this.setUpMonthlyMemo(yearmonth);
        });
    }

    setUpMemoDetail = (yearmonthday) => {
        this.setState({ Memos: [] });
        firebase.database().ref(MEMO_URL + "Detail/" + yearmonthday + "/").once('value', (snapshot) => {
            if (snapshot.exists) {
                if (snapshot.toJSON() !== null) {
                    let new_arr = [];
                    const result = snapshot.toJSON();
                    let keys = Object.keys(snapshot.toJSON());
                    keys.map((key) => {
                        const details = result[key];
                        new_arr.push({
                            text: details["text"],
                            date: yearmonthday,
                            key: key,
                            color: details["color"],
                            title: details["title"]
                        });
                    });
                    this.setState({ Memos: new_arr });
                }
            }
        });
    }

    setUpMonthlyMemo = (yearmonth) => {
        console.log("YearMonth : " + yearmonth);
        /*
        {
                '2019-11-28': {dots: [{color: 'green'}, {color: 'red'}, {color: 'yellow'}]},
                '2019-11-29': {dots: [{color: 'green'}, {color: 'red'}, {color: 'yellow'}]}
        }
        */
        firebase.database().ref(MEMO_URL + "Overall/" + yearmonth).on('child_added', (snapshot) => {
            if (snapshot.exists) {
                const result = snapshot.toJSON();
                const color_arr = result['color'].split(',');
                let json_arr = [];
                color_arr.map((color) => {
                    if (color !== "") {
                        json_arr.push({
                            color: color
                        });
                    }
                })
                this.state.markedDates[result['YMD']] = {
                    dots: json_arr
                };
                this.setState({ markedDates: this.state.markedDates }, () => {
                    // this.setState({ visible: true });
                });
            }
        });
        firebase.database().ref(MEMO_URL + "Overall/" + yearmonth).on('child_changed', (snapshot) => {
            if (snapshot.exists) {
                const result = snapshot.toJSON();
                const color_arr = result['color'].split(',');
                let json_arr = [];
                color_arr.map((color) => {
                    if (color !== "") {
                        json_arr.push({
                            color: color
                        });
                    }
                })
                this.state.markedDates[result['YMD']] = {
                    dots: json_arr
                };
                this.setState({ markedDates: this.state.markedDates }, () => {
                    //  this.setState({ visible: true });
                });
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.calenderView}>
                    {this.state.visible ?
                        <Calendar
                            // Initially visible month. Default = Date()
                            //current={this.state.currentDate}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            //minDate={this.state.currentDate}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={this.onDayPressed}
                            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                            monthFormat={'MMM yyyy'}
                            // Handler which gets executed when visible month changes in calendar. Default = undefined
                            onMonthChange={this.onMonthChange}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={false}
                            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                            // day from another month that is visible in calendar page. Default = false
                            disableMonthChange={false}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                            firstDay={7}
                            // Hide day names. Default = false
                            hideDayNames={false}
                            // Show week numbers to the left. Default = false
                            showWeekNumbers={false}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                            onPressArrowLeft={substractMonth => substractMonth()}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                            onPressArrowRight={addMonth => addMonth()}
                            markedDates={JSON.parse(JSON.stringify(this.state.markedDates))}
                            markingType={'multi-dot'}
                        />
                        : <View></View>}
                </View>

                <View style={styles.detailsView}>
                    <ScrollView>
                        {
                            this.state.Memos.map((memo) =>
                                <Memo text={memo.text} title={memo.title} key={memo.key} date={memo.date} color={memo.color} keyword={memo.key} navigation={this.props.navigation} />)
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}

//https://github.com/wix/react-native-calendars

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    },
    calenderView: {
        height: '60%',
        width: '100%'
    },
    detailsView: {
        height: '40%',
        width: '90%',
        marginHorizontal: '5%',
        backgroundColor: dynamic_main_background_color(),
        marginTop: 5,
        borderTopWidth: 1
    }
})