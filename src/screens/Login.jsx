import React, { useContext, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/useAuthContext'
import { Ionicons } from '@expo/vector-icons'

const LoginScreen = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { accessToken, login } = useContext(AuthContext)
  const navigation = useNavigation()

  const handleLogin = async () => {
    await login(username, password)
    if (accessToken) {
      setError('')
      navigation.navigate('Home')
    } else {
      setUsername('')
      setPassword('')
      setTimeout(() => setError('Username or password is incorrect'), 500)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      onStartShouldSetResponder={() => true}
    >
      <View style={styles.container}>
        <Ionicons name='walk-outline' size={128} color='silver' style={styles.topIcon} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.button}>
          <Button
            title='sign in'
            onPress={handleLogin}
            disabled={!username || !password}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fafafa',
    width: '100%',
    padding: 20
  },
  topIcon: {
    marginBottom: 20,
    marginTop: 20
  },
  error: {
    color: 'red',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    fontSize: 18,
    marginTop: 10,
    width: '100%'
  },
  button: {
    marginTop: 30
  }
})

export default LoginScreen
