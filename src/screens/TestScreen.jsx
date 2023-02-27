import React, {useState, useEffect} from 'react'
import {
  Keyboard, Text,
  Animated, View, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity,
} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient'

const VIEW_HEIGHT = 90
const TEXT_HEIGHT = 30
const TEXT_MAX_HEIGHT = 80
const APPLE_BLUE = '#007AFF'

function TestScreen() {
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0))
  const [textInputViewHeight, setTextInputViewHeight] = useState(VIEW_HEIGHT)
  const [textHeight, setTextHeight] = useState(TEXT_HEIGHT)

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', keyboardWillShowHandler)
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', keyboardWillHideHandler)

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const keyboardWillShowHandler = (event) => {
    console.log('duration', event.duration)
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start()
    setTextInputViewHeight(50)
    // setTextHeight(110)
  }

  const keyboardWillHideHandler = (event) => {
    Animated.timing(keyboardHeight, {
      duration: event.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start()
    setTextInputViewHeight(VIEW_HEIGHT)
    // setTextHeight(TEXT_HEIGHT)
  }

  return (
      <Animated.View style={{...styles.containerAnimatedView, marginBottom: keyboardHeight}}>
        <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
          <ScrollView>
            {new Array(30).fill('aap').map(
              (item, index) => <Text key={index} style={styles.text}>{item}</Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        </View>
        <View
          style={{...styles.inputView, minHeight: textInputViewHeight}}
        >
          <TextInput
            placeholder=""
            style={{...styles.input, height: textHeight, maxHeight: TEXT_MAX_HEIGHT}}
            multiline={true}
            onContentSizeChange={(event) => setTextHeight(event.nativeEvent.contentSize.height)}
          />
          <TouchableOpacity>
            <LinearGradient
              colors={['#f0f0f0', '#ccc']}
              style={styles.submitButtonView}>
              <Ionicons
                name='md-paper-plane'
                size={16}
                color={'silver'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
  )
}

export default TestScreen

const styles = StyleSheet.create({
  containerAnimatedView: {
    flex: 1,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputView: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    minHeight: VIEW_HEIGHT,
    maxHeight: 110,
    borderStyle: 'solid',
    borderTopWidth: .5,
    borderTopColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    height: 40,
  },
  input: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    fontSize: 16,
    minHeight: TEXT_HEIGHT,
    maxHeight: TEXT_MAX_HEIGHT,
    borderStyle: 'solid',
    borderWidth: .5,
    borderColor: '#ccc',
    borderRadius: 20,
    flex: 1,
  },
  submitButtonView: {
    backgroundColor: '',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    borderColor: '#aaa',
    marginLeft: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
