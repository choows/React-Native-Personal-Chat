import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, PermissionsAndroid, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { EventRegister } from 'react-native-event-listeners';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import { IMAGE_URL } from '../constants/url';
import { dynamic_side_drawer_icon_color, dynamic_side_drawer_header_color, dynamic_main_background_color, dynamic_side_drawer_item_background } from '../theme/DynamicStyles';

class Card extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.CardView} onPress={() => { this.props.OnImagePressed(this.props.UploadDate) }}>
                <Image source={{ uri: this.props.path }} style={styles.Image} />
            </TouchableOpacity>
        )
    }
}
//https://github.com/alexbrillant/react-native-deck-swiper/blob/master/Example/App.js
export default class GalleryScreen extends React.Component {
    state = {
        cards: [],
        currentIndex: 0,
        totalIndex: 0,
        visible : false
    }
    componentDidMount = () => {
        EventRegister.addEventListener("AddNewImage", () => {
            //At here initialize the new image upload to firebase 
            ImagePicker.showImagePicker({
                title: 'Photo',
                takePhotoButtonTitle: 'Take Photo',
                chooseFromLibraryButtonTitle: 'Library',
                cancelButtonTitle: 'Cancel',
                mediaType: 'photo',
                quality: 1,
            }, (response) => {
                if (!response.didCancel) {
                    this.UploadToFirebaseStorage(response.path);
                }
            })
        })


        /**
         * initial read from firebase
         */
        // firebase.database().ref(IMAGE_URL).orderByKey().once('value', (snapshot) => {
        //     const result = snapshot.toJSON();
        //     let keys = Object.keys(snapshot.toJSON());
        //     keys.map((key) => {
        //         this.state.cards.push({
        //             Date: key,
        //             path: result[key]["path"]
        //         });
        //     });
        //     this.setState({ cards: this.state.cards });
        // });
        // this.ListenToChanges();
        firebase.database().ref(IMAGE_URL).orderByKey().on('child_added', (snapshot) => {
            let result = snapshot.toJSON();
            const index = this.state.cards.indexOf(x => x.Date === result["DateTime"]);
            if (index === -1) {
                this.state.cards.unshift({
                    Date: result["DateTime"],
                    path: result["path"],
                    url: result["url"]
                });
                this.setState({ cards: this.state.cards , visible : false } , ()=>{
                    this.setState({visible : true});
                });
            }
        });

    }



    ListenToChanges = () => {
        firebase.database().ref(IMAGE_URL).orderByKey().on('child_added', (snapshot) => {
            let result = snapshot.toJSON();
            const index = this.state.cards.indexOf(x => x.Date === result["DateTime"]);
            if (index === -1) {
                this.state.cards.unshift({
                    Date: result["DateTime"],
                    path: result["path"],
                    url: result['url']
                });
                this.setState({ cards: this.state.cards , visible : false } , ()=>{
                    this.setState({visible : true});
                });
            }

            //console.log("Result : " + JSON.stringify(snapshot.toJSON()));
        });
    }

    componentWillUnmount = () => {
        EventRegister.removeEventListener("AddNewImage");
    }
    UploadToFirebaseStorage = (path) => {
        const currentDate = new Date().getTime();
        let storage_path = currentDate.toString();
        firebase.storage().ref(storage_path).putFile(path).then((response) => {
            this.UploadToFirebaseDatabase(response.downloadURL, path);
        }).catch((err) => {
            console.log("Upload Error : " + err);
        });
    }

    UploadToFirebaseDatabase = (path, url) => {
        const currentDate = new Date().getTime().toString();
        firebase.database().ref(IMAGE_URL + "/" + currentDate).set({
            path: path,
            DateTime: currentDate,
            url: url
        }).then(() => {
            EventRegister.emit("Toast", "Upload Image Successfully");
        })
            .catch((err) => {
                console.log("Upload to Database Error : " + err);
            });
    }
    GoToPrevious = () => {
        this.swiper.swipeBack();
    }
    GoToNext = () => {
        this.swiper.swipeRight();
    }
    GoToFirst = () => {
        this.swiper.jumpToCardIndex(0);
    }
    OnImagePress = (TimeStamp) => {
        console.log(TimeStamp);
    }
    OnCardSwiped=(details)=>{
        this.setState({currentIndex : details +1});
        console.log(details);
    }
    render() {
        return (
            <View style={styles.Container}>
                <View style={styles.SwpView}>
                    {this.state.visible ?
                        <Swiper
                            ref={swiper => {
                                this.swiper = swiper
                            }}
                            cards={this.state.cards}
                            renderCard={(card) => {
                                return (
                                    <Card path={card.path} UploadDate={card.Date} key={card.Date} OnImagePressed={this.OnImagePress} />
                                )
                            }}
                            cardIndex={0}
                            onSwiped={this.OnCardSwiped}
                            onSwipedLeft={() => { this.GoToPrevious }}
                            goBackToPreviousCardOnSwipeRight={true}
                            stackSize={3}
                            backgroundColor={dynamic_side_drawer_item_background()}
                            childrenOnTop={true}
                            infinite={true}
                            cardHorizontalMargin={0}
                            cardVerticalMargin={0}
                            verticalSwipe={false}
                        >
                            <View style={{ height: '100%', width: '100%', flexDirection: 'column-reverse' }}>
                                <View style={{ height: '5%', width: '100%', justifyContent : 'center' , alignContent : "center" , alignItems : 'center'}}>
                                    <Text style={{fontSize : 18}}>{this.state.currentIndex + " / " + this.state.cards.length}</Text>
                                </View>
                            </View>
                        </Swiper>
                        :
                        <View></View>
                    }
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
        width: '100%',
        alignItems: 'center',
        flex: 1,
        alignContent: 'center'
    },
    NavigationView: {
        height: '5%',
        width: '100%',
        flexDirection: 'row'
    },
    ButtonView: {
        width: '50%',
        height: '100%'
    },
    CardView: {
        backgroundColor: 'white',
        height: '80%',
        width: '100%'
    },
    Image: {
        height: '100%',
        width: '100%',
        resizeMode: 'stretch'
    },
    DateDisplay: {
        height: '100%',
        width: '100%',
        textAlign: 'justify',
    }
})