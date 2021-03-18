import 'tailwindcss/tailwind.css'
import { useRouter } from 'next/router'

import Link from 'next/link'
import Layout from '../components/Layout'

import TypingInput from "../components/TypingInput";

import useSWR from 'swr'

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
    .then((res: Response) => res.text())
    .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

const TrackPage = () => {
    const router = useRouter()

    const track_id = router.query.id || 46915001

    const { data, error } = useSWR(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${track_id}&apikey=${apiKey}`, fetcher)
    const lyrics_body: string = data?.message?.body?.lyrics?.lyrics_body || ''

    if (error) return (<div>failed to load {error.toString()}</div>)

    if (!data) return <div>loading...</div>


    return (

        <Layout title="Home | Next.js + TypeScript Example">
            <h1>Hello Next.js 👋</h1>
            {/* <p>{lyrics_body}</p> */}


            <p>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </p>

            <div className="container mx-auto flex flex-col p-4">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold">Type Input Demo</h1>
                    <h6>using React Typing Game Hook</h6>
                </div>
                <h5>Esc to reset</h5>
                <div className="border-2 p-4 rounded-lg">
                    <h1 className="mb-2">Jane Austen, Pride and Prejudice</h1>
                    <TypingInput
                        text={lyrics_body.slice(0, 150)}
                    />
                </div>
            </div>

        </Layout>
    )
}

export default TrackPage
