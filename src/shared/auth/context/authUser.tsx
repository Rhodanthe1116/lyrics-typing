import { createContext, useContext, useEffect, useState } from 'react'
// import { withAuthUser, AuthAction } from 'next-firebase-auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { getHasuraClaims } from 'shared/auth/utils/firebase'
import { logout } from 'shared/auth/utils/firebase'
import getRandomAnimal from '../utils/getRandomAnimal'

export interface AuthContextProps {
  authState: AuthState
  logout: () => void
}

export interface AuthState {
  status: 'in' | 'out' | 'loading'
  user: firebase.User | undefined
  token: string | undefined
}

export const AuthContext = createContext<AuthContextProps>({
  authState: {
    status: 'loading',
    user: undefined,
    token: undefined,
  },
  logout: logout,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = (props) => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    user: undefined,
    token: undefined,
  })

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            // Signed in..
          })
          .catch((error) => {
            console.error(error.code)
            console.error(error.message)
          })

        setAuthState({
          status: 'out',
          user: undefined,
          token: undefined,
        })
        return
      }

      // Anonymous user
      if (user.isAnonymous && !user.displayName) {
        // const randomPhotoUrl = 'https://picsum.photos/500/500'
        const colorImageUrl = 'https://singlecolorimage.com/get/f178b6/64x64'

        user
          .updateProfile({
            displayName: getRandomAnimal(),
            photoURL: colorImageUrl,
          })
          .then(() => {
            // Update successful
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          })
      }

      const token = await user.getIdToken()
      const hasuraClaims = await getHasuraClaims(user)
      if (hasuraClaims) {
        setAuthState({ status: 'in', user, token })
      } else {
        // Check if refresh is required.
        const metadataRef = firebase
          .database()
          .ref('metadata/' + user.uid + '/refreshTime')

        metadataRef.on('value', async (data) => {
          if (!data.exists) return
          // Force refresh to pick up the latest custom claims changes.
          const token = await user.getIdToken(true)
          setAuthState({ status: 'in', user, token })
        })
      }
    })
  }, [])

  if (authState.status === 'loading') {
    return <MyLoader />
  }

  return (
    <AuthContext.Provider value={{ authState, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

const MyLoader = () => <div>Loading...</div>

export default AuthProvider
