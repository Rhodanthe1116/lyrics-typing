import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from 'shared/auth/context/authUser'
import { colorImageUrl } from 'shared/utils/placeholder'
import { useSnackbar } from 'shared/context/snackbar'
import Snackbar from 'shared/components/Snackbar'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({
  children,
  title = 'kanatype - a new way to learn language',
}: Props) => {
  const { authState } = useAuth()
  const { snackbar, setSnackbar } = useSnackbar()
  const onClose = () => setSnackbar({ ...snackbar, open: false })

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#171717" />
      </Head>

      <div className="min-h-screen overflow-hidden bg-trueGray-900 text-white">
        <header className="px-4 py-2 mb-4 flex justify-between items-center bg-gray-900">
          <div className="flex justify-start content-end">
            <Link href="/">
              <a className="text-xl font-bold pr-2 flex items-end">kanatype</a>
            </Link>
            <Link href="/about">
              <a className="mx-2 font-bold flex items-end">About</a>
            </Link>
          </div>
          <nav className="flex justify-end content-center">
            <Link href="/profile">
              <a>
                <img
                  className="w-7 h-7 rounded-full"
                  src={authState.user?.photoURL ?? colorImageUrl}
                  alt="avatar"
                  width="28"
                  height="28"
                ></img>
              </a>
            </Link>
          </nav>
        </header>

        <div className="">{children}</div>

        <footer>{/* <hr /> */}</footer>
      </div>

      <Snackbar
        open={snackbar.open}
        severity={snackbar.severity}
        onClose={onClose}
        timeout={snackbar?.timeout || 5000}
      >
        {snackbar.message}
      </Snackbar>
    </>
  )
}

export default Layout
