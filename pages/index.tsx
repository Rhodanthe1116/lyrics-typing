import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'

import Link from 'next/link'
import Layout from '../components/Layout'

import useSWR from 'swr'
import useUser from '../hooks/useUser'
const PAGE_SIZE = 10
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

interface TrackItemProps {
    className?: string;
    track?: Track;
    loading: boolean;
    completed: boolean;
}

const TrackItem = ({ track, loading, completed }: TrackItemProps) => {

    const trackInfo = track?.track

    if (loading) {
        return (

            <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
                <div className="flex-1 truncate mr-2">
                    <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4">　</div>
                    <div className="h-4 my-1 bg-gray-900 rounded w-1/4">　</div>

                </div>
            </div>
        )
    }


    return (
        <Link href={`/track?id=${trackInfo?.track_id}`}>

            <div className={`border-0 border-green-200 p-4 hover:bg-yellow-900 ${completed ? 'bg-green-900' : 'bg-gray-900' } flex justify-between`}>
                <div className="flex-1 truncate mr-2">
                    <p className="truncate">{trackInfo?.track_name}</p>
                    <p className="truncate text-gray-400">{trackInfo?.artist_name}</p>
                </div>
                <div className="flex-none w-12 overflow-hidden">
                    <p className="truncate">⭐{trackInfo?.track_rating}</p>
                    <p className="truncate">❤{trackInfo?.num_favourite}</p>
                </div>
            </div>
        </Link>
    )
}

interface TrackListPorps {
    trackList: Array<Track>;
    loading: boolean;
    completedIds: number[];
}
const TrackList = ({ trackList, loading, completedIds }: TrackListPorps) => {

    if (loading) {
        return (
            <div>
                {[1, 2, 3, 4].map((v) =>
                    <div key={v} className="mb-2">
                        <TrackItem  loading={true} completed={false}/>
                    </div>
                )
                }

            </div>
        )
    }

    // no result
    if (trackList.length === 0) {
        return (
            <div>not found...</div>
        )
    }

    return (
        <div>
            {trackList.map((track: Track, index) => (
                <div  key={index} className="mb-2">
                    <TrackItem track={track} loading={false} completed={completedIds?.includes(track?.track?.track_id)}/>
                </div>
            ))}
        </div>

    )

}
const IndexPage = () => {
    const router = useRouter()

    const [user] = useUser()

    const artist = '%E9%B9%BF%E4%B9%83'

    const [queryInput, setQueryInput] = useState(router.query.q?.toString() || '')
    const query: string = router.query.q?.toString() || ''
    const [country, setCountry] = useState('JP')


    const chartTracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?format=jsonp&callback=callback&page_size=${PAGE_SIZE}&country=${country}&f_has_lyrics=true&apikey=${apiKey}`, fetcher)
    const tracksRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&page_size=${PAGE_SIZE}&q_track_artist=${query}&f_has_lyrics=true&s_track_rating=desc&apikey=${apiKey}`, fetcher)
    const { data, error } = useSWR(`https://api.musixmatch.com/ws/1.1/artist.search?format=jsonp&callback=callback&q_artist=${artist}&apikey=${apiKey}`, fetcher)
    // @ts-ignore  
    const artist_list: Array<Track> = data?.message?.body?.artist_list
    const trackList: Array<Track> = queryInput ? tracksRes?.data?.message?.body?.track_list : chartTracksRes?.data?.message?.body?.track_list

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

        <Layout title="Lyrics Typing - Learn Lyrics and Language with Typing!">
            {/* <pre>{JSON.stringify(chartTracksRes.data, null, 2)}</pre> */}

            {/* <div>hello {artist_list[0].artist.artist_name}!</div> */}
            {/* {artist_list.map((artist) => (
                <div>
                    <p>{artist.artist.artist_name}</p>
                    <p>{artist.artist.artist_id}</p>
                </div>
            ))} */}

            <div className="m-2">

                <div className="mt-16 mb-12 flex flex-col items-center">


                    <h1 className="text-3xl text-center mb-8">
                        Learn <span className="text-green-200">Lyrics</span> and <span className="text-green-200">Language</span> with <span className="text-green-200">Typing</span>!
                    </h1>

                    <input
                        className="mb-2 p-1 w-80 text-lg bg-black border-2 border-green-200 focus:outline-none "
                        value={queryInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryInput(e.target.value)}
                        placeholder="Search song or artist here."
                    />

                    {!queryInput &&
                        <div>
                            <p className="inline mr-1">or look for what's popular in your country</p>
                            <select className="mb-2 bg-black border-2 border-green-200" value={country} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}>
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

                </div>

                <TrackList trackList={trackList} loading={!trackList} completedIds={user?.completedTrackIds || []}/>

                {/* {true && <pre>{JSON.stringify(tracksRes.data, null, 2)}</pre>} */}
                {/* {true && <pre>{JSON.stringify(tracksRes.data, null, 2)}</pre>} */}

            </div>

        </Layout>
    )
}

export default IndexPage
