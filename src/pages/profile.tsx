import { VFC } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'

// custom
import { useAuth } from 'shared/auth/context/authUser'
import { colorImageUrl } from 'shared/utils/placeholder'
import { GET_TYPING_RECORDS } from 'shared/apollo/query'
import {
  GetTypingRecords,
  GetTypingRecords_typing_record,
} from 'shared/apollo/__generated__/GetTypingRecords'
import { calcCPM } from 'shared/utils/typing'
import { login } from 'shared/auth/utils/firebase'
import { getAnimalByHash } from 'shared/utils/animals'

// custom ui
import Layout from 'shared/components/Layout'
import TrackItem from 'shared/components/TrackItem'

// const findTrackById = (id: String) =>{
//   const track = useQuery(GET_TRACK, {
//     variables: { id: id }
//   })
//   // console.log(track)
//   if(track.data){
//     return track.data.track
//   }
//   return "undefined"
// };

interface RecordItemProps {
  className?: string
  record?: GetTypingRecords_typing_record
  loading: boolean
}

const RecordItem = ({ record, loading }: RecordItemProps) => {
  const cpm = calcCPM(record?.duration, record?.correctChar)

  return (
    <TrackItem
      loading={loading}
      trackId={record?.trackId}
      trackName={record?.trackName}
      artistName={record?.artistName}
      albumName={record?.albumName}
      cpm={cpm.toString()}
      createdAt={record?.createdAt}
    />
  )
}

interface RecordListPorps {
  recordList: GetTypingRecords_typing_record[]
  loading: boolean
}
const RecordList = ({ recordList, loading }: RecordListPorps) => {
  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4].map((v) => (
          <div key={v} className="mb-2">
            <RecordItem loading={true} />
          </div>
        ))}
      </div>
    )
  }

  // no result
  if (recordList.length === 0) {
    return (
      <div>
        <Link href="/">
          <a className="text-green-200">No record now. Go to play</a>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {recordList.map((record, index) => (
        <div key={index} className="mb-2">
          <RecordItem record={record} loading={false} />
        </div>
      ))}
    </div>
  )
}

interface LoginAlertProps {
  onClick?: () => void
}

const LoginAlert: VFC<LoginAlertProps> = () => {
  return (
    <div className="m-4 p-4 h-14 text-green-200 rounded-xl bg-green-900 bg-opacity-30 border-green-700 border">
      <a href="#" onClick={login}>
        Sign in to save your progress!
      </a>
    </div>
  )
}

interface StatisticsProps {
  typingRecords?: GetTypingRecords_typing_record[]
}

const Statistics: VFC<StatisticsProps> = ({ typingRecords = [] }) => {
  const sumCPM = typingRecords?.reduce(
    (sum, record) => sum + calcCPM(record.duration, record.correctChar),
    0
  )
  const avgCPM = typingRecords?.length > 0 ? sumCPM / typingRecords.length : 0

  const artistCountMap: Record<string, number> = {}
  typingRecords.forEach((record) => {
    if (!record.artistName) {
      return
    }
    if (artistCountMap[record.artistName] === undefined) {
      artistCountMap[record.artistName] = 0
    } else {
      artistCountMap[record.artistName] += 1
    }
  })

  const sortedArtist: { artistName: string; count: number }[] = Object.entries(
    artistCountMap
  )
    .map(([key, value]) => ({ artistName: key, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return (
    <div className="text-sm flex mb-12">
      <div className=" flex-1 ml-2 md:ml-10">
        <p className="truncate font-semibold">Average CPM</p>
        <div className="md:max-w-lg truncate pl-4 md:pt-4 md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
          <p>Now</p>
          <p className="pl-8 md:pl-28">{avgCPM.toFixed(1)}</p>
          <p> </p>
          <p className="pl-8 md:pl-28"> </p>
          <p> </p>
          <p className="pl-8 md:pl-28"> </p>
        </div>
      </div>
      <div className="flex-1 md:pl-12">
        <p className="truncate font-semibold">Top Artists</p>
        <div className="md:max-w-lg truncate pl-4 md:pt-4 md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
          {sortedArtist.map(({ artistName, count }) => (
            <>
              <p>{artistName}</p>
              <p className="pl-8 md:pl-28">{count}</p>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
const ProfilePage = () => {
  const { authState, logout } = useAuth()
  const user = authState.user

  const { data: typingRecordsQueryData } = useQuery<GetTypingRecords>(
    GET_TYPING_RECORDS,
    {
      fetchPolicy: 'cache-and-network',
    }
  )
  const typingRecords = typingRecordsQueryData?.typing_record ?? []
  const typingRecordsWithCPM = typingRecords.map((r) => ({
    ...r,
    cpm: calcCPM(r.duration, r.correctChar),
  }))

  const passedRecordCount = new Set(
    typingRecordsWithCPM.filter((r) => r.cpm >= 30).map((r) => r.trackId)
  ).size

  return (
    <Layout>
      {user?.isAnonymous && <LoginAlert />}

      <div className="">
        <div className="relative">
          <div className="flex my-8">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 ml-12 md:ml-0">
                <img
                  className="md:w-36 md:h-36 w-20 h-20 rounded-full"
                  src={user?.photoURL ?? colorImageUrl}
                  alt=""
                  width="384"
                  height="512"
                ></img>
                <p className="whitespace-nowrap md:text-2xl text-base font-bold p-2">
                  {user?.displayName ??
                    `${getAnimalByHash(user?.uid)}-${
                      user?.uid?.slice(0, 5) ?? ''
                    }`}
                </p>
              </div>
            </div>
            <div className="truncate flex-1 transform translate-y-1 ml-20 mt-2">
              <p className="text-green-200 font-bold md:text-8xl text-4xl text-center">
                {' '}
                {passedRecordCount || 0}
              </p>
              <p className="font-bold text-center md:pt-4"> Songs Passed</p>
            </div>
          </div>
        </div>
      </div>

      {/* bg-gray-900 p-3 */}
      <div className="m-4 md:mb-24 mb-16">
        {/* <p>{user.id}</p> */}
        <Statistics typingRecords={typingRecords} />

        {!user?.isAnonymous && (
          <div className="flex justify-end text-gray-700">
            <button onClick={logout} className="">
              <a>Logout</a>
            </button>
          </div>
        )}

        <RecordList recordList={[...typingRecords].reverse()} loading={!user} />
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </div>
    </Layout>
  )
}

export default ProfilePage
