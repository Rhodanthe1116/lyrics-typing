import { VFC, useEffect } from 'react'
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from 'shared/auth/utils/firebase'

const Component: VFC = () => {
  return (
    <div>
      <div id="firebaseui-auth-container"></div>
    </div>
  )
}

const Container: VFC = () => {
  useEffect(() => {
    const uiConfig = {
      autoUpgradeAnonymousUsers: true,
      signInSuccessUrl: '/',
      signInFlow: 'popup',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: function (error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve()
          }
          // The credential the user tried to sign in with.
          const cred = error.credential
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          signInWithCredential(auth, cred)
        },
      },
    }
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
    ui.start('#firebaseui-auth-container', uiConfig)
  })

  return <Component />
}

export default Container
