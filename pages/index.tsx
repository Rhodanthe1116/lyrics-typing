import { useState } from 'react'
import 'tailwindcss/tailwind.css'

import Link from 'next/link'
import Layout from '../components/Layout'

import useSWR from 'swr'

interface Track {
    track: {
        track_id: number,
        track_name: string,
        artist_name: string
    }
}

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
    .then((res: Response) => res.text())
    .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

const IndexPage = () => {

    const artist = '%E9%B9%BF%E4%B9%83'

    const [track, setTrack] = useState('')

    const tracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=${track}&f_has_lyrics=true&s_track_rating=desc&apikey=${apiKey}`, fetcher, { refreshInterval: 1000 })
    const { data, error } = useSWR(`https://api.musixmatch.com/ws/1.1/artist.search?format=jsonp&callback=callback&q_artist=${artist}&apikey=${apiKey}`, fetcher)
    // @ts-ignore  
    const artist_list: Array<Track> = data?.message?.body?.artist_list
    const track_list: Array<Track> = tracksRes?.data?.message?.body?.track_list

    if (error || tracksRes.error) return (<div>failed to load {error.toString()}</div>)

    // if (!data || !tracksRes.data) return <div>loading...</div>


    return (

        <Layout title="Home | Next.js + TypeScript Example">
            <h1>Hello Next.js 👋</h1>
            {/* <div>hello {artist_list[0].artist.artist_name}!</div> */}
            {/* {artist_list.map((artist) => (
                <div>
                    <p>{artist.artist.artist_name}</p>
                    <p>{artist.artist.artist_id}</p>
                </div>
            ))} */}
            <input className="bg-black" onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setTrack(e.target.value)}></input>
            {track_list && track_list.map((track: Track) => (
                <Link href={`/track?id=${track?.track?.track_id}`}>
                    <div className="p-4">
                        <button className="hover:bg-red-700">
                            <p>{track?.track?.track_name}</p>
                            <p>{track?.track?.artist_name}</p>
                        </button>
                    </div>
                </Link>
            ))}
            <p>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </p>
        </Layout>
    )
}

export default IndexPage
