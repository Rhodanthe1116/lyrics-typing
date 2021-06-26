import { ApolloError } from '@apollo/client/errors'
import { useTranslation } from 'next-i18next'
import { useState, createContext, useContext } from 'react'

interface ISnackbar {
  open: boolean
  severity: 'error' | 'warning' | 'info' | 'success'
  message: string
  timeout?: number
}

export type Notification = 'updated' | 'created' | 'deleted' | 'submitted'

export const SnackbarContext = createContext<{
  snackbar: ISnackbar
  setSnackbar: (state: ISnackbar) => void
  handleApolloError: (error: ApolloError) => void
  handleUnknownError: (error: unknown) => void
  handleError: (error?: unknown) => void
  handleCommonNotification: (notification: Notification) => void
}>({
  snackbar: {
    open: false,
    severity: 'success',
    message: '',
    timeout: 5000,
  },
  setSnackbar: (state: ISnackbar) => state,
  handleApolloError: (error: ApolloError) => {
    console.error(error)
  },
  handleUnknownError: (error: unknown) => {
    console.error(error)
  },
  handleError: (error?: unknown) => {
    console.error(error)
  },
  handleCommonNotification: (notification: Notification) => {
    console.log(notification)
  },
})

export const useSnackbar = () => useContext(SnackbarContext)

export const SnackbarProvider = (props) => {
  const { t } = useTranslation()
  const [snackbar, setSnackbar] = useState<ISnackbar>({
    open: false,
    severity: 'success',
    message: '',
    timeout: 5000,
  })

  const setter = (state: ISnackbar): void => {
    setSnackbar({
      ...state,
      message:
        state?.severity === 'error' && !state?.message
          ? t(`common:errors.code.fallback`)
          : state.message,
    })
  }
  const handleApolloError = (error: ApolloError) => {
    console.error(error)
    const { graphQLErrors, networkError } = error

    if (graphQLErrors.length !== 0) {
      const code = graphQLErrors[0].extensions?.code
      setSnackbar({
        ...snackbar,
        open: true,
        severity: 'error',
        message:
          t([`common:errors.code.${code}`, 'common:errors.code.fallback']) +
          ': ' +
          t([
            `common:errors.message.${code}`,
            'common:errors.message.fallback',
          ]),
      })
    }

    if (networkError) {
      const code = networkError.message
      setSnackbar({
        ...snackbar,
        open: true,
        severity: 'error',
        message:
          t([`common:errors.code.${code}`, 'common:errors.code.fallback']) +
          ': ' +
          t([
            `common:errors.message.${code}`,
            'common:errors.message.fallback',
          ]),
      })
    }
  }

  const handleUnknownError = (error?: unknown) => {
    console.error(error)
    setSnackbar({
      ...snackbar,
      open: true,
      severity: 'error',
      message: t(`common:errors.code.fallback`),
    })
  }

  const handleError = (error?: unknown) => {
    if (error instanceof ApolloError) {
      handleApolloError(error)
    } else {
      handleUnknownError(error)
    }
  }

  const handleCommonNotification = (notification: Notification) => {
    setSnackbar({
      ...snackbar,
      open: true,
      severity: 'success',
      message: t(`common:notification.${notification}`),
    })
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        setSnackbar: setter,
        handleApolloError: handleApolloError,
        handleUnknownError: handleUnknownError,
        handleError: handleError,
        handleCommonNotification: handleCommonNotification,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  )
}
