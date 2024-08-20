import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
} else {
  app = getApp()
}

export const auth = getAuth(app)
export const database = getDatabase(app)

export const getCurrentUserIdToken = () => {
  // return new Promise((resolve) => {
  //   firebase.auth().onAuthStateChanged(async (user) => {
  //     if (user) {
  //       console.log(user)
  //       const hasuraClaims = await getHasuraClaims(user)
  //       const token = hasuraClaims ? await user.getIdToken() : null
  //       resolve(token)
  //     }
  //     resolve(null)
  //   })
  // })
  return auth.currentUser?.getIdToken()
}

export const logout = () => {
  auth.signOut().catch((error) => {
    console.error(error)
  })
}

const provider = new GoogleAuthProvider()
// You can add additional scopes to the provider:
provider.addScope('email')
export const login = async () => {
  return await signInWithPopup(auth, provider)
    .then((data) => {
      return { user: data.user, error: false }
    })
    .catch(() => {
      return { user: null, error: true }
    })
}

// export const changePassword = async (email) => {
//   return await auth.sendPasswordResetEmail(email)
//     .then(() => {
//       return { error: false }
//     })
//     .catch(() => {
//       return { error: true }
//     })
// }

// export const isRegisteredUser = async (email) => {
//   return await firebase
//     .auth()
//     .fetchSignInMethodsForEmail(email)
//     .then((result) => {
//       if (result.length === 0) {
//         return false
//       }
//       return true
//     })
//     .catch(() => false)
// }
// export const getHasuraClaims = async (firebaseUser) => {
//   if (!firebaseUser || !firebaseUser.email) return undefined

//   try {
//     const idTokenResult = await firebaseUser.getIdTokenResult()
//     const hasuraClaims = Object.keys(idTokenResult.claims).length
//       ? idTokenResult.claims[HASURA_TOKEN_KEY]
//       : undefined
//     return hasuraClaims
//   } catch (error) {
//     console.log('getHasuraClaims error', error)
//     throw error
//   }
// }
