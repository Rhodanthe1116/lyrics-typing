import { createContext, useContext, useEffect, useState } from 'react'
// import { withAuthUser, AuthAction } from 'next-firebase-auth'
import 'firebase/auth'
import 'firebase/database'
import { auth, database } from 'shared/auth/utils/firebase'
import { logout } from 'shared/auth/utils/firebase'
import { signInAnonymously, User } from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'

export interface AuthContextProps {
  authState: AuthState
  logout: () => void
}

export interface AuthState {
  status: 'in' | 'out' | 'loading'
  user: User | undefined
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
    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        signInAnonymously(auth)
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

      const token = await user.getIdToken()
      // const hasuraClaims = await getHasuraClaims(user)
      const hasuraClaims = undefined
      if (hasuraClaims) {
        setAuthState({ status: 'in', user, token })
      } else {
        // Check if refresh is required.
        const metadataRef = ref(
          database,
          'metadata/' + user.uid + '/refreshTime'
        )

        onValue(metadataRef, async (data) => {
          if (!data.exists) return
          // Force refresh to pick up the latest custom claims changes.
          const token = await user.getIdToken(true)
          setAuthState({ status: 'in', user, token })
        })
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={{ authState, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
