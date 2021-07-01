import Document, { Html, Head, Main, NextScript } from 'next/document'

const GA_TRACKING_ID = 'G-7D7X1QFDHX'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <meta
            name="description"
            content="A new way to learn Lyrics and Language with Typing!"
          />
          <meta
            name="keywords"
            content="lyrics language learn typing musix musixmatch spotify"
          ></meta>
          <link rel="manifest" href="/manifest.json" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_TRACKING_ID}', {
                                page_path: window.location.pathname,
                                });
                            `,
            }}
          />
        </Head>
        <body className="bg-trueGray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
