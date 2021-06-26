import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import React, { useRef, useEffect } from 'react'
// Interface
import { /*Album,*/ Lyrics, TypingResult } from 'shared/interfaces'
import { TypingPhase } from 'pages/tracks/[id]'

// Components
// import Link from 'next/link'
import TypingInput from './TypingInput'
import FullScreenButton from 'shared/components/FullScreenButton'

// Data
import { GetTrackWithLyrics_track } from 'shared/apollo/__generated__/GetTrackWithLyrics'
import useFullscreen from 'shared/hooks/useFullscreen'

interface TrackTypingInputProps {
  track?: GetTrackWithLyrics_track
  lyrics?: Lyrics
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
  const { setFullscreen } = useFullscreen()
  const handle = useFullScreenHandle()
  const inputRef = useRef<any>(null)
  //const trackRes = useQuery<GetTrackWithLyrics>(GET_TRACK_WITH_LYRICS, {
  //  variables: { id: trackId }
  //});
  useEffect(() => {
    setFullscreen()
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (typingPhase === TypingPhase.End) {
      handle.exit()
    }
  }, [typingPhase])

  if (loading) {
    return (
      <>
        <FullScreen className={`${handle.active && 'p-6'}`} handle={handle}>
          <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
            <div className="flex justify-between">
              <h1 className="text-lg font-semibold">{track?.name}</h1>
              <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
              <FullScreenButton onClick={setFullscreen} />
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
        </FullScreen>
        <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
      </>
    )
  }

  return (
    <>
      <FullScreen className={`${handle.active && 'p-6'}`} handle={handle}>
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">{track?.name}</h1>
          <FullScreenButton onClick={setFullscreen} />
        </div>

        <p className="mb-2 text-gray-400">{track?.artistName}</p>

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
      </FullScreen>
      <p className="text-sm text-gray-500">{lyrics?.copyright}</p>
    </>
  )
}

export default TrackTypingInput
