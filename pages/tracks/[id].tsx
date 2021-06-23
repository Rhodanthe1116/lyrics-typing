import { useRouter } from 'next/router'

// Interface
import { TypingResult, Track } from '../../interfaces';

// Components
// import Link from 'next/link'
import Layout from '../../components/Layout'
import TrackTypingInput from "../../components/TrackTypingInput";
import TypingReady from '../../components/TypingReady';
import TrackList from '../../components/TrackList';


// Data
import dataProvider from "../../utils/dataProvider";
import { useQuery } from "@apollo/client"
import { GET_ALBUM, GET_RECOMMAND_TRACKS, GET_TRACKS_FROM_ALBUM, GET_TRACK_WITH_LYRICS, SEARCH_TRACKS } from '../../apollo/query'
import { GetTrackWithLyrics } from '../../apollo/__generated__/GetTrackWithLyrics'
//import { GetAlbum } from '../../apollo/__generated__/GetAlbum'
//import { GetRecommandTracks } from '../../apollo/__generated__/GetRecommandTracks'
//import { GetTracksFromAlbum } from '../../apollo/__generated__/GetTracksFromAlbum'
import {SearchTracks} from '../../apollo/__generated__/SearchTracks'
import { useState } from 'react';


export enum TypingPhase{
      Ready, Typing, End   
    }

const TrackPage = () => {
    const router = useRouter()

    const trackId: number = Array.isArray(router.query.id) ? parseInt(router.query.id[0]) : parseInt(router.query.id)
    const [typingPhase, setTypingPhase]=useState(TypingPhase.Ready)
    
    // const artistRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
    const trackRes = useQuery<GetTrackWithLyrics>(GET_TRACK_WITH_LYRICS, {
        variables: { id: trackId }
    });

    const track = trackRes.data?.track
    const lyrics = trackRes.data?.track?.lyrics

    //const albumRes = useQuery<GetAlbum>(GET_ALBUM,{
    //    variables: { id: track?.albumId }
    //})
    console.log([Number(track?.artistId),Number(track?.albumId)])
    //const recommandTracksRes = useQuery<GetRecommandTracks>(GET_RECOMMAND_TRACKS,{
    //    variables: { artistId: Number(track?.artistId), albumId: Number(track?.albumId)}
    //})
    //const sameAlbumRes = useQuery<GetTracksFromAlbum>(GET_TRACKS_FROM_ALBUM,{
    //    variables: { id: Number(track?.albumId) }
    //})

    const sameArtistRes = useQuery<SearchTracks>(SEARCH_TRACKS,{
        variables: { artistId: Number(track?.artistId) }
    })
    //const album = albumRes.data?.album
    const tracksList = sameArtistRes?.data?.tracks
    // const album_name: string = trackRes?.data?.message?.body?.track?.album_name || ''

    function handleTypingEnded(result: TypingResult) {

        try {
            setTypingPhase(TypingPhase.End)
            dataProvider.saveTrackTypingRecord(trackId, result)
        } catch (e) {
            alert(e)
        }
    }

    const handleStartingClick = (): void => {
        if (typingPhase !== TypingPhase.Typing) {
          setTypingPhase(TypingPhase.Typing)
        }
      }


    // if (!data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">

            <div className="px-4 container mx-auto flex flex-col ">

                {!trackRes.error && track && lyrics ?
                    typingPhase===TypingPhase.Ready?
                    <TypingReady track={track} handleStartingClick={handleStartingClick}/>:
                    <TrackTypingInput track={track} lyrics={lyrics} loading={trackRes.loading} onTypingEnded={handleTypingEnded} typingPhase={typingPhase} />
                    :

                    <div>no data or Error: {trackRes.error?.toString()}</div>
                }{
                    typingPhase===TypingPhase.End?
                    <>
                        <h2 className="text-xl">Same Albums / Artists</h2>
                        <TrackList trackList={tracksList??[]} loading={sameArtistRes.loading} completedIds={[]}/>
                    </>
                    :null
                }

            </div>

        </Layout>
    )
}

export default TrackPage