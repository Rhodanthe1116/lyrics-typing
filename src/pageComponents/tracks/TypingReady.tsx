import { GetTrackWithLyrics_track } from 'shared/apollo/__generated__/GetTrackWithLyrics'
import useSWR from 'swr'

interface TypingReadyProp {
  track?: GetTrackWithLyrics_track
  handleStartingClick?: () => void
}

function TypingReady({ track, handleStartingClick }: TypingReadyProp) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.NEXT_PUBLIC_LASTFM_PUBLIC_API_KEY}&artist=${track?.artistName}&album=${track?.name}&format=json`
  const { data: album } = useSWR(url)

  if (!album) {
    return (
      <div className="justify-center items-center flex mt-24">
        <div className="w-auto">
          <div className="animate-pulse border-2 border-green-200 p-4 flex box-border h-80 w-80"></div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="justify-center items-center flex mt-24">
        <div className="w-auto">
          <div className="overflow-ellipsis box-border h-80 w-80">
            <img
              className="h-full w-full object-cover justify-center items-center rounded-3xl"
              src={
                album?.album
                  ? album?.album?.image[1]['#text']
                  : 'http://placehold.jp/150x150.png?text=No resource'
              }
            />
          </div>
          <h1 className="w-80 truncate text-lg font-semibold mt-4">
            {track?.name}
          </h1>
          <p className="mb-2 text-gray-400">{track?.artistName}</p>
        </div>
      </div>
      <div className="justify-center items-center flex mt-20">
        <button
          className="bg-pink-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-36 h-12"
          onClick={handleStartingClick}
        >
          START
        </button>
      </div>
    </div>
  )
}

export default TypingReady
