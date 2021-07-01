import TrackItem from './TrackItem'

// interface
import { Track } from 'shared/interfaces'
import { calcCPM } from 'shared/utils/typing'

interface typingRecord {
  trackId: string
  duration: number
  correctChar: number
}

interface TrackListPorps {
  trackList?: Track[]
  loading: boolean
  completedIds?: string[]
  typingRecords?: typingRecord[]
}
const TrackList = ({ trackList, loading, typingRecords }: TrackListPorps) => {
  if (trackList === undefined || loading) {
    return (
      <div>
        {[1, 2, 3, 4].map((v) => (
          <div key={v} className="mb-2">
            <TrackItem loading={true} />
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
      {trackList.map((track: Track, index) => {
        const records = typingRecords?.filter((r) => r.trackId === track.id)
        const cpms =
          records?.map((r) => calcCPM(r?.duration, r?.correctChar) ?? 0) ?? []
        const bestCPM = Math.max(0, ...cpms)
        return (
          <div key={index} className="mb-2">
            <TrackItem
              loading={false}
              trackId={track.id}
              trackName={track.name}
              artistName={track.artistName}
              albumName={track.albumName}
              cpm={bestCPM > 0 ? bestCPM.toString() : undefined}
              completed={bestCPM >= 30}
              // createdAt={undefined}
            />
          </div>
        )
      })}
    </div>
  )
}

export default TrackList
