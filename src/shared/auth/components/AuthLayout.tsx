import React, { FC, useContext, useEffect, useState } from 'react'
// import Snackbar from './Snackbar'
import dynamic from 'next/dynamic'
import { logout } from 'shared/auth/utils/firebase'
import { useAuth } from 'shared/auth/context/authUser'

const LoginLayout = dynamic({
  loader: () => import('shared/auth/components/LoginLayout'),
  ssr: false,
})

interface Props {
  children: React.ReactNode
  pageTitle?: string
  requiredLogin?: boolean
}

const AuthLayoutComponent: FC<Props> = ({
  children,
  pageTitle,
  requiredLogin,
}) => {
  // const { snackbar, setSnackbar } = useContext(SnackbarContext)
  // const { topProgressBar } = useTopProgressBar()
  // const onClose = () => setSnackbar({ ...snackbar, open: false })
  // const authRenter = useAuthUser()
  // const { isRenter, isAdminUser } = useAuthType()
  // const [renterLogin, setRenterLogin] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const { authState } = useAuth()

  // useEffect(() => {
  //   setRenterLogin(isRenter)
  //   if (authRenter.email && renterLogin && !isRenter) {
  //     setLoginError(true)
  //     logout()
  //   }
  // }, [isRenter, renterLogin, isAdminUser])

  return (
    <div>
      {/* {topProgressBar.loading && (
        <LinearProgress className={classes.progressBar} />
      )} */}

      {requiredLogin && authState.status !== 'in' && (
        <LoginLayout error={loginError} />
      )}
      <main>{children}</main>
      {/* <Snackbar
        open={snackbar.open}
        severity={snackbar.severity}
        onClose={onClose}
        timeout={snackbar?.timeout || 5000}
      >
        {snackbar.message}
      </Snackbar> */}
    </div>
  )
}

export default AuthLayoutComponent
