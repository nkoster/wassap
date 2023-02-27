import { AuthProvider } from './src/context/useAuthContext'
import Main from './src/Main'

export default function App() {

  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  )
}
