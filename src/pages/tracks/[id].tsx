import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'

// Interface
import { TypingResult } from 'shared/interfaces'

// Components
import Layout from 'shared/components/Layout'
import TrackList from 'shared/components/TrackList'
import TrackTypingInput from 'pageComponents/tracks/TrackTypingInput'
import TypingReady from 'pageComponents/tracks/TypingReady'

// Data
import {
  INSERT_TYPING_RECORD_ONE,
  GET_RECOMMAND_TRACKS,
  GET_TRACK_WITH_LYRICS,
} from 'shared/apollo/query'
import { GetTrackWithLyrics } from 'shared/apollo/__generated__/GetTrackWithLyrics'
import { GetRecommandTracks } from 'shared/apollo/__generated__/GetRecommandTracks'
import { InsertTypingRecordOne } from 'shared/apollo/__generated__/InsertTypingRecordOne'
import { GET_TYPING_RECORDS } from 'shared/apollo/query'
import { GetTypingRecords } from 'shared/apollo/__generated__/GetTypingRecords'

import { useAuth } from 'shared/auth/context/authUser'

export enum TypingPhase {
  Ready,
  Typing,
  End,
}

const TrackPage = () => {
  const { authState } = useAuth()
  const user = authState.user
  const router = useRouter()

  const trackId: number = Array.isArray(router.query.id)
    ? parseInt(router.query.id[0])
    : parseInt(router.query.id)
  const [typingPhase, setTypingPhase] = useState(TypingPhase.Ready)

  useEffect(() => {
    setTypingPhase(TypingPhase.Ready)
  }, [trackId])

  // const artistRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)
  const {
    data: trackQueryData,
    loading: trackLoading,
    error: trackError,
  } = useQuery<GetTrackWithLyrics>(GET_TRACK_WITH_LYRICS, {
    variables: { id: trackId },
  })

  const track = trackQueryData?.track
  const lyrics = trackQueryData?.track?.lyrics

  const [getRecommand, recommandTracksRes] = useLazyQuery<GetRecommandTracks>(
    GET_RECOMMAND_TRACKS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  const tracksListOri = recommandTracksRes.loading
    ? []
    : recommandTracksRes?.data?.recommandTracks
  const tracksList = tracksListOri?.filter(
    (track) => track.id !== trackId.toString()
  )
  // const album_name: string = trackRes?.data?.message?.body?.track?.album_name || ''

  const { data: typingRecordsQueryData } = useQuery<GetTypingRecords>(
    GET_TYPING_RECORDS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )
  const typingRecords = typingRecordsQueryData?.typing_record ?? []

  const [insertTypingRecord] = useMutation<InsertTypingRecordOne>(
    INSERT_TYPING_RECORD_ONE
  )

  function handleTypingEnded(result: TypingResult) {
    try {
      setTypingPhase(TypingPhase.End)
      insertTypingRecord({
        variables: {
          object: {
            userId: user?.uid,
            trackId: track?.id,
            trackName: track?.name,
            artistId: track?.artistId,
            artistName: track?.artistName,
            albumId: track?.albumId,
            albumName: track?.albumName,
            duration: result.duration,
            correctChar: result.correctChar,
            errorChar: result.errorChar,
            textLength: result.textLength,
          },
        },
      })
    } catch (e) {
      alert(e)
    }
  }

  const handleStartingClick = (): void => {
    if (typingPhase !== TypingPhase.Typing) {
      setTypingPhase(TypingPhase.Typing)
    }
    getRecommand({
      variables: { artistId: track?.artistId, albumId: track?.albumId },
    })
  }

  // if (!data) return <div>loading...</div>
  if (trackError) {
    return (
      <Layout>
        <div className="px-4 container mx-auto flex flex-col ">
          error: {trackError.toString()}
        </div>
      </Layout>
    )
  }

  if (!trackLoading && (!track || !lyrics)) {
    return (
      <Layout>
        <div className="px-4 container mx-auto flex flex-col ">
          Sorry, lyrics not found
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="h-full px-4 container mx-auto flex flex-col ">
        {typingPhase === TypingPhase.Ready && (
          <TypingReady
            track={track}
            handleStartingClick={handleStartingClick}
            loading={trackLoading}
          />
        )}
        {(typingPhase === TypingPhase.Typing ||
          typingPhase === TypingPhase.End) && (
          <TrackTypingInput
            track={track}
            lyrics={lyrics}
            loading={trackLoading}
            onTypingEnded={handleTypingEnded}
            typingPhase={typingPhase}
          />
        )}
        {typingPhase === TypingPhase.End && (
          <>
            <h2 className="text-xl my-2">Same Albums / Artists</h2>
            <TrackList
              trackList={tracksList ?? []}
              loading={recommandTracksRes.loading}
              typingRecords={typingRecords}
            />
          </>
        )}
      </div>
    </Layout>
  )
}

export default TrackPage
