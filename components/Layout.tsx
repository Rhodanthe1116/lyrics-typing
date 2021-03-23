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

            <div>
                <h1 className="mt-2 text-3xl font-bold">Lyrics Typing</h1>

            </div>

        </header>
        <div className="p-4">
            {children}
        </div>
        <footer >
            <hr />
            <div className="p-4">
                <span>Created by hwchang</span>
            </div>
        </footer>
    </div>
)

export default Layout
