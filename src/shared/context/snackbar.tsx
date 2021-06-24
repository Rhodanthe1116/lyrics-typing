import { ApolloError } from '@apollo/client/errors'
import { useTranslation } from 'next-i18next'
import { useState, createContext } from 'react'

interface ISnackbar {
  open: boolean
  severity: 'error' | 'warning' | 'info' | 'success'
  message: string
  timeout?: number
}

export const SnackbarContext = createContext<{
  snackbar: ISnackbar
  setSnackbar: (state: ISnackbar) => void
  handleApolloError: (error: ApolloError) => void
  handleUnknownError: (error: Error) => void
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
  handleUnknownError: (error: Error) => {
    console.error(error)
  },
})

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
    const code = error.graphQLErrors[0].extensions?.code
    setSnackbar({
      ...snackbar,
      open: true,
      severity: 'error',
      message:
        t([`common:errors.code.${code}`, 'common:errors.code.fallback']) +
        ': ' +
        t([`common:errors.message.${code}`, 'common:errors.message.fallback']),
    })
  }

  const handleUnknownError = (error: Error) => {
    console.error(error)
    setSnackbar({
      ...snackbar,
      open: true,
      severity: 'error',
      message: t(`common:errors.code.fallback`),
    })
  }

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        setSnackbar: setter,
        handleApolloError: handleApolloError,
        handleUnknownError: handleUnknownError,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  )
}
