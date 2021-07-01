import React, { useRef, useEffect } from 'react'
// Interface
import { /*Album,*/ Lyrics, TypingResult } from 'shared/interfaces'
import { TypingPhase } from 'pages/tracks/[id]'

// Components
// import Link from 'next/link'
import TypingInput from './TypingInput'

// Data
import { GetTrackWithLyrics_track } from 'shared/apollo/__generated__/GetTrackWithLyrics'
import { useAlbumCover } from 'shared/hooks/useAlbumInfo'

interface TrackTypingInputProps {
  track?: GetTrackWithLyrics_track | null
  lyrics?: Lyrics | null
  loading: boolean
  //album?: Album
  typingPhase: TypingPhase
  onTypingEnded?: (result: TypingResult) => void
}

export enum Status {
  Stopped,
  Running,
}

function TrackTypingInput({
  track,
  lyrics,
  loading,
  //album,
  typingPhase,
  onTypingEnded = () => null,
}: TrackTypingInputProps) {
  const { image: albumImage } = useAlbumCover({
    artistName: track?.artistName,
    albumName: track?.albumName,
  })

  const inputRef = useRef<any>(null)
  //const trackRes = useQuery<GetTrackWithLyrics>(GET_TRACK_WITH_LYRICS, {
  //  variables: { id: trackId }
  //});
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  if (loading) {
    return (
      <>
        <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">{track?.name}</h1>
            <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
          </div>

          <p className="mb-2 text-gray-400">{track?.artistName}</p>
          <div className="h-4 my-1 bg-gray-900 rounded w-1/4"> </div>

          <TypingInput
            text={
              lyrics?.body
                ? lyrics.body.slice(0, lyrics.body.length - 73).slice(0, 150)
                : ''
            }
            onTypingEnded={onTypingEnded}
            typingPhase={typingPhase}
            inputRef={inputRef}
          />

          <img
            className="hidden"
            src="https://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuXW"
          />
        </div>
        <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
      </>
    )
  }

  return (
    <>
      <div className="flex">
        <img
          className="rounded w-12 h-12 mr-4 object-cover"
          src={albumImage}
          onError={(e: any) => {
            e.target.src = 'https://placehold.jp/150x150.png?text=No resource'
          }}
        ></img>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{track?.name}</h1>
          <p className="mb-2 text-gray-400">{track?.artistName}</p>
        </div>
      </div>

      <TypingInput
        text={
          lyrics?.body
            ? lyrics.body.slice(0, lyrics.body.length - 73).slice(0, 150)
            : ''
        }
        onTypingEnded={onTypingEnded}
        typingPhase={typingPhase}
        inputRef={inputRef}
      />

      <img
        className="hidden"
        src="https://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuXW"
      />
      <p className="text-sm text-gray-800">{lyrics?.copyright}</p>
    </>
  )
}

export default TrackTypingInput
