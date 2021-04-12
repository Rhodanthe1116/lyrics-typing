import 'tailwindcss/tailwind.css'
import { useRouter } from 'next/router'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import dataProvider from "../utils/dataProvider";

// import Link from 'next/link'
import Layout from '../components/Layout'

import TypingInput from "../components/TypingInput";

import useSWR from 'swr'
import { TypingResult } from '../interfaces';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
    .then((res: Response) => res.text())
    .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const apiKey = process?.env?.NEXT_PUBLIC_MUSIXMATCH_APIKEY || ''

interface FullScreenButtonProps {
    onClick: () => void;
}

function FullScreenButton({ onClick }: FullScreenButtonProps) {
    return (
        <button className="w-8" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
        </button>
    )
}

const TrackPage = () => {
    const router = useRouter()
    const handle = useFullScreenHandle();

    const trackId: number = Array.isArray(router.query.id) ? parseInt(router.query.id[0]) : parseInt(router.query.id)

    // const artistRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
    const trackRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
    const lyricsRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
    const trackName: string = trackRes?.data?.message?.body?.track?.track_name || ''
    const artistName: string = trackRes?.data?.message?.body?.track?.artist_name || ''
    const lyricsBody: string = lyricsRes?.data?.message?.body?.lyrics?.lyrics_body || ''
    const lyricsCopyright: string = lyricsRes?.data?.message?.body?.lyrics?.lyrics_copyright || ''
    // const album_name: string = trackRes?.data?.message?.body?.track?.album_name || ''

    function handleTypingEnded(result: TypingResult) {

        try {

            dataProvider.saveTrackTypingRecord(trackId, result)
        } catch (e) {
            alert(e)
        }
    }


    if (lyricsRes.error) return (<div>failed to load {lyricsRes.error.toString()}</div>)

    // if (!data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">
            {/* <h1>Lyrics Typing👋</h1> */}
            {/* <pre>{JSON.stringify(trackRes.data, null, 2)}</pre>
            <pre>{JSON.stringify(lyricsRes.data, null, 2)}</pre> */}

            <div className="px-4 container mx-auto flex flex-col ">


                {/* <div className="mb-4">
                        <h1 className="text-3xl font-bold">Type Input Demo</h1>
                        
                    </div> */}
                {/* <h5 className="mb-2 text-gray-500">Esc to reset</h5> */}
                <FullScreen className={`${handle.active && "p-6"}`} handle={handle}>
                    {lyricsRes?.data ?
                        <>
                            <div className="flex justify-between">
                                <h1 className="text-lg font-semibold">{trackName}</h1>
                                <FullScreenButton onClick={handle.active ? handle.exit : handle.enter} />
                            </div>

                            <p className="mb-2 text-gray-400">{artistName}</p>


                            <TypingInput
                                text={lyricsBody.slice(0, lyricsBody.length - 73).slice(0, 150)}
                                onTypingEnded={handleTypingEnded}
                            />

                            <img className="hidden" src="https://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuXW" />
                        </>
                        :
                        <div>loading...</div>

                    }
                </FullScreen>
                <p className="text-sm text-gray-500">{lyricsCopyright}</p>
            </div>


        </Layout>
    )
}

export default TrackPage
