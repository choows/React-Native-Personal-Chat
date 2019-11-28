import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
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
        visible: false
    }

    onMonthChange = (month) => {
        console.log('month changed', month)
    }

    onDayPressed = (day) => {
        console.log("Day Selected : " + day["dateString"]);
        //this.state.markedDates[day["dateString"]] = {dotColor: 'red' , marked: true};
        let marked = {};
        marked[day["dateString"]] = { selected: 'true' }
        this.setState({ markedDates: marked });
        // this.setState({visible : false},()=>{
        //     this.setState({visible : true});
        // });
    }
    componentDidMount = () => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        const currentDateString = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
        const nxtyear = new Date();
        nxtyear.setMonth(nxtyear.getMonth() + 1);
        nxtyear.setDate(nxtyear.getDate() + 365);
        const nextYearDateString = nxtyear.getFullYear() + "-" + nxtyear.getMonth() + "-" + nxtyear.getDate();
        this.setState({ currentDate: currentDateString });
        this.setState({ maxDate: nextYearDateString });
        this.setState({ visible: true });
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
                            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                            maxDate={this.state.maxDate}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={this.onDayPressed}
                            // Handler which gets executed on day long press. Default = undefined
                            onDayLongPress={(day) => { console.log('selected day', day) }}
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
                            markingType={'dot'}
                            ref={calender => {
                                this.calender = calender
                            }}
                        />
                        : <View></View>}
                </View>

                <View style={styles.detailsView}>
                    <ScrollView>
                        <Text>Hello1 </Text>
                        <Text>Hello 2</Text>
                        <Text>Hello 3</Text>
                        <Text>Hello 4</Text>
                        <Text>Hello 5</Text>
                        <Text>Hello 6</Text>
                        <Text>Hello 7</Text>
                        <Text>Hello 8</Text>
                        <Text>Hello 9</Text>
                        <Text>Hello 0</Text>
                        <Text>Hello 1</Text>
                        <Text>Hello 2</Text>
                        <Text>Hello 3</Text>
                        <Text>Hello 4</Text>
                        <Text>Hello 5</Text>
                        <Text>Hello 6</Text>
                        <Text>Hello 7</Text>
                        <Text>Hello 8</Text>
                        <Text>Hello 9</Text>
                        <Text>Hello 0</Text>
                        <Text>Hello 1</Text>
                        <Text>Hello 2</Text>
                        <Text>Hello 3</Text>
                        <Text>Hello 4</Text>
                        <Text>Hello 5</Text>
                        <Text>Hello 6</Text>
                        <Text>Hello 7</Text>
                        <Text>Hello 8</Text>
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
        height: '55%',
        width: '100%'
    },
    detailsView: {
        height: '45%',
        width: '100%'
    }
})