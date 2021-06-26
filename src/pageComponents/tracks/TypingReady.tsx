import { GetTrackWithLyrics_track } from 'shared/apollo/__generated__/GetTrackWithLyrics'

interface TypingReadyProp {
  track?: GetTrackWithLyrics_track
  handleStartingClick?: () => void
}

function TypingReady({ track, handleStartingClick }: TypingReadyProp) {
  return (
    <div>
      <div className="justify-center items-center flex mt-24">
        <div className="w-auto">
          <div className="box-border h-80 w-80">
            <img
              className="h-full w-full object-cover"
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7af26ce5-5288-4db3-a0f9-bd833b0c6c35/dc1yn5d-6a203811-236c-4ce9-a609-cf4d507de21d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzdhZjI2Y2U1LTUyODgtNGRiMy1hMGY5LWJkODMzYjBjNmMzNVwvZGMxeW41ZC02YTIwMzgxMS0yMzZjLTRjZTktYTYwOS1jZjRkNTA3ZGUyMWQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.tQE8kIvKG0tXzMhQV1PmjkBL1rXBtAaoQzh4MpUhX8Q"
            />
          </div>
          <h1 className="text-lg font-semibold mt-4">{track?.name}</h1>
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
