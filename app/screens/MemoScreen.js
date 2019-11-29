import React from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { EventRegister } from 'react-native-event-listeners';
import { NavigationActions } from 'react-navigation';

class Memo extends React.Component {
    /*Display as .......    Text : Dot With Color */
    render() {
        return (
            <View>
                <Text>{this.props.text}</Text>
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
        markedDates: {
                '2019-11-28': {dots: [{color: 'green'}, {color: 'red'}, {color: 'yellow'}]}
            },
        visible: false,
        Memos: [],
        selectedDate: null
    }

    onMonthChange = (month) => {
        console.log('month changed', month)
    }

    onDayPressed = (day) => {
        console.log("Day Selected : " + day["dateString"]);
        //this.state.markedDates[day["dateString"]] = {dotColor: 'red' , marked: true};
        this.setSelectedDay(day["dateString"]);
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
            this.setState({ visible: false }, () => {
                this.setState({ visible: true });
            });
            this.setState({ selectedDate: daystring});
        });

    }
    componentDidMount = () => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        const currentDateString = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
        const nxtyear = new Date();
        nxtyear.setMonth(nxtyear.getMonth() + 1);
        nxtyear.setDate(nxtyear.getDate() + 365);
        const nextYearDateString = nxtyear.getFullYear() + "-" + nxtyear.getMonth() + "-" + nxtyear.getDate();
        this.setState({ currentDate: currentDateString, maxDate: nextYearDateString }, () => {
            this.setState({ visible: true });
        });
        this.setUpMemoDetail();
        EventRegister.addEventListener("AddNewMemo", () => {
            const navigateAction = NavigationActions.navigate({
                routeName: "NewMemo"
            });
            this.props.navigation.dispatch(navigateAction);
        })
    }

    setUpMemoDetail = () => {
        let sample_memo = {
            text: "Sample Memo Here",
            date: "2019-12-12",
            key: 'asbvvwef'
        }
        this.state.Memos.push(sample_memo);
        this.setState({ Memos: this.state.Memos });
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.calenderView}>
                    {this.state.visible ?
                        <Calendar
                            // Initially visible month. Default = Date()
                            current={this.state.currentDate}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={this.state.currentDate}
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
                            disableMonthChange={true}
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
                            markedDates={this.state.markedDates}
                            markingType={'multi-dot'}
                        />
                        : <View></View>}
                </View>

                <View style={styles.detailsView}>
                    <ScrollView>
                        {
                            this.state.Memos.map((memo) =>
                                <Memo text={memo.text} key={memo.key} />)
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