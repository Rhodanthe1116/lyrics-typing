import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'

import Link from 'next/link'
import Layout from '../components/Layout'

// interface
import { Track } from '../interfaces'

// data
import useUser from '../hooks/useUser'
import { gql, useQuery } from '@apollo/client';

interface TrackItemProps {
  className?: string;
  track?: Track;
  loading: boolean;
  completed: boolean;
}

const TrackItem = ({ track, loading, completed }: TrackItemProps) => {

  

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
  
  if (!track) {
    return <div>no track</div>
  }

  return (
    <Link href={`/track?id=${track.id}`}>

      <a className={`border-0 border-green-200 p-4 hover:bg-pink-900 ${completed ? 'bg-green-900' : 'bg-gray-900'} flex justify-between`}>
        <div className="flex-1 truncate mr-2">
          <p className="truncate">{track.name}</p>
          <p className="truncate text-gray-400">{track.artistName}</p>
        </div>
        <div className="flex-none w-12 overflow-hidden">
          <p className="truncate">⭐{track.rating}</p>
          <p className="truncate">❤{track.numFavourite}</p>
        </div>
      </a>
    </Link>
  )
}

interface TrackListPorps {
  trackList: Track[];
  loading: boolean;
  completedIds: number[];
}
const TrackList = ({ trackList, loading, completedIds }: TrackListPorps) => {

  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4].map((v) =>
          <div key={v} className="mb-2">
            <TrackItem loading={true} completed={false} />
          </div>
        )
        }

      </div>
    )
  }

  // no result
  if (!trackList || trackList.length === 0) {
    return (
      <div>not found...</div>
    )
  }

  return (
    <div>
      {trackList.map((track: Track, index) => (
        <div key={index} className="mb-2">
          <TrackItem track={track} loading={false} completed={completedIds?.includes(track?.id)} />
        </div>
      ))}
    </div>

  )
}


export const TRACK_TILE_DATA = gql`
  fragment TrackTile on Track {
    __typename
    id
    name
    artistName
    rating
    numFavourite
  }
`;

export const GET_CHART_TRACKS = gql`
  query GetChartTracks($country: String) {
    chartTracks(country: $country) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`;

export const SEARCH_TRACKS = gql`
  query SearchTracks($query: String) {
    tracks(query: $query) {
      ...TrackTile
    }
  }
  ${TRACK_TILE_DATA}
`;

const IndexPage = () => {
  const router = useRouter()

  const [user] = useUser()

  const [queryInput, setQueryInput] = useState(router.query.q?.toString() || '')
  const query: string = router.query.q?.toString() || ''
  const [country, setCountry] = useState('JP')

  const chartTracksRes = useQuery(GET_CHART_TRACKS, { 
    variables: { country: country } 
  });

  const tracksRes = useQuery(SEARCH_TRACKS, { 
    variables: { query: query } 
  });

  const trackList: Array<Track> = (queryInput ? tracksRes?.data?.tracks : chartTracksRes?.data?.chartTracks)

  function handleQueryChange(queryInput: string) {
    // setQuery(queryInput)
    if (queryInput) {
      router.push({
        pathname: '',
        query: { q: queryInput },
      })
    }
  }

  useEffect(() => {
    setQueryInput(query)
  }, [query])

  useEffect(() => {
    const timeOutId = setTimeout(() => handleQueryChange(queryInput), 500);
    return () => clearTimeout(timeOutId);
  }, [queryInput]);

  // if (!data || !tracksRes.data) return <div>loading...</div>


  return (

    <Layout title="Lyrics Typing - Learn Lyrics and Language with Typing!">

      <div className="m-2">

        <div className="mt-16 mb-6 flex flex-col items-center">


          <h1 className="text-3xl text-center mb-8">
            Learn <span className="text-green-200">Lyrics</span> and <span className="text-green-200">Language</span> with <span className="text-green-200">Typing</span>!
                    </h1>

          <input
            className="mb-6 p-1 w-80 text-lg bg-black border-2 border-green-200 focus:outline-none "
            value={queryInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryInput(e.target.value)}
            placeholder="Search song or artist here."
          />

          <div className={`${queryInput && 'invisible'}`}>
            <p className="inline mr-1 text-gray-400">or look for what's popular in your country</p>
            <select className="mb-2 bg-black border-green-200" value={country} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}>
              <option className="py-1" value="JP">JP</option>
              <option className="py-1" value="TW">TW</option>
              <option className="py-1" value="US">US</option>
            </select>
            {/* <input className="mb-2 bg-black border-2 border-purple-500" type="text" list="country_code_list" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}/>
                    <datalist id="country_code_list">
                        <option className="py-1" value="JP">JP</option>
                        <option className="py-1" value="TW">TW</option>
                        <option className="py-1" value="US">US</option>
                    </datalist> */}
          </div>

        </div>

        {(chartTracksRes.error || tracksRes.error) ?
          <div>failed to load {(chartTracksRes.error || tracksRes.error)?.toString()}</div>
          :
          <TrackList trackList={trackList} loading={(tracksRes.loading)} completedIds={user?.completedTrackIds || []} />
        }

      </div>

    </Layout>
  )
}

export default IndexPage
