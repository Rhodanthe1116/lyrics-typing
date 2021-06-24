import useUser from "../hooks/useUser";

import Link from 'next/link'
import Layout from '../components/Layout'

import { TrackTypingRecord } from '../interfaces'
import { useAuth } from "shared/auth/context/authUser";

// This function gets called at build time
export async function getStaticProps() {
  return {
    props: {
      // ...(await serverSideTranslations(locale, ['common'])),
      requiredLogin: true,
    },
  }
}


// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
  .then((res: Response) => res.text())
  .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

interface RecordItemProps {
  className?: string;
  record?: TrackTypingRecord;
  loading: boolean;
}

const RecordItem = ({ record, loading }: RecordItemProps) => {

  if (!record) {
    return (
      <div>
        no record.
      </div>
    )
  }

  if (loading) {
    return (

      <div className="animate-pulse border-2 border-green-200 p-4 flex justify-between">
        <div className="flex-1 truncate mr-2">
          <div className="h-4 my-1 mb-2 bg-gray-900 rounded w-3/4">　</div>
          <div className="h-4 my-1 bg-gray-900 rounded w-1/4">　</div>

        </div>
      </div>
    )
  }


  return (
    <Link href={`/tracks/${record.trackId}`}>

      <a className={`border-0 border-green-200 p-4 hover:bg-pink-900 flex justify-between`}>
        <div className="flex-1 truncate mr-2">
          <p className="truncate">{record.trackId}</p>
          <p className="truncate text-gray-400">{new Date(record.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex-none w-12 overflow-hidden">
          <p className="truncate">WPM</p>
          <p className="truncate">{record.result.wpm}</p>
        </div>
      </a>
    </Link>
  )
}

interface RecordListPorps {
  recordList: Array<TrackTypingRecord>;
  loading: boolean;
}
const RecordList = ({ recordList, loading }: RecordListPorps) => {

  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4].map((v) =>
          <div key={v} className="mb-2">
            <RecordItem loading={true}/>
          </div>
        )
        }

      </div>
    )
  }

  // no result
  if (recordList.length === 0) {
    return (
      <div>not found...</div>
    )
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

const ProfilePage = () => {
  const { authState } = useAuth()
  const [user] = useUser()
  // const lyricsRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)


  // if (error) return (<div>failed to load {lyricsRes.error.toString()}</div>)

  // if (!data) return <div>loading...</div>


  return (

    <Layout title="Lyrics Typing">
      <div className="m-4">

        <div className="bg-gray-900 p-4">
          <img className="w-32 h-32 rounded-full mx-auto mb-2" src="https://picsum.photos/500/500" alt="" width="384" height="512"></img>
          <h3 className="text-xl font-bold text-center">{authState.user?.displayName}</h3>
          {/* <p>{user.id}</p> */}
          <div className="mt-2 flex">
            <div className="flex-1 text-center">
              <h2 className="text-4xl">{user?.typingRecords?.length || 0}</h2>
              <p>Total Completed </p>
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-4xl"> {user?.completedTrackIds?.length || 0}</h2>
              <p>Songs Completed</p>
            </div> 
          </div>

        </div>

        <RecordList recordList={user?.typingRecords.reverse()} loading={!user}/>
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

      </div>
    </Layout>
  )
}

export default ProfilePage
