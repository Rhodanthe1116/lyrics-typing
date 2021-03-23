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

        </Head>
        <div className="min-h-screen">

            <header className="p-4">
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>{' '}
                            |{' '}
                    <Link href="/about">
                        <a>About</a>
                    </Link>{' '}
                </nav>

                <div className="flex justify-between">
                    <h1 className="mt-2 text-6xl font-bold">Lyrics Typing</h1>
                    {/* <span>@hwchang</span> */}
                </div>


            </header>
            {children}
            <footer >
                {/* <hr /> */}

            </footer>
        </div>
    </div>
)

export default Layout
