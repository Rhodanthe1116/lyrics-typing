import React from 'react';
import { gql, useMutation } from '@apollo/client';

// import { LoginForm, Loading } from '../components';
// import * as LoginTypes from './__generated__/login';
import { isLoggedInVar } from '../apollo/cache';

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`;

export default function Login() {
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        if (login) {
          localStorage.setItem('token', login.token as string);
          localStorage.setItem('userId', login.id as string);
          isLoggedInVar(true);

        }
      }
    }
  );

  if (loading) return <p>loading</p>;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}

interface LoginFormProps {
  login: (a: { variables: any }) => void;
}


function LoginForm({ login }: LoginFormProps) {
  return <div>
    login form
    <button onClick={() => login({ variables: { email: 'this.state.email' } })}>Login</button>
  </div>
}