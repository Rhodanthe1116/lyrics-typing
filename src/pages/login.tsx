import { VFC } from 'react'
import dynamic from 'next/dynamic'

const LoginForm = dynamic({
  loader: () => import('shared/auth/components/LoginForm'),
  ssr: false,
})

const LoginPage: VFC = () => {
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default LoginPage
