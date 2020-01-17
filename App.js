/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';


class App extends React.Component {
constructor(props){
  super(props);

  firebase.messaging().hasPermission()
  .then(enabled => {
    if (enabled) {
      // user has permissions
    } else {
      firebase.messaging().requestPermission()
  .then(() => {
    alert('tenemos permisos')
  })
  .catch(error => {
    alert('cerrar app')
  });
    } 
  });


}


  //Escuchar notificaciones
  componentDidMount() {
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        // Process your notification as required
       
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
        // Process your notification as required
        alert(notification.body)
        console.log('Notificacion recibida')
    });

    firebase.notifications().getInitialNotification()
    .then((notificationOpen) => {
      if (notificationOpen) {
        alert('App abierta desde notificacion')
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;  
      }
    });
}

componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
}
  async sub(){
   var  user = await firebase.auth().signInAnonymouslyAndRetrieveData();
    const token = await firebase.iid().getToken()

  

  const follow =  firebase.functions().httpsCallable('followTheme');
  const data = {token:token, topic:'haha'}
  follow(data)
  .then((dataR) =>{
    console.log(dataR);
  }).catch(httpsError =>{
    console.log(httpsError);
  })
}

async unsub(){
  var  user = await firebase.auth().signInAnonymouslyAndRetrieveData();
    const token = await firebase.iid().getToken()

const follow =  firebase.functions().httpsCallable('unfollowTheme');
const data = {token:token, topic:'haha'}
follow(data)
.then((dataR) =>{
  console.log(dataR);
}).catch(httpsError =>{
  console.log(httpsError);
})
}



 render(){

 
  return (

    <>
      <Button title='Suscribirse??' onPress={this.sub}></Button>
      <Button title='Desuscribirse' onPress={this.unsub}></Button>
    </>
  );
 }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
