// import Link from 'next/link'
import Layout from 'shared/components/Layout'

const AboutPage = () => (
  <Layout>
    <div className="p-4">
      <p className="mb-2">
        This is a typing game where you can learn lyrics and language!
      </p>
      <p className="mb-2">
        It's mobile-first so you can learn anywhere, anytime.
      </p>

      <p>
        Powered by{' '}
        <a
          href="https://www.musixmatch.com"
          className="text-pink-400"
          target="_blank"
          rel="noreferrer"
        >
          Musixmatch
        </a>
        .
      </p>
      <p>
        Created by{' '}
        <a href="https://github.com/Rhodanthe1116" className="text-green-200">
          hwchang
        </a>
        .
      </p>
      <p>
        View on{' '}
        <a
          href="https://github.com/Rhodanthe1116/lyrics-typing"
          className="text-green-200"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  </Layout>
)

export default AboutPage
