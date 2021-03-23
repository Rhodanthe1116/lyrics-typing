import { useState, useEffect } from 'react'
import 'tailwindcss/tailwind.css'

import Link from 'next/link'
import Layout from '../components/Layout'

import useSWR from 'swr'

interface Track {
    track: {
        track_id: number,
        track_name: string,
        artist_name: string,
        track_rating: number,
        num_favourite: number
    }
}

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
    .then((res: Response) => res.text())
    .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

const IndexPage = () => {

    const artist = '%E9%B9%BF%E4%B9%83'

    const [trackSearched, setTrackSearched] = useState('')
    const [query, setQuery] = useState('')

    const tracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=${trackSearched}&f_has_lyrics=true&s_track_rating=desc&apikey=${apiKey}`, fetcher, { refreshInterval: 1000 })
    const { data, error } = useSWR(`https://api.musixmatch.com/ws/1.1/artist.search?format=jsonp&callback=callback&q_artist=${artist}&apikey=${apiKey}`, fetcher)
    // @ts-ignore  
    const artist_list: Array<Track> = data?.message?.body?.artist_list
    const track_list: Array<Track> = tracksRes?.data?.message?.body?.track_list

    useEffect(() => {
        const timeOutId = setTimeout(() => setTrackSearched(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    if (error || tracksRes.error) return (<div>failed to load {error.toString()}</div>)

    // if (!data || !tracksRes.data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">
            <h1>Search songs here 👋</h1>
            {/* <pre>{JSON.stringify(tracksRes.data, null, 2)}</pre> */}

            {/* <div>hello {artist_list[0].artist.artist_name}!</div> */}
            {/* {artist_list.map((artist) => (
                <div>
                    <p>{artist.artist.artist_name}</p>
                    <p>{artist.artist.artist_id}</p>
                </div>
            ))} */}
            <input className="mb-2 bg-black border-2 border-purple-500 " onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}></input>

            {track_list && track_list.map((track: Track) => (
                <Link href={`/track?id=${track?.track?.track_id}`}>

                    <div className="border-2 border-purple-500 p-4 hover:bg-red-700 flex justify-between">
                        <div>
                            <p>{track?.track?.track_name}</p>
                            <p className="text-gray-500">{track?.track?.artist_name}</p>
                        </div>
                        <div>
                            <p>
                                ⭐{track?.track?.track_rating}
                            </p>
                            <p>❤{track?.track?.num_favourite}</p>
                        </div>
                    </div>
                </Link>
            ))}
            {track_list === [] &&  <pre>{JSON.stringify(tracksRes.data, null, 2)}</pre> }


        </Layout>
    )
}

export default IndexPage
