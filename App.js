import React, {useEffect, useState} from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native'

import Home from './src/screens/Home.jsx'

const App = () => {

  return (
    // <View style={styles.container}>
      <Home />
    // </View>
  )

}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',
  },
  inputView: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    minHeight: 30,
    maxHeight: 120,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    // marginBottom: 20,
    // marginLeft: 20,
    // marginRight: 20,
    // maxHeight: 80,
  },
})
