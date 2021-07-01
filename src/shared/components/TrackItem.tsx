import Link from 'next/link'
import { useAlbumCover } from 'shared/hooks/useAlbumInfo'

// interface

const timeStampConverter = (stamp: any) => {
  const date = new Date(stamp)
  const output =
    date.getMonth() +
    1 +
    '/' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes()
  return output
}

interface TrackItemProps {
  className?: string | null
  trackId?: string | null
  trackName?: string | null
  albumName?: string | null
  artistName?: string | null
  cpm?: string | null
  createdAt?: string | null
  loading?: boolean | null
  completed?: boolean | null
}

const TrackItem = ({
  trackId,
  trackName,
  artistName,
  albumName,
  cpm,
  createdAt,
  loading = true,
  completed = false,
}: TrackItemProps) => {
  const { image: albumImage } = useAlbumCover({
    artistName: artistName,
    albumName: albumName,
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

  if (!trackName) {
    return <div>no track</div>
  }

  const imgOnError = (e) => {
    e.target.src = 'https://placehold.jp/150x150.png?text=No resource'
  }

  const cpmColor = completed ? 'text-green-500' : 'text-red-500'
  return (
    <Link href={`/tracks/${trackId}`}>
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
            <p className="truncate">{trackName}</p>
            <p className="truncate text-gray-400">{artistName}</p>
          </div>
          <div className="flex-none w-auto overflow-hidden text-right">
            <p className={`truncate ${cpmColor}`}>{cpm && `${cpm} CPM`}</p>
            <p className="truncate text-gray-400">
              {createdAt && timeStampConverter(createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default TrackItem
