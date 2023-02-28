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
  ImageBackground,
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
  const [justFinished, setJustFinished] = useState(false)
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
          Math.floor(Math.random() * 50 + 80)}, ${
          Math.floor(Math.random() * 50 + 80)}, ${
          Math.floor(Math.random() * 50 + 80)})`
        console.log('RGB', rgb)
        newResponses.push({question: prompt, answer: response, rgb})
        setPrompt('')
        setLoading(false)
        setResponses(newResponses)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        const newResponses = [...responses]
        newResponses.push({question: prompt, answer: 'something went wrong', rgb: 'rgb(255, 0, 0)'})
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
    Animated.timing(keyboardHeight.current, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start()
    setIsKeyboardVisible(true)
    setTextInputViewHeight(50)
  }

  const keyboardWillHideHandler = (event) => {
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
      {/*<ImageBackground source={require('../../assets/wassapbg.png')} style={{flex: 1}}>*/}
        <View style={styles.topButtons}>
          <Button title="Clear" onPress={clearData}/>
          <Button title="Logout" onPress={logout}/>
        </View>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            <FlatList
              ref={flatListRef}
              style={{...styles.flatList, marginBottom:
                  isKeyboardVisible ? -70 : 0}}
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
                      borderRadius: 10,
                    },
                    textQuestion: {
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#fff',
                    },
                    answerView: {
                      position: 'relative',
                      padding: 14,
                      marginTop: 20,
                      marginBottom: 13,
                      marginLeft: 10,
                      marginRight: 10,
                      borderWidth: .4,
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
                        <Clipper data={item.question} color={'white'}/>
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
          style={{...styles.inputView}}
        >
          <TextInput
            placeholder=""
            style={{...styles.input}}
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
              colors={['#fff', '#ddd']}
              style={styles.submitButtonView}>
              {loading ? <ActivityIndicator size="small" color="#999"/> : <Ionicons
                name="md-paper-plane"
                size={16}
                color={prompt.trim() ? 'black' : 'silver'}
                style={{transform: [{translateX: -1.5}, {rotate: '45deg'}]}}
                />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      {/*</ImageBackground>*/}
    </Animated.View>
  )
}

export default Home

const styles = StyleSheet.create({
  containerAnimatedView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#ddd',
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
    backgroundColor: '#f6f6f6',
    padding: 10,
    width: '100%',
    minHeight: VIEW_HEIGHT,
    borderStyle: 'solid',
    borderTopWidth: .4,
    borderTopColor: '#888',
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
    borderWidth: .4,
    borderColor: '#888',
    borderRadius: 20,
    flex: 1,
  },
  submitButtonView: {
    backgroundColor: '',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: .4,
    borderColor: '#888',
    marginLeft: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
