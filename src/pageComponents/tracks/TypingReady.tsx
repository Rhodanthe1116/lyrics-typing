import { GetTrackWithLyrics_track } from 'shared/apollo/__generated__/GetTrackWithLyrics'
import { useAlbumCover } from 'shared/hooks/useAlbumInfo'

interface TypingReadyProp {
  track?: GetTrackWithLyrics_track | null
  handleStartingClick?: () => void
  loading: boolean
}

function LoadingCover() {
  return (
    // <div className="animate-pulse border-2 border-green-200 p-4 flex box-border h-80 w-80"></div>
    <div className="animate-pulse border-2 border-green-200 p-4 table box-border h-80 w-80">
      <p className="table-cell text-center align-middle">Loading</p>
    </div>
  )
}

function LoadingText() {
  return (
    <>
      <div className="h-7 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
      <div className="h-4 my-1 bg-gray-900 rounded w-1/4"> </div>
    </>
  )
}

function TypingReady({ track, handleStartingClick, loading }: TypingReadyProp) {
  const { image: albumImage, loading: imageLoading } = useAlbumCover(
    {
      artistName: track?.artistName,
      albumName: track?.albumName,
    },
    'extralarge'
  )

  return (
    <div>
      <div className="justify-center items-center flex mt-24">
        <div className="w-auto">
          {imageLoading ? (
            <LoadingCover />
          ) : (
            <img
              className="h-80 w-80 object-cover rounded-3xl"
              src={albumImage}
            />
          )}

          <div className="w-80 h-14 mt-4 mb-2">
            {loading ? (
              <LoadingText />
            ) : (
              <>
                <h1 className="truncate text-lg font-semibold">
                  {track?.name}
                </h1>
                <p className="text-gray-400">{track?.artistName}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="justify-center items-center flex mt-20">
        <button
          className="bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-36 h-12"
          onClick={handleStartingClick}
          disabled={loading}
        >
          START
        </button>
      </div>
    </div>
  )
}

export default TypingReady
