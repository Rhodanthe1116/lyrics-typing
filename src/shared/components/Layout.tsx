import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from 'shared/auth/context/authUser'
import { colorImageUrl } from 'shared/utils/placeholder'
import { useSnackbar } from 'shared/context/snackbar'
import Snackbar from 'shared/components/Snackbar'
import { HomeIcon, InfoIcon } from './Icons'

type Props = {
  children?: ReactNode
  title?: string
  displayHeader?: boolean
}

const Layout = ({
  children,
  displayHeader = false,
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

      <div className="overflow-hidden bg-trueGray-900 text-white">
        {displayHeader && (
          <header className="p-4 flex justify-between items-center bg-gray-900">
            <div className="flex justify-start content-end">
              <Link href="/">
                <a className="text-xl font-bold pr-2 flex items-end">
                  kanatype
                </a>
              </Link>
              {/* <Link href="/about">
                <a className="mx-2 font-bold flex items-end">About</a>
              </Link> */}
            </div>
            <nav className="flex justify-end content-center">
              {/* <Link href="/profile">
                <a>
                  <img
                    className="w-7 h-7 rounded-full"
                    src={authState.user?.photoURL ?? colorImageUrl}
                    alt="avatar"
                    width="28"
                    height="28"
                  ></img>
                </a>
              </Link> */}
            </nav>
          </header>
        )}

        <div className="pt-4 pb-16">{children}</div>

        <footer className="fixed inset-x-0 bottom-0 z-1 shadow px-4 py-2 flex justify-evenly items-center bg-gray-900">
          <Link href="/">
            <a className="flex-1 flex flex-col items-center">
              <HomeIcon />
              <p className="text-xs text-gray-500 pt-1">Home</p>
            </a>
          </Link>
          <Link href="/about">
            <a className="flex-1 flex flex-col items-center">
              <InfoIcon />
              <p className="text-xs text-gray-500 pt-1">About</p>
            </a>
          </Link>
          <Link href="/profile">
            <a className="flex-1 flex flex-col items-center">
              <img
                className="w-6 h-6 rounded-full"
                src={authState.user?.photoURL ?? colorImageUrl}
                alt="avatar"
                width="24"
                height="24"
              ></img>
              <p className="text-xs text-gray-500 pt-1">Profile</p>
            </a>
          </Link>
        </footer>
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
