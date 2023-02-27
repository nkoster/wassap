import React, {useState, useEffect, useContext, useRef} from 'react'
import {
  Keyboard,
  Text,
  Animated,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient'
import {AuthContext} from '../context/useAuthContext'
import Clipper from '../components/Clipper'
import TheAnswer from '../components/TheAnswer'
import {gptchat} from '../api'

const VIEW_HEIGHT = 90
const TEXT_HEIGHT = 30
const TEXT_MAX_HEIGHT = 80
const APPLE_BLUE = '#007AFF'

function Home() {
  const keyboardHeight = useRef(new Animated.Value(0))
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [textInputViewHeight, setTextInputViewHeight] = useState(VIEW_HEIGHT)
  const [textHeight, setTextHeight] = useState(TEXT_HEIGHT)

  const {accessToken, responses, logout, setResponses} = useContext(AuthContext)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef()

  const handleChangePrompt = (text) => {
    setPrompt(text)
  }

  const gptChat = () => {
    setLoading(true)
    gptchat(prompt, responses, accessToken)
      .then(response => {
        const newResponses = [...responses]
        const rgb = `rgb(${
          Math.floor(Math.random() * 80 + 170)}, ${
          Math.floor(Math.random() * 80 + 170)}, ${
          Math.floor(Math.random() * 80 + 170)})`
        newResponses.push({question: prompt, answer: response, rgb})
        setPrompt('')
        setLoading(false)
        setResponses(newResponses)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        logout()
      })
  }

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', keyboardWillShowHandler)
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', keyboardWillHideHandler)
    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const keyboardWillShowHandler = (event) => {
    console.log('keyboardWillShowHandler', keyboardHeight.current)
    Animated.timing(keyboardHeight.current, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start()
    setIsKeyboardVisible(true)
    setTextInputViewHeight(50)
  }

  const keyboardWillHideHandler = (event) => {
    console.log('keyboardWillHideHandler', keyboardHeight.current)
    Animated.timing(keyboardHeight.current, {
      duration: event.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start()
    setIsKeyboardVisible(false)
    setTextInputViewHeight(VIEW_HEIGHT)
  }

  const clearData = () => {
    Alert.alert(
      'Are you sure?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setResponses([])
            setPrompt('')
          },
        },
      ],
      {cancelable: true},
    )
  }

  const scrollToEnd = () => {
    if (responses.length === 0) return
    flatListRef.current?.scrollToEnd({
      animated: true,
      index: responses.length,
      viewPosition: 1,
    })
  }

  return (
    <Animated.View style={{...styles.containerAnimatedView, marginBottom: keyboardHeight.current}}>
      <View style={styles.topButtons}>
        <Button title="Clear" onPress={clearData}/>
        <Button title="Logout" onPress={logout}/>
      </View>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <FlatList
            ref={flatListRef}
            style={{...styles.flatList, marginBottom: isKeyboardVisible ? -70: 0}}
            data={responses}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
            renderItem={
              ({item}) => {
                const styles = StyleSheet.create({
                  questionView: {
                    backgroundColor: item.rgb,
                    padding: 14,
                    marginTop: 20,
                    marginBottom: -10,
                    marginLeft: 10,
                    marginRight: 10,
                    borderStyle: 'solid',
                    borderRadius: 10,
                  },
                  textQuestion: {
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                  answerView: {
                    position: 'relative',
                    padding: 14,
                    marginTop: 20,
                    marginBottom: 13,
                    marginLeft: 10,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: item.rgb,
                    borderStyle: 'solid',
                    borderRadius: 10,
                    backgroundColor: '#fff',
                  },
                  textAnswer: {
                    fontSize: 16,
                  },
                })

                return (
                  <View>
                    <View style={styles.questionView}>
                      <Text style={styles.textQuestion}>{item.question}</Text>
                      <Clipper data={item.question} color={'#777'}/>
                    </View>
                    <View style={styles.answerView}>
                      <TheAnswer data={item.answer.replace(/^[\n?]+/, '')}/>
                      <Clipper data={item.answer.replace(/^[\n?]+/, '')} color={'silver'}/>
                    </View>
                  </View>
                )
              }
            }
          />
      </KeyboardAvoidingView>
      </View>
      <View
        style={{...styles.inputView, minHeight: textInputViewHeight}}
      >
        <TextInput
          placeholder=""
          style={{...styles.input, height: textHeight, maxHeight: TEXT_MAX_HEIGHT}}
          onChangeText={handleChangePrompt}
          value={prompt}
          multiline={true}
          onContentSizeChange={(event) => setTextHeight(event.nativeEvent.contentSize.height)}
        />
        <TouchableOpacity
          disabled={loading || prompt === ''}
          onPress={gptChat}
        >
          <LinearGradient
            colors={['#f0f0f0', '#ccc']}
            style={styles.submitButtonView}>
            {loading ? <ActivityIndicator size="small" color="silver"/> : <Ionicons
              name="md-paper-plane"
              size={16}
              color={prompt.trim() ? 'black' : 'silver'}/>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

export default Home

const styles = StyleSheet.create({
  containerAnimatedView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flatList: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputView: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    minHeight: VIEW_HEIGHT,
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
    paddingRight: 12,
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
  },
})
