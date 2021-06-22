import useUser from "../hooks/useUser";

import Link from 'next/link'
import Layout from '../components/Layout'

import { TrackTypingRecord } from '../interfaces'


// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
  .then((res: Response) => res.text())
  .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const timeStampConverter = (stamp: any) => {
  const date = new Date(stamp)
  const output = ((date.getMonth()+1) 
                  + "/" 
                  + date.getDate() 
                  + " "
                  + date.getHours()
                  + ":"
                  + date.getMinutes())
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

      <a className={`border-0 border-green-200 md:py-3 md:px-6 py-1 px-3 hover:bg-pink-900 flex justify-between bg-gray-900`}>
        <div>
          <img className="md:w-28 md:h-28 w-16 h-16 object-cover object-fill" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7af26ce5-5288-4db3-a0f9-bd833b0c6c35/dc1yn5d-6a203811-236c-4ce9-a609-cf4d507de21d.png/v1/fill/w_952,h_839,q_70,strp/great_days_album_cover_by_orochismith_dc1yn5d-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwNiIsInBhdGgiOiJcL2ZcLzdhZjI2Y2U1LTUyODgtNGRiMy1hMGY5LWJkODMzYjBjNmMzNVwvZGMxeW41ZC02YTIwMzgxMS0yMzZjLTRjZTktYTYwOS1jZjRkNTA3ZGUyMWQucG5nIiwid2lkdGgiOiI8PTExNDEifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.QJ7sn-riqwsCp_38xmJI1gwNfVlJ_j8iOJ2aKo-Mtak"></img>
        </div>

        <div className="flex-1 truncate ml-4 md:ml-8">
          <p className="truncate font-bold text-2xl  md:text-3xl">Pale Blue</p>
          <p className="truncate font-bold text-gray-400 mt-2 md:mt-8 md:text-2xl">Kenshi Yonezu</p>
        </div>
        <div className="flex-none w-auto overflow-hidden text-right">
          <p className="truncate text-red-500 md:text-3xl">{record.result.wpm} CPM</p>
          <p className="truncate text-gray-400 mt-4 md:mt-8 md:text-2xl">{timeStampConverter(record.timestamp).toLocaleString()}</p>
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

  const [user] = useUser()
  // const lyricsRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)

  // if (error) return (<div>failed to load {lyricsRes.error.toString()}</div>)

  // if (!data) return <div>loading...</div>


  return (

    <Layout title="Lyrics Typing">

      <div className="">
        <div className="relative">
            <div className="flex mt-8">
              <div className="flex-1 justify-center">
                <div className="flex items-center justify-center gap-2 min-w-max ml-3">
                  <img className="md:w-48 md:h-48 w-20 h-20 rounded-full" src="https://picsum.photos/500/500" alt="" width="384" height="512"></img>
                  <h3 className="md:text-2xl text-base font-bold min-w-max p-2">{user.name}</h3>
                </div>
              </div>
              <div className="flex-1 text-center transform translate-y-1">
                <h2 className="text-green-200 font-bold md:text-9xl text-5xl"> {user?.completedTrackIds?.length || 0}</h2>
                <p className="font-bold"> Songs Passed</p>
              </div>
            </div>
            
        </div>
      </div>

      <div className="m-4 m-8">
        {/* bg-gray-900 p-3 */}
        <div className="md:mb-24 mb-16">
         
          {/* <p>{user.id}</p> */}
          <div className="flex">
            <div className="flex-1 ">
              <p className="md:text-3xl font-semibold text-center mr-56 whitespace-nowrap">Average CMP</p>
              <div className="md:pt-4 md:text-xl pt-1 grid grid-flow-row grid-cols-2 grid-rows-3 text-center">
                <div>JP</div>
                <div>32</div>
                <div>TW</div>
                <div>40</div>
                <div>KR</div>
                <div>3</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="md:text-3xl font-semibold text-center mr-56 whitespace-nowrap">Top Artists</p>
              <div className="md:pt-4 md:text-xl pt-1 grid grid-flow-row grid-cols-2 grid-rows-3 text-center">
                <div>A</div>
                <div>32</div>
                <div>B</div>
                <div>12</div>
                <div>C</div>
                <div>3</div>
              </div>
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
