import Link from 'next/link'
import { useAlbumCover } from 'shared/hooks/useAlbumInfo'

// interface
import { Track } from 'shared/interfaces'

interface TrackListPorps {
  trackList?: Track[]
  loading: boolean
  completedIds: string[]
}
const TrackList = ({ trackList, loading, completedIds }: TrackListPorps) => {
  if (trackList === undefined || loading) {
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
  if (trackList !== undefined && trackList.length === 0) {
    return <div>not found...</div>
  }

  return (
    <div className="max-w-full">
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
  const { image: albumImage } = useAlbumCover({
    artistName: track?.artistName,
    albumName: track?.albumName,
  })

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

  const imgOnError = (e) => {
    e.target.src = 'https://placehold.jp/150x150.png?text=No resource'
  }
  return (
    <Link href={`/tracks/${track.id}`}>
      <a
        className={`flex max-w-full border-0 border-green-200 p-4 hover:bg-pink-600 ${
          completed ? 'bg-green-900' : 'bg-gray-900'
        }`}
      >
        <img
          className="rounded w-12 h-12 mr-4 object-cover"
          src={albumImage}
          onError={imgOnError}
        ></img>

        <div className="flex-1 flex justify-between truncate">
          <div className="flex-1 min-w-0 truncate mr-2">
            <p className="truncate">{track.name}</p>
            <p className="truncate text-gray-400">{track.artistName}</p>
          </div>
          <div className="flex-none w-12 overflow-hidden">
            <p className="truncate">⭐{track.rating}</p>
            <p className="truncate">❤{track.numFavourite}</p>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default TrackList
