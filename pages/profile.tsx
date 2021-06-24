import { VFC } from 'react'
import useUser from '../hooks/useUser'

import Link from 'next/link'
import Layout from '../components/Layout'

import { TrackTypingRecord } from '../interfaces'
import { useAuth } from 'shared/auth/context/authUser'
import { colorImageUrl } from 'shared/utils/placeholder'

// This function gets called at build time
export async function getStaticProps() {
  return {
    props: {
      // ...(await serverSideTranslations(locale, ['common'])),
      requiredLogin: true,
    },
  }
}

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
  record?: TrackTypingRecord
  loading: boolean
}

const RecordItem = ({ record, loading }: RecordItemProps) => {
  if (!record) {
    return <div>no record.</div>
  }

  if (loading) {
    return (
      <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
        <div className="flex-1 truncate mr-2">
          <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4">  </div>
          <div className="h-4 my-1 bg-gray-900 rounded w-1/4">  </div>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/tracks/${record.trackId}`}>
      <a
        className={`border-0 border-green-200 md:py-3 md:px-6 py-1 px-3 hover:bg-pink-900 flex justify-between bg-gray-900`}
      >
        <div>
          <img
            className="md:w-22 md:h-22 w-16 h-16 object-cover object-fill"
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7af26ce5-5288-4db3-a0f9-bd833b0c6c35/dc1yn5d-6a203811-236c-4ce9-a609-cf4d507de21d.png/v1/fill/w_952,h_839,q_70,strp/great_days_album_cover_by_orochismith_dc1yn5d-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwNiIsInBhdGgiOiJcL2ZcLzdhZjI2Y2U1LTUyODgtNGRiMy1hMGY5LWJkODMzYjBjNmMzNVwvZGMxeW41ZC02YTIwMzgxMS0yMzZjLTRjZTktYTYwOS1jZjRkNTA3ZGUyMWQucG5nIiwid2lkdGgiOiI8PTExNDEifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.QJ7sn-riqwsCp_38xmJI1gwNfVlJ_j8iOJ2aKo-Mtak"
          ></img>
        </div>

        <div className="flex-1 truncate ml-4 md:ml-8">
          <p className="truncate font-bold">Pale Blue</p>
          <p className="truncate font-bold text-gray-400 mt-4 md:mt-4` ">
            Kenshi Yonezu
          </p>
        </div>
        <div className="flex-none w-auto overflow-hidden text-right">
          <p className="truncate text-red-500">{record.result.wpm} CPM</p>
          <p className="truncate text-gray-400 mt-4 md:mt-4">
            {timeStampConverter(record.timestamp).toLocaleString()}
          </p>
        </div>
      </a>
    </Link>
  )
}

interface RecordListPorps {
  recordList: Array<TrackTypingRecord>
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
    return <div>not found...</div>
  }

  return (
    <div>
      {recordList.map((record: TrackTypingRecord, index) => (
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

const LoginAlert: VFC<LoginAlertProps> = ({ onClick }) => {
  return (
    <div className="m-4 p-4 h-16 text-green-200 rounded-xl bg-green-900 bg-opacity-30 border-green-700 border">
      <Link href="/login">
        <p>Sign in to track your progress!</p>
      </Link>
    </div>
  )
}

const ProfilePage = () => {
  const { authState, logout } = useAuth()
  const user = authState.user
  const [deprecatedUser] = useUser()

  return (
    <Layout title="Lyrics Typing">
      {user?.isAnonymous && <LoginAlert />}

      <div className="">
        <div className="relative">
          <div className="flex my-8">
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 ml-12 md:ml-0">
                <img
                  className="md:w-36 md:h-36 w-20 h-20 rounded-full"
                  src={authState.user?.photoURL ?? colorImageUrl}
                  alt=""
                  width="384"
                  height="512"
                ></img>
                <p className="whitespace-nowrap md:text-2xl text-base font-bold p-2">
                  {authState.user?.displayName ?? deprecatedUser.name}
                </p>
              </div>
            </div>
            <div className="truncate flex-1 transform translate-y-1 ml-20 mt-2">
              <p className="text-green-200 font-bold md:text-8xl text-4xl text-center">
                {' '}
                {deprecatedUser?.completedTrackIds?.length || 0}
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

        <RecordList
          recordList={deprecatedUser?.typingRecords.reverse()}
          loading={!deprecatedUser}
        />
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </div>
    </Layout>
  )
}

export default ProfilePage
