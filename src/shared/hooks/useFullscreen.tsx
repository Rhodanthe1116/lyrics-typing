import React from 'react'

export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const setFullscreen = () => {
    const elem = document.documentElement
    elem
      .requestFullscreen()
      .then(() => {
        setIsFullscreen(document[getBrowserFullscreenElementProp()] != null)
      })
      .catch(() => {
        setIsFullscreen(false)
      })
  }

  React.useLayoutEffect(() => {
    document.onfullscreenchange = () =>
      setIsFullscreen(document[getBrowserFullscreenElementProp()] != null)

    return () => {
      document.onfullscreenchange = null
    }
  })

  return [isFullscreen, setFullscreen]
}

function getBrowserFullscreenElementProp() {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement'
    // @ts-ignore
  } else if (typeof document.mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement'
    // @ts-ignore
  } else if (typeof document.msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement'
    // @ts-ignore
  } else if (typeof document.webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement'
  } else {
    throw new Error('fullscreenElement is not supported by this browser')
  }
}
