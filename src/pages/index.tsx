import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from 'shared/components/Layout'
import TrackList from 'shared/components/TrackList'

// interface
import { Track } from 'shared/interfaces'

// data
import { useQuery } from '@apollo/client'
import { GET_CHART_TRACKS, SEARCH_TRACKS } from 'shared/apollo/query'

const IndexPage = () => {
  const router = useRouter()

  const [queryInput, setQueryInput] = useState(router.query.q?.toString() ?? '')
  const query: string = router.query.q?.toString() || ''
  const [country, setCountry] = useState('JP')

  const chartTracksRes = useQuery(GET_CHART_TRACKS, {
    variables: { country: country },
  })

  const tracksRes = useQuery(SEARCH_TRACKS, {
    variables: { query: query },
    skip: query === '',
  })

  const trackList: Array<Track> = queryInput
    ? tracksRes?.data?.tracks
    : chartTracksRes?.data?.chartTracks

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
    const timeOutId = setTimeout(() => handleQueryChange(queryInput), 500)
    return () => clearTimeout(timeOutId)
  }, [queryInput])

  // if (!data || !tracksRes.data) return <div>loading...</div>

  return (
    <Layout>
      <div className="m-2">
        <div className="mt-16 mb-6 flex flex-col items-center">
          <h1 className="text-3xl text-center mb-8">
            Learn <span className="text-green-200">Lyrics</span> and{' '}
            <span className="text-green-200">Language</span> with{' '}
            <span className="text-green-200">Typing</span>!
          </h1>

          <input
            className="mb-6 p-1 w-80 text-lg bg-black border-2 border-green-200 focus:outline-none "
            value={queryInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQueryInput(e.target.value)
            }
            placeholder="Search song or artist here."
          />

          <div className={`${queryInput && 'invisible'}`}>
            <p className="inline mr-1 text-gray-400">
              ...or see what&apos;s popular in your country
            </p>
            <select
              className="mb-2 bg-black border-green-200"
              value={country}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCountry(e.target.value)
              }
            >
              <option className="py-1" value="JP">
                JP
              </option>
              <option className="py-1" value="TW">
                TW
              </option>
              <option className="py-1" value="KR">
                KR
              </option>
              <option className="py-1" value="US">
                US
              </option>
            </select>
            {/* <input className="mb-2 bg-black border-2 border-purple-500" type="text" list="country_code_list" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}/>
                    <datalist id="country_code_list">
                        <option className="py-1" value="JP">JP</option>
                        <option className="py-1" value="TW">TW</option>
                        <option className="py-1" value="US">US</option>
                    </datalist> */}
          </div>
        </div>

        {chartTracksRes.error || tracksRes.error ? (
          <div>
            failed to load{' '}
            {(chartTracksRes.error || tracksRes.error)?.toString()}
          </div>
        ) : (
          <TrackList
            trackList={trackList}
            loading={tracksRes.loading}
            completedIds={[]}
          />
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
