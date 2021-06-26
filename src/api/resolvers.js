const { paginateResults } = require('./utils')

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches()
      // we want these in reverse chronological order
      allLaunches.reverse()
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      })
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor at the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      }
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),

    chartTracks: async (_, { country }, { dataSources }) => {
      const allTracks = await dataSources.musixmatchAPI.getChartTracks({
        country: country,
      })
      return allTracks
    },
    tracks: async (_, { query, artistId }, { dataSources }) => {
      const allTracks = await dataSources.musixmatchAPI.searchTracks({
        query: query,
        artistId: artistId,
      })
      return allTracks ?? []
    },
    track: (_, { id }, { dataSources }) =>
      dataSources.musixmatchAPI.getTrackById({ trackId: id }),
    album: (_, { id }, { dataSources }) =>
      dataSources.musixmatchAPI.getAlbumById({ albumId: id }),
    tracksByAlbum: async (_, { id }, { dataSources }) => {
      const allTracks = await dataSources.musixmatchAPI.getTracksByAlbumId({
        albumId: id,
      })
      return allTracks
    },
    recommandTracks: async (_, { artistId, albumId }, { dataSources }) => {
      if (artistId && albumId) {
        const sameAlbumTracks =
          (await dataSources.musixmatchAPI.getTracksByAlbumId({
            albumId: albumId,
          })) ?? []
        const needSize = 20 - sameAlbumTracks.length + 1
        if (needSize <= 0){
          return sameAlbumTracks
        }
        const allAlbums = (await dataSources.musixmatchAPI.getAlbumsByArtistId({
            artistId: artistId,
          })) ?? []
        let selectAlbum = allAlbums[Math.floor(Math.random() * allAlbums.length)]
        if (selectAlbum.id !== albumId){
          const otherTracks = (await dataSources.musixmatchAPI.getTracksByAlbumId({
          size: needSize,
          albumId: selectAlbum.id,
          }))
          otherTracks.push(...sameAlbumTracks)
          return otherTracks
        }
        else{
          selectAlbum = allAlbums[Math.floor(Math.random() * allAlbums.length)]
          const otherTracks = (await dataSources.musixmatchAPI.getTracksByAlbumId({
            size: needSize,
            albumId: selectAlbum.id,
            }))
          otherTracks.push(...sameAlbumTracks)
          return otherTracks
        }
      } 
      else if (!artistId && albumId) {
        const sameAlbumTracks =
          (await dataSources.musixmatchAPI.getTracksByAlbumId({
            albumId: albumId,
          })) ?? []
        return sameAlbumTracks
      } 
      else if (artistId && !albumId) {
        const allAlbums = (await dataSources.musixmatchAPI.getAlbumsByArtistId({
          artistId: artistId,
        })) ?? []
        const selectAlbum = allAlbums[Math.floor(Math.random() * allAlbums.length)]
        const otherTracks = (await dataSources.musixmatchAPI.getTracksByAlbumId({
        size: needSize,
        albumId: selectAlbum.id,
        }))
        return otherTracks
      } 
      else {
        return []
      }
    },
  },

  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email })
      if (user) {
        user.token = Buffer.from(email).toString('base64')
        return user
      }
    },
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds })
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds,
      })

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                (id) => !results.includes(id)
              )}`,
        launches,
      }
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId })

      if (!result)
        return {
          success: false,
          message: 'failed to cancel trip',
        }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId })
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      }
    },
  },

  Mission: {
    // The default size is 'LARGE' if not provided
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge
    },
  },

  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },

  Track: {
    lyrics: (track, _, { dataSources }) =>
      dataSources.musixmatchAPI.getLyricsByTrackId({ trackId: track.id }),
  },

  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser()
      if (!launchIds.length) return []
      // look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      )
    },
  },
}
