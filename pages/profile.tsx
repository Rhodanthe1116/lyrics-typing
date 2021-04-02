import 'tailwindcss/tailwind.css'
import useUser from "../hooks/useUser";

// import Link from 'next/link'
import Layout from '../components/Layout'



// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args)
    .then((res: Response) => res.text())
    .then((text: string) => JSON.parse(text.slice(9, text.length - 2)))

const ProfilePage = () => {

    const [user] = useUser()
    // const lyricsRes = useSWR(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=${trackId}&apikey=${apiKey}`, fetcher)


    // if (error) return (<div>failed to load {lyricsRes.error.toString()}</div>)

    // if (!data) return <div>loading...</div>


    return (

        <Layout title="Lyrics Typing">
            <div className="m-4">

                <div className="bg-gray-900 p-4">
                    <img className="w-32 h-32 rounded-full mx-auto mb-2" src="https://picsum.photos/500/500" alt="" width="384" height="512"></img>
                    <h3 className="text-xl font-bold text-center">{user.name}</h3>
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

                {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

            </div>
        </Layout>
    )
}

export default ProfilePage
