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
import {BlurView} from 'expo-blur'

const VIEW_HEIGHT = 90
const TEXT_HEIGHT = 30
const BASE_INTENSITY = 30.01

function Home() {
  const keyboardHeight = useRef(new Animated.Value(0))
  const [textHeight, setTextHeight] = useState(TEXT_HEIGHT)
  const [bottomViewHeight, setBottomViewHeight] = useState(VIEW_HEIGHT)
  const [typing, setTyping] = useState(false)

  const {accessToken, responses, logout, setResponses} = useContext(AuthContext)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef()
  const [intensity, setIntensity] = useState(BASE_INTENSITY)

  const handleChangePrompt = (text) => {
    setPrompt(text)
  }

  function newIntensity() {
    setIntensity(BASE_INTENSITY + (Math.random() / 10))
  }

  useEffect(() => {
    newIntensity()
  }, [responses])

  const gptChat = () => {
    setLoading(true)
    gptchat(prompt, responses, accessToken)
      .then(response => {
        const newResponses = [...responses]
        const rgb = `rgb(${
          Math.floor(Math.random() * 50 + 130)}, ${
          Math.floor(Math.random() * 50 + 130)}, ${
          Math.floor(Math.random() * 50 + 130)})`
        console.log('RGB', rgb)
        newResponses.push({question: prompt, answer: response, rgb})
        setPrompt('')
        setLoading(false)
        setResponses(newResponses)
        newIntensity()
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
    setBottomViewHeight(50)
    newIntensity()
  }

  const keyboardWillHideHandler = (event) => {
    Animated.timing(keyboardHeight.current, {
      duration: event.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start()
    setBottomViewHeight(VIEW_HEIGHT)
    newIntensity()
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
            newIntensity()
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

  const handleScroll = () => {
    newIntensity()
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <BlurView
        intensity={intensity}
        style={styles.topButtons}
        tint="light"
      >
        <Button title="Clear" color="black" onPress={clearData}/>
        <Button title="Logout" color="black" onPress={logout}/>
      </BlurView>
      <View style={styles.middleView}>
        <FlatList
          ref={flatListRef}
          style={{flex: 1}}
          data={responses}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={
            ({item, index}) => {
              const styles = StyleSheet.create({
                questionView: {
                  backgroundColor: item.rgb,
                  padding: 14,
                  marginTop: 20,
                  marginBottom: -10,
                  marginLeft: 16,
                  marginRight: 16,
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
                  marginLeft: 16,
                  marginRight: 16,
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
                  {index === 0 && <View style={{height: 30}}/>}
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
      </View>
      <View style={{
        ...styles.bottomView, height: typing ? null : bottomViewHeight, maxHeight: 80,
        marginBottom: typing ? 87 : 0, /* hack, needs improvement */
      }}>
        <TextInput
          placeholder=""
          style={{...styles.input, height: textHeight, minHeight: TEXT_HEIGHT, maxHeight: 60}}
          onChangeText={handleChangePrompt}
          value={prompt}
          multiline={true}
          onFocus={() => setTyping(true)}
          onBlur={() => setTyping(false)}
          onContentSizeChange={(event) => setTextHeight(event.nativeEvent.contentSize.height)}
        ></TextInput>
        <TouchableOpacity
          disabled={loading || prompt === ''}
          onPress={gptChat}
        >
          <LinearGradient
            colors={['#fff', '#ddd']}
            style={styles.submitButtonView}>
            {loading ? <ActivityIndicator size="small" color="#666"/> : <Ionicons
              name="md-paper-plane"
              size={16}
              color={prompt.trim() ? 'black' : 'silver'}
              style={{transform: [{translateX: -1.5}, {rotate: '45deg'}]}}
            />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 39,
    zIndex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#888',
    borderStyle: 'solid',
    borderBottomWidth: .4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  topView: {
    height: 39,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#888',
    borderStyle: 'solid',
    borderBottomWidth: .4,
  },
  middleView: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  bottomView: {
    height: VIEW_HEIGHT,
    minHeight: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderTopColor: '#888',
    borderStyle: 'solid',
    borderTopWidth: .4,
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#fff',
    paddingLeft: 12,
    fontSize: 16,
    flex: 1,
    height: 30,
    borderStyle: 'solid',
    borderWidth: .4,
    borderColor: '#888',
    borderRadius: 20,
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
