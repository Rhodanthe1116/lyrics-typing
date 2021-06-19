import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import React, { useState } from "react";
// Interface
import { Lyrics, TypingResult } from '../interfaces'

// Components
// import Link from 'next/link'
import TypingInput from '../components/TypingInput'
import FullScreenButton from './FullScreenButton'

// Data
import { GetTrackWithLyrics_track } from '../apollo/__generated__/GetTrackWithLyrics'

interface TrackTypingInputProps {
  track?: GetTrackWithLyrics_track
  lyrics?: Lyrics
  loading: boolean
  onTypingEnded?: (result: TypingResult) => void
}


function TrackTypingInput({
  track,
  lyrics,
  loading,
  onTypingEnded = () => null,
}: TrackTypingInputProps) {
  const handle = useFullScreenHandle()

  export enum Status {
    Stopped, Running, Won, Lost
  }
  
  export type State = {
    // board: Board.Board,
    status: Status,
    // secondLeft: number,
    // level: Level
  }
  
  const startGame = (state: State): State => ({
    ...state,
    status: Status.Running,
    // secondLeft: TIME_LIMIT
  })
  
  const showProgress = (state: State): boolean => (
    state.status === Status.Running 
  )

  const [state, setState] = useState({
    // board: generateNewBoard(INITIAL_LEVEL.value),
    // secondLeft: TIME_LIMIT,
    status: Status.Stopped,
    // level: INITIAL_LEVEL
  })
  const { status } = state
  const handleStartingClick = (): void => {
    if (status !== Status.Running) {
      // setNewLevel(state.level)
      setState(startGame)
    }
    if(!handle.active) handle.enter()
  }

  if (loading) {
    return (
      <>
        <FullScreen className={`${handle.active && 'p-6'}`} handle={handle}>
          <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
            <div className="flex justify-between">
              <h1 className="text-lg font-semibold">{track?.name}</h1>
              <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
              <FullScreenButton
                onClick={handle.active ? handle.exit : handle.enter}
              />
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
      {showProgress(state) ?
      <>
        <FullScreen className={`${handle.active && 'p-6'}`} handle={handle}>
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">{track?.name}</h1>
            <FullScreenButton
              onClick={handle.active ? handle.exit : handle.enter}
            />
          </div>

          <p className="mb-2 text-gray-400">{track?.artistName}</p>

          <TypingInput
            text={
              lyrics?.body
                ? lyrics.body.slice(0, lyrics.body.length - 73).slice(0, 150)
                : ''
            }
            onTypingEnded={onTypingEnded}
          />

          <img
            className="hidden"
            src="https://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuXW"
          />
        </FullScreen>
        <p className="text-sm text-gray-500">{lyrics?.copyright}</p>
      </>
      :
      (<div>
        <div className="justify-center items-center flex mt-24">
          <div className="w-auto">  
            <div className="box-border h-80 w-80">
              <img className="h-full w-full object-cover" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7af26ce5-5288-4db3-a0f9-bd833b0c6c35/dc1yn5d-6a203811-236c-4ce9-a609-cf4d507de21d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzdhZjI2Y2U1LTUyODgtNGRiMy1hMGY5LWJkODMzYjBjNmMzNVwvZGMxeW41ZC02YTIwMzgxMS0yMzZjLTRjZTktYTYwOS1jZjRkNTA3ZGUyMWQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.tQE8kIvKG0tXzMhQV1PmjkBL1rXBtAaoQzh4MpUhX8Q"  />
            </div>
            <h1 className="text-lg font-semibold mt-4">{track?.name}</h1>
            <p className="mb-2 text-gray-400">{track?.artistName}</p>
          </div>
        </div>  
          <div className="justify-center items-center flex mt-20">
            <button className="bg-pink-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-36 h-12" onClick={handleStartingClick}>START</button>
          </div>
      </div>)
    }
    </>
  )
}

export default TrackTypingInput
