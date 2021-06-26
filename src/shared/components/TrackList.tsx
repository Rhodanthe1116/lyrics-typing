import Link from 'next/link'

// interface
import { Track } from 'shared/interfaces'

interface TrackListPorps {
  trackList: Track[]
  loading: boolean
  completedIds: string[]
}
const TrackList = ({ trackList, loading, completedIds }: TrackListPorps) => {
  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4].map((v) => (
          <div key={v} className="mb-2">
            <TrackItem loading={true} completed={false} />
          </div>
        ))}
      </div>
    )
  }

  // no result
  if (!trackList || trackList.length === 0) {
    return <div>not found...</div>
  }

  return (
    <div>
      {trackList.map((track: Track, index) => (
        <div key={index} className="mb-2">
          <TrackItem
            track={track}
            loading={false}
            completed={completedIds?.includes(track?.id)}
          />
        </div>
      ))}
    </div>
  )
}

interface TrackItemProps {
  className?: string
  track?: Track
  loading: boolean
  completed: boolean
}

const TrackItem = ({ track, loading, completed }: TrackItemProps) => {
  if (loading) {
    return (
      <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
        <div className="flex-1 truncate mr-2">
          <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4"> </div>
          <div className="h-4 my-1 bg-gray-900 rounded w-1/4"> </div>
        </div>
      </div>
    )
  }

  if (!track) {
    return <div>no track</div>
  }

  return (
    <Link href={`/tracks/${track.id}`}>
      <a
        className={`border-0 border-green-200 p-4 hover:bg-pink-900 ${
          completed ? 'bg-green-900' : 'bg-gray-900'
        } flex justify-between`}
      >
        <div className="flex-1 truncate mr-2">
          <p className="truncate">{track.name}</p>
          <p className="truncate text-gray-400">{track.artistName}</p>
        </div>
        <div className="flex-none w-12 overflow-hidden">
          <p className="truncate">⭐{track.rating}</p>
          <p className="truncate">❤{track.numFavourite}</p>
        </div>
      </a>
    </Link>
  )
}

export default TrackList
