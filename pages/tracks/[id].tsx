import { useRouter } from 'next/router'

// Interface
import { TypingResult, Track } from '../../interfaces';

// Components
// import Link from 'next/link'
import Layout from '../../components/Layout'
import TrackTypingInput from "../../components/TrackTypingInput";


// Data
import dataProvider from "../../utils/dataProvider";
import { useQuery } from "@apollo/client"
import { GET_ALBUM, GET_TRACKS_FROM_ALBUM, GET_TRACK_WITH_LYRICS, SEARCH_TRACKS } from '../../apollo/query'
import { GetTrackWithLyrics } from '../../apollo/__generated__/GetTrackWithLyrics'
import { GetAlbum } from '../../apollo/__generated__/GetAlbum'
import { SearchTracks } from '../../apollo/__generated__/SearchTracks'
import { GetTracksFromAlbum } from '../../apollo/__generated__/GetTracksFromAlbum'



const TrackPage = () => {
    const router = useRouter()

    const trackId: number = Array.isArray(router.query.id) ? parseInt(router.query.id[0]) : parseInt(router.query.id)

    // const artistRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
    const trackRes = useQuery<GetTrackWithLyrics>(GET_TRACK_WITH_LYRICS, {
        variables: { id: trackId }
    });

    const track = trackRes.data?.track
    const lyrics = trackRes.data?.track?.lyrics

    const albumRes = useQuery<GetAlbum>(GET_ALBUM,{
        variables: { id: track?.albumId }
    })
    const sameArtistRes = useQuery<SearchTracks>(SEARCH_TRACKS,{
        variables: { artistId: track?.artistId }
    })
    const sameAlbumRes = useQuery<GetTracksFromAlbum>(GET_TRACKS_FROM_ALBUM,{
        variables: { id: track?.albumId }
    })
    const album = albumRes.data?.album
    const trackList=[]
    trackList.concat(sameAlbumRes.data?.tracksByAlbum)
    trackList.concat(sameArtistRes.data?.tracks)
    // const album_name: string = trackRes?.data?.message?.body?.track?.album_name || ''

    function handleTypingEnded(result: TypingResult) {

        try {

            dataProvider.saveTrackTypingRecord(trackId, result)
        } catch (e) {
            alert(e)
        }
    }


    // if (!data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">

            <div className="px-4 container mx-auto flex flex-col ">

                {!trackRes.error && track && lyrics ?
                    <TrackTypingInput track={track} lyrics={lyrics} loading={trackRes.loading} onTypingEnded={handleTypingEnded} />
                    :

                    <div>no data or Error: {trackRes.error?.toString()}</div>
                }

            </div>

        </Layout>
    )
}

export default TrackPage