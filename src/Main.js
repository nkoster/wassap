import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { AuthContext } from './context/useAuthContext'
import LoginScreen from './screens/Login'
import HomeScreen from './screens/Home'
import { useContext } from 'react'

const Stack = createStackNavigator()

export default function Main() {

  const { accessToken } = useContext(AuthContext)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        {accessToken ? null : <Stack.Screen name='Login' component={LoginScreen} options={{ title: 'MindBox AI' }} />}
        {accessToken ? <Stack.Screen name='Home' component={HomeScreen} options={{ title: 'MindBox AI' }} /> : null}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
