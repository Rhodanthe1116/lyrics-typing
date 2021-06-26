import { useState, createContext, useContext } from 'react'

interface ITopProgressBar {
  loading: boolean
}

export const TopProgressBarContext = createContext<{
  topProgressBar: ITopProgressBar
  setTopProgressBar: (state: ITopProgressBar) => void
}>({
  topProgressBar: {
    loading: false,
  },
  setTopProgressBar: (state: ITopProgressBar) => state,
})

export const useTopProgressBar = () => useContext(TopProgressBarContext)

export const TopProgressBarProvider = (props) => {
  const [topProgressBar, setTopProgressBar] = useState<ITopProgressBar>({
    loading: false,
  })

  const setter = (state: ITopProgressBar): void => {
    setTopProgressBar({
      ...state,
    })
  }

  return (
    <TopProgressBarContext.Provider
      value={{ topProgressBar: topProgressBar, setTopProgressBar: setter }}
    >
      {props.children}
    </TopProgressBarContext.Provider>
  )
}
