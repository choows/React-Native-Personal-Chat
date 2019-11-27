import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
export default class MemoScreen extends React.Component {

    state={
        currentDate : '2019-12-01',
        maxDate : '2020-12-01'
    }

    onMonthChange=(month)=>{
        console.log('month changed', month)
    }

    componentDidMount=()=>{
        const currentDate = new Date();
        const currentDateString  = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate();
        console.log(currentDateString);
        this.setState({currentDate : currentDateString});
    }   

    render() {
        return (
            <View>
                <Calendar
                    // Initially visible month. Default = Date()
                    current={this.state.currentDate}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => { console.log('selected day', day) }}
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
                />
                <Text>Helo</Text>
            </View>
        )
    }
}

//https://github.com/wix/react-native-calendars