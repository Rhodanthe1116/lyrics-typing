import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
    const router = useRouter()

    const artist = '%E9%B9%BF%E4%B9%83'

    const [queryInput, setQueryInput] = useState(router.query.q?.toString() || '')
    const query: string = router.query.q?.toString() || ''
    const [country, setCountry] = useState('JP')


    const chartTracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?format=jsonp&callback=callback&country=${country}&f_has_lyrics=true&apikey=${apiKey}`, fetcher)
    const tracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track_artist=${query}&f_has_lyrics=true&s_track_rating=desc&apikey=${apiKey}`, fetcher)
    const { data, error } = useSWR(`https://api.musixmatch.com/ws/1.1/artist.search?format=jsonp&callback=callback&q_artist=${artist}&apikey=${apiKey}`, fetcher)
    // @ts-ignore  
    const artist_list: Array<Track> = data?.message?.body?.artist_list
    const track_list: Array<Track> = queryInput ? tracksRes?.data?.message?.body?.track_list : chartTracksRes?.data?.message?.body?.track_list

    function handleQueryChange(queryInput: string) {
        // setQuery(queryInput)
        if (queryInput) {
            router.push({
                pathname: '',
                query: { q: queryInput },
            })
        }
    }
    useEffect(() => {
        setQueryInput(query)
    }, [query])

    useEffect(() => {
        const timeOutId = setTimeout(() => handleQueryChange(queryInput), 500);
        return () => clearTimeout(timeOutId);
    }, [queryInput]);

    if (error || tracksRes.error) return (<div>failed to load {error.toString()}</div>)

    // if (!data || !tracksRes.data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">
            {/* <pre>{JSON.stringify(chartTracksRes.data, null, 2)}</pre> */}

            {/* <div>hello {artist_list[0].artist.artist_name}!</div> */}
            {/* {artist_list.map((artist) => (
                <div>
                    <p>{artist.artist.artist_name}</p>
                    <p>{artist.artist.artist_id}</p>
                </div>
            ))} */}

            <h1>Search songs here 👋</h1>
            <input className="mb-2 bg-black border-2 border-purple-500 " value={queryInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryInput(e.target.value)}></input>

            {!queryInput &&
                <div>
                    <p>or look for what's popular in your country</p>
                    <select className="mb-2 bg-black border-2 border-purple-500" value={country} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}>
                        <option className="py-1" value="JP">JP</option>
                        <option className="py-1" value="TW">TW</option>
                        <option className="py-1" value="US">US</option>
                    </select>
                    {/* <input className="mb-2 bg-black border-2 border-purple-500" type="text" list="country_code_list" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}/>
                    <datalist id="country_code_list">
                        <option className="py-1" value="JP">JP</option>
                        <option className="py-1" value="TW">TW</option>
                        <option className="py-1" value="US">US</option>
                    </datalist> */}
                </div>
            }
            {track_list && track_list.map((track: Track) => (
                <Link key={track?.track?.track_id} href={`/track?id=${track?.track?.track_id}`}>

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
            {track_list === [] && <pre>{JSON.stringify(tracksRes.data, null, 2)}</pre>}


        </Layout>
    )
}

export default IndexPage
