// import Link from 'next/link'
import Layout from '../components/Layout'
import 'tailwindcss/tailwind.css'

const AboutPage = () => (
    <Layout title="Lyrics Typing">

        <div className="p-4">

            <p className="mb-2">This is a typing game where you can learn lyrics and language!</p>
            <p className="mb-2">It's mobile-first so you can learn everywhere, everytime.</p>
            <p>Created by hwchang. <a href="https://github.com/Rhodanthe1116/lyrics-typing" className="text-green-200">View on GitHub</a></p>
        </div>
    </Layout>
)

export default AboutPage
