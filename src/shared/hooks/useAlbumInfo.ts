import useSWR from 'swr'
const API_KEY = process.env.NEXT_PUBLIC_LASTFM_PUBLIC_API_KEY

function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const useAlbumInfo = ({ artistName, albumName }) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${artistName}&album=${albumName}&format=json`
  return useSWR(url)
}

const sizeToIndex = {
  small: 0,
  medium: 1,
  large: 2,
  extralarge: 3,
  mega: 4,
  unknown: 5,
}
type AlbumCoverSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'extralarge'
  | 'mega'
  | 'unknown'

export const useAlbumCover = (
  { artistName, albumName },
  size: AlbumCoverSize = 'medium'
) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${artistName}&album=${albumName}&format=json`
  const { data: albumQuery, ...others } = useSWR(url)

  const imageUrl = albumQuery?.album?.image[sizeToIndex[size]]['#text']

  return {
    image: isValidHttpUrl(imageUrl)
      ? imageUrl
      : 'https://placehold.jp/150x150.png?text=No resource',
    loading: !albumQuery,
    ...others,
  }
}
