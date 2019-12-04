import React from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { EventRegister } from 'react-native-event-listeners';
import { NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { MEMO_URL } from '../constants/url';
class Memo extends React.Component {

    navigateToDetails = () => {
        const path = MEMO_URL + "Detail/" + this.props.date + "/" + this.props.keyword ;

        this.props.navigation.navigate('EditMemo', {
            path : path,
            color : this.props.color,
            text : this.props.text,
            title : this.props.title,
            date : this.props.date
        });
    }

    render() {
        return (
            <View style={{ width: '100%', height: 40, flexDirection: 'row', alignContent: 'center' }}>
                <TouchableOpacity onPress={this.navigateToDetails} style={{height : '100%' , width : '100%' , flexDirection : 'row' , alignContent : 'stretch'}}>
                    <View style={{ backgroundColor: this.props.color, borderRadius: 300, width: 20, height: 20, marginRight: 10, borderWidth: 1, borderColor: 'black' }}>
                        <Text></Text>
                    </View>
                    <Text>{this.props.title}</Text>
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
        const currentDateString = currentDate.getFullYear() + "-" + (currentDate.getMonth() +1).toString() + "-" + currentDate.getDate();
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
        EventRegister.addEventListener("RefreshMemoWithDate" , (yearmonthday)=>{
                this.setUpMemoDetail(yearmonthday);
        });
    }

    setUpMemoDetail = (yearmonthday) => {
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
                            title : details["title"]
                        });
                    });
                    this.setState({ Memos: new_arr });
                }
            }
        })
        // this.state.Memos.push(sample_memo);
        // this.setState({ Memos: this.state.Memos });
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
                console.log("child_added called");
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
                console.log("child_changed called ");
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
                            monthFormat={'yyyy MM'}
                            // Handler which gets executed when visible month changes in calendar. Default = undefined
                            onMonthChange={this.onMonthChange}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={false}
                            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                            // day from another month that is visible in calendar page. Default = false
                            disableMonthChange={false}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                            firstDay={1}
                            // Hide day names. Default = false
                            hideDayNames={false}
                            // Show week numbers to the left. Default = false
                            showWeekNumbers={true}
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
                                <Memo text={memo.text} title={memo.title} key={memo.key} date={memo.date} color={memo.color} keyword={memo.key} navigation={this.props.navigation}/>)
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
        width: '100%'
    }
})