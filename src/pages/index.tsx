import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from 'shared/components/Layout'
import TrackList from 'shared/components/TrackList'
import { SearchIcon } from 'shared/components/Icons'

// interface

// data
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  GET_CHART_TRACKS,
  SEARCH_TRACKS,
  GET_RECOMMAND_TRACKS,
} from 'shared/apollo/query'
import { GET_TYPING_RECORDS } from 'shared/apollo/query'
import { GetTypingRecords } from 'shared/apollo/__generated__/GetTypingRecords'
import { SearchTracks } from 'shared/apollo/__generated__/SearchTracks'
import { GetChartTracks } from 'shared/apollo/__generated__/GetChartTracks'
import { GetRecommandTracks } from 'shared/apollo/__generated__/GetRecommandTracks'
import { hashString } from 'shared/utils/hashString'
import { useAuth } from 'shared/auth/context/authUser'

function CountrySelect({ value = 'JP', onChange }) {
  return (
    <select
      className="mb-2 bg-black border-green-200"
      value={value}
      onChange={onChange}
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
  )
}
const IndexPage = () => {
  const router = useRouter()

  const { authState } = useAuth()
  const { user } = authState

  // QEURY START
  const [queryInput, setQueryInput] = useState(router.query.q?.toString() ?? '')
  const query: string = router.query.q?.toString() || ''
  const [country, setCountry] = useState('JP')
  function handleQueryChange(queryInput: string) {
    // setQuery(queryInput)
    router.push({
      pathname: '',
      query: { q: queryInput },
    })
  }

  useEffect(() => {
    setQueryInput(query)
  }, [query])

  useEffect(() => {
    const timeOutId = setTimeout(() => handleQueryChange(queryInput), 500)
    return () => clearTimeout(timeOutId)
  }, [queryInput])
  // QEURY END

  const chartTracksRes = useQuery<GetChartTracks>(GET_CHART_TRACKS, {
    variables: { country: country },
  })
  const chartTracks = chartTracksRes?.data?.chartTracks ?? []

  const searchTracksRes = useQuery<SearchTracks>(SEARCH_TRACKS, {
    variables: { query: query },
    skip: query === '',
  })

  const searchedTracks = searchTracksRes?.data?.tracks ?? []

  const [getRecommand, recommandTracksRes] =
    useLazyQuery<GetRecommandTracks>(GET_RECOMMAND_TRACKS)
  const recommandTracks = recommandTracksRes?.data?.recommandTracks?.slice(
    0,
    10
  )

  const typingRecordsRes = useQuery<GetTypingRecords>(GET_TYPING_RECORDS, {
    ssr: false,
    skip: !user?.uid,
    onCompleted: () => {
      console.log('onCompleted')
      if (recommandTracks && recommandTracks.length !== 0) {
        return
      }
      const lastRecord = JSON.stringify(typingRecords[typingRecords.length - 1])

      const randomIndex = hashString(lastRecord) % typingRecords.length
      getRecommand({
        variables: {
          artistId: typingRecords[randomIndex]?.artistId,
          albumId: typingRecords[randomIndex]?.albumId,
        },
      })
    },
  })
  const typingRecords = typingRecordsRes.data?.typing_record ?? []

  // if (!data || !tracksRes.data) return <div>loading...</div>

  return (
    <Layout displayHeader={true}>
      <div className="m-2">
        <div className="mx-2">
          <div className="relative text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-outline"
              >
                <SearchIcon />
              </button>
            </span>
            <input
              className="text-sm text-white rounded-md pl-10 px-2 py-1 w-full max-w-full bg-black  focus:outline-none "
              value={queryInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQueryInput(e.target.value)
              }
              placeholder="Search song or artist here."
            />
            {/* <input type="search" name="q" class="" placeholder="Search..." autocomplete="off"> */}
          </div>
        </div>
        <div className="my-12 flex flex-col items-center">
          <h1 className="text-3xl text-center">
            Learn <span className="text-green-200">language</span> by{' '}
            <span className="text-green-200">typing lyrics</span>!
          </h1>
        </div>

        {query !== '' ? (
          <>
            <h2 className="text-xl mx-2 my-2">Search Results</h2>
            {searchTracksRes.error ? (
              <div>failed to load {searchTracksRes.error?.toString()}</div>
            ) : (
              <TrackList
                trackList={searchedTracks}
                loading={searchTracksRes.loading}
                typingRecords={typingRecords}
              />
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl mx-2 my-2">Favorite Albums / Artists</h2>
            {typingRecordsRes.called &&
            typingRecordsRes.data?.typing_record.length === 0 ? (
              <p>Nothing to recommand you. Start your first typing now!</p>
            ) : (
              <TrackList
                trackList={recommandTracks}
                loading={recommandTracksRes.loading}
                typingRecords={typingRecords}
              />
            )}

            <h2 className="text-xl my-2 mx-2 ">
              Popular in{' '}
              <span className="text-base">
                <CountrySelect
                  value={country}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCountry(e.target.value)
                  }
                />
              </span>
            </h2>
            {chartTracksRes.error ? (
              <div>failed to load {chartTracksRes.error?.toString()}</div>
            ) : (
              <TrackList
                trackList={chartTracks as any}
                loading={chartTracksRes.loading}
                typingRecords={typingRecords}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
