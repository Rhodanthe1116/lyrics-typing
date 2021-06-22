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
          <img className="md:w-22 md:h-22 w-16 h-16 object-cover object-fill" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7af26ce5-5288-4db3-a0f9-bd833b0c6c35/dc1yn5d-6a203811-236c-4ce9-a609-cf4d507de21d.png/v1/fill/w_952,h_839,q_70,strp/great_days_album_cover_by_orochismith_dc1yn5d-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwNiIsInBhdGgiOiJcL2ZcLzdhZjI2Y2U1LTUyODgtNGRiMy1hMGY5LWJkODMzYjBjNmMzNVwvZGMxeW41ZC02YTIwMzgxMS0yMzZjLTRjZTktYTYwOS1jZjRkNTA3ZGUyMWQucG5nIiwid2lkdGgiOiI8PTExNDEifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.QJ7sn-riqwsCp_38xmJI1gwNfVlJ_j8iOJ2aKo-Mtak"></img>
        </div>

        <div className="flex-1 truncate ml-4 md:ml-8">
          <p className="truncate font-bold text-xl  md:text-xl">Pale Blue</p>
          <p className="truncate font-bold text-gray-400 mt-2 md:mt-2 md:text-xl">Kenshi Yonezu</p>
        </div>
        <div className="flex-none w-auto overflow-hidden text-right">
          <p className="truncate text-red-500 md:text-xl">{record.result.wpm} CPM</p>
          <p className="truncate text-gray-400 mt-4 md:mt-2 md:text-xl">{timeStampConverter(record.timestamp).toLocaleString()}</p>
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
            <div className="flex my-8">
              <div className="flex-1">
                <div className="flex items-center justify-center gap-2 ml-12 md:ml-0">
                  <img className="md:w-48 md:h-48 w-20 h-20 rounded-full" src="https://picsum.photos/500/500" alt="" width="384" height="512"></img>
                  <p className="whitespace-nowrap md:text-2xl text-base font-bold p-2">{user.name}</p>
                </div>
              </div>
              <div className="truncate flex-1 transform translate-y-1 ml-20 mt-2">
                <p className="text-green-200 font-bold md:text-9xl text-4xl text-center"> {user?.completedTrackIds?.length || 0}</p>
                <p className="font-bold text-sm text-center"> Songs Passed</p>
              </div>
            </div>
            
        </div>
      </div>

      
        {/* bg-gray-900 p-3 */}
        <div className="m-4 md:mb-24 mb-16">
         
          {/* <p>{user.id}</p> */}
          <div className="text-sm flex mb-12">
            <div className="flex-1 ml-2 md:ml-10">
              <p className="truncate md:text-2xl font-semibold">Average CMP</p>
              <div className="truncate pl-4 md:pt-4 md:text-2xl md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
                <p>JP</p>
                <p className="pl-8 md:pl-28">32</p>
                <p>TW</p>
                <p className="pl-8 md:pl-28">40</p>
                <p>KR</p>
                <p className="pl-8 md:pl-28">3</p>
              </div>
            </div>
            <div className="flex-1 md:pl-12">
              <p className="truncate md:text-2xl font-semibold">Top Artists</p>
              <div className="truncate pl-4 md:pt-4 md:text-2xl md:ml-4 pt-1 grid grid-flow-row grid-cols-2 grid-rows-3">
                <p>A</p>
                <p className="pl-8 md:pl-28">32</p>
                <p>B</p>
                <p className="pl-8 md:pl-28">12</p>
                <p>C</p>
                <p className="pl-8 md:pl-28">3</p>
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
