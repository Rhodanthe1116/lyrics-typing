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
import { useAlbumCover } from 'shared/hooks/useAlbumInfo'

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
  const { image: albumImage } = useAlbumCover({
    artistName: record?.artistName,
    albumName: record?.albumName,
  })

  const cpm = calcCPM(record?.duration, record?.correctChar)

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

  if (!record) {
    return <div>no record.</div>
  }

  const completed = cpm >= 30
  const cpmColor = completed ? 'text-green-500' : 'text-red-500'
  return (
    <Link href={`/tracks/${record.trackId}`}>
      <a
        className={`border-0 border-green-200 p-4 hover:bg-pink-600 ${
          completed ? 'bg-green-900' : 'bg-gray-900'
        } flex`}
      >
        <img
          className="rounded mr-4 object-cover w-12 h-12"
          src={albumImage}
        ></img>

        <div className="flex-grow flex justify-between">
          <div className="flex-1 truncate mr-2">
            <p className="truncate">{record.trackName}</p>
            <p className="truncate text-gray-400">{record.artistName}</p>
          </div>
          <div className="flex-none w-auto overflow-hidden text-right ">
            <p className={`truncate ${cpmColor}`}>{cpm} CPM</p>
            <p className="truncate text-gray-400">
              {timeStampConverter(record.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </a>
    </Link>
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
                {typingRecords?.length || 0}
              </p>
              <p className="font-bold text-center md:pt-4"> Songs Passed</p>
            </div>
          </div>
        </div>
      </div>

      {/* bg-gray-900 p-3 */}
      <div className="m-4 md:mb-24 mb-16">
        {/* <p>{user.id}</p> */}
        <div className="text-sm flex mb-12">
          <div className=" flex-1 ml-2 md:ml-10">
            <p className="truncate font-semibold">Average CMP</p>
            <div className="md:max-w-lg truncate pl-4 md:pt-4 md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
              <p>JP</p>
              <p className="pl-8 md:pl-28">32</p>
              <p>TW</p>
              <p className="pl-8 md:pl-28">40</p>
              <p>KR</p>
              <p className="pl-8 md:pl-28">3</p>
            </div>
          </div>
          <div className="flex-1 md:pl-12">
            <p className="truncate font-semibold">Top Artists</p>
            <div className="md:max-w-lg truncate pl-4 md:pt-4 md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
              <p>A</p>
              <p className="pl-8 md:pl-28">32</p>
              <p>B</p>
              <p className="pl-8 md:pl-28">12</p>
              <p>C</p>
              <p className="pl-8 md:pl-28">3</p>
            </div>
          </div>
        </div>

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
