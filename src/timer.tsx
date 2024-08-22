import { useState, useEffect } from 'react'

export function useTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else if (interval !== null) {
      clearInterval(interval)
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval)
      }
    }
  }, [isRunning])

  return {
    time,
    isRunning,
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    reset: () => setTime(0),
  }
}
