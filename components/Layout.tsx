import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
    <div style={{ backgroundColor: 'black', color: 'white' }}>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="A new way to learn Lyrics and Language with Typing!" />
            <meta name="keywords" content="lyrics language learn typing musix musixmatch spotify"></meta>
        </Head>
        <div className="min-h-screen overflow-hidden">

            <header className="p-4 mb-4 flex justify-between items-center bg-gray-900">
                <div className="flex justify-between">
                    <Link href="/">
                        <a className="text-xl font-bold pr-2">Type Lyrics</a>
                    </Link>
                    {/* <span>@hwchang</span> */}
                </div>
                <nav>


                    <Link href="/about" >
                        <a className="mr-2">About</a>
                    </Link>
                    <Link href="/profile">
                        <a>Profile</a>
                    </Link>
                </nav>

            </header>


            {children}
            <footer >
                {/* <hr /> */}

            </footer>
        </div>
    </div>
)

export default Layout
