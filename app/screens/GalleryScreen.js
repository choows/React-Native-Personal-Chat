import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { EventRegister } from 'react-native-event-listeners';
import firebase from 'react-native-firebase';

class Card extends React.Component {
    render() {
        return (
            <View style={styles.CardView}>
                <Text>{this.props.text}</Text>
            </View>
        )
    }
}
//https://github.com/alexbrillant/react-native-deck-swiper/blob/master/Example/App.js
export default class GalleryScreen extends React.Component {
    state = {
        cards: ["hello", "Here", "Is", "Sample"]
    }
    componentDidMount=()=>{
        EventRegister.addEventListener("AddNewImage" , ()=>{
            //At here initialize the new image upload to firebase 
            console.log("Add New Image");
            
        })
    }
    componentWillUnmount=()=>{
        EventRegister.removeEventListener("AddNewImage");
    }
    GoToPrevious = () => {
        this.swiper.swipeBack();
    }
    GoToNext = () => {
        this.swiper.swipeRight();
    }

    render() {
        return (
            <View style={styles.Container}>
                <View style={styles.SwpView}>
                    <Swiper
                        ref={swiper => {
                            this.swiper = swiper
                        }}
                        cards={this.state.cards}
                        renderCard={(card) => {
                            return (
                                <Card text={card}/>
                            )
                        }}
                        cardIndex={0}
                        onSwipedLeft={()=>{this.GoToPrevious}}
                        goBackToPreviousCardOnSwipeRight={true}
                        stackSize={3}
                        backgroundColor={"#eb4034"}
                        childrenOnTop={true}
                        infinite={true}
                        cardHorizontalMargin={10}
                        cardVerticalMargin={10}
                    >   
                    </Swiper>
                </View>
                {
                    /**
                     * <View style={styles.NavigationView}>
                        <TouchableOpacity onPress={this.GoToPrevious} style={styles.ButtonView}>
                            <Text>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.GoToNext} style={styles.ButtonView}>
                            <Text>Next</Text>
                        </TouchableOpacity>
                </View>
                     */
                }
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        height: '100%',
        width: '100%',
        alignContent: 'center',
        flex: 1
    },
    SwpView: {
        height: '100%',
        width: '100%'
    },
    NavigationView: {
        height: '5%',
        width: '100%',
        flexDirection : 'row'
    },
    ButtonView : {
        width : '50%',
        height : '100%'
    },
    CardView : {
        backgroundColor : 'white',
        height : '100%',
        width : '100%'
    }
})