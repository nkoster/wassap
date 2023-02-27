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

import TestScreen from './src/screens/TestScreen.jsx'

const App = () => {

  return (
    // <View style={styles.container}>
      <TestScreen />
    // </View>
  )

  // const [text, setText] = useState('')
  // const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  //
  // useEffect(() => {
  //   Keyboard.addListener('keyboardDidShow', () => {
  //     setKeyboardVisible(true)
  //     console.log('Keyboard Shown')
  //   })
  //   Keyboard.addListener('keyboardDidHide', () => {
  //     setKeyboardVisible(false)
  //     console.log('Keyboard Hidden')
  //   })
  //   return () => {
  //     Keyboard.removeAllListeners('keyboardDidShow')
  //     Keyboard.removeAllListeners('keyboardDidHide')
  //   }
  // }, [])
  //
  // return (
  //   // <View style={styles.container}>
  //   // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
  //   //   <View style={styles.container}>
  //   <KeyboardAvoidingView behavior="padding" style={styles.container}>
  //     <ScrollView>
  //       <Text>aap</Text>
  //       <Text>aap</Text>
  //       <Text>aap</Text>
  //       <Text>aap</Text>
  //       <Text>aap</Text>
  //       <Text>aap</Text>
  //     </ScrollView>
  //     <View style={styles.inputView}>
  //       <TextInput
  //         style={styles.input}
  //         placeholder="Typ hier..."
  //         value={text}
  //         onChangeText={setText}
  //         multiline={true}
  //         onBlur={() => Keyboard.dismiss()}
  //         // style={{backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8}}
  //       />
  //       {isKeyboardVisible && (
  //         <Text style={{color: 'red'}}>Keyboard is visible</Text>
  //       )}
  //     </View>
  //   </KeyboardAvoidingView>
  //   // </View>
  //   // </TouchableWithoutFeedback>
  // )
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
