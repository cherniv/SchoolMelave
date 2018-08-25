/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,
  Button,
} from 'react-native';

import LocationDetector from './js/LocationDetector'
import FirebaseService from './js/FirebaseService'
import * as firebase from 'firebase'

const start = () => {
  var today = (new Date).getDay();
  firebase.database().ref('lastday').once('value').then(lastday=>{
    lastday = lastday.val();
    if (lastday != today) {
      firebase.database().ref('lastday').set(today);
      firebase.database().ref('data').set(null);
    }
    LocationDetector.watchPosition();
  })
}

const stop = () => {
  LocationDetector.stopObserving();
}

type Props = {};
export default class App extends Component<Props> {
  state = {runs: false}
  start = () => {
    this.setState({runs: true});
    start();
  }
  stop = () => {
    this.setState({runs: false});
    stop();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome!</Text>
        {
          !this.state.runs ?
          <Button onPress={this.start} title="START">Start</Button>
          :
          <Button onPress={this.stop} title="STOP">Stop</Button>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
