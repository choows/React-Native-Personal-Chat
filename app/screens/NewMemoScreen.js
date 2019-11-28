import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

export default class NewMemoScreen extends React.Component {
    state = {
        from_date: new Date().getTime(),
        to_date: new Date().getTime(),
        display_from: false,
        display_to: false
    }
    setFrom_date = (date) => {  
        //console.log(date);     
        if(date.type !== "dismissed"){
            this.setState({from_date : date.nativeEvent.timestamp , display_from : !this.state.display_from});
        }
    }
    setTo_date = (date) => {
        console.log(date);
    }
    componentDidMount(){
        
    }
    DateDisplay=(dateString)=>{
        let datestr = new Date(dateString);
        return datestr.getFullYear() + "-" + (datestr.getUTCMonth()+ 1) + "-" + datestr.getDate();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.SectionView}>
                    <Text>From : </Text>
                    <TouchableHighlight onPress={()=>{this.setState({display_from : !this.state.display_from})}}>
                        <Text>{this.DateDisplay(this.state.from_date)}</Text>
                    </TouchableHighlight>
                    
                    {
                        this.state.display_from && <DateTimePicker 
                        value={new Date(this.state.from_date)}
                        mode={"date"}
                        display="calendar"
                        onChange={this.setFrom_date} />
                    }
                    {
                        this.state.display_to && <DateTimePicker 
                        value={new Date(this.state.to_date)}
                        mode={'date'}
                        display="calendar"
                        onChange={this.setTo_date} />
                    }
                    
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