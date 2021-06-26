import React, { FC, useEffect, useRef, useState } from 'react'

import useTyping, { PhaseType } from 'react-typing-game-hook'
import { TypingResult } from '../interfaces'
import { TypingPhase } from '../pages/tracks/[id]'

const TypeInput: FC<{
  text: string
  typingPhase: TypingPhase
  inputRef: any
  onTypingEnded: (result: TypingResult) => void
}> = ({ text, onTypingEnded, typingPhase, inputRef }) => {
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  const [duration, setDuration] = useState(0)
  const [typingInput, setTypingInput] = useState('')
  const [typedWrong, setTypeWrong] = useState(false)
  //const inputRef = useRef<any>(null)

  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, getDuration, deleteTyping },
  } = useTyping(text, {
    skipCurrentWordOnSpace: false,
  })

  const [currWordPos, setCurrWordPos] = useState([-1, -1])

  //checks whether the word is correct while the user is typing
  useEffect(() => {
    setTypeWrong((prev: boolean): boolean => {
      let hasError = false
      for (let i = 0; i < typingInput.length; i++) {
        const char = typingInput[i]
        const correctChar = text[currWordPos[0] + i]
        const diff = char !== correctChar
        if (diff) {
          hasError = true
          break
        }
      }
      if (hasError !== prev) {
        return !prev
      } else {
        return prev
      }
    })
  }, [typingInput, currWordPos, text])

  // Set the start and end index of the next word
  useEffect(() => {
    let tempCurrIndex =
      text[currIndex] === ' ' || text[currIndex] === '\n'
        ? currIndex + 1
        : currIndex
    if (tempCurrIndex === -1) {
      tempCurrIndex = 0
    }
    let startIndex = Math.max(
      text.lastIndexOf(' ', tempCurrIndex),
      text.lastIndexOf('\n', tempCurrIndex)
    )
    startIndex = startIndex < 0 ? 0 : startIndex + 1

    let nextSpace = text.indexOf(' ', tempCurrIndex)
    if (nextSpace === -1) {
      nextSpace = text.length
    }
    let nextBreak = text.indexOf('\n', tempCurrIndex)
    if (nextBreak === -1) {
      nextBreak = text.length
    }
    const nextSep = Math.min(nextSpace, nextBreak)
    const endIndex = nextSep - 1

    setCurrWordPos((oldcurrWordPos) => {
      if (startIndex !== oldcurrWordPos[0] || endIndex !== oldcurrWordPos[1]) {
        if (text[startIndex - 1] === '\n') {
          lyricsContainerRef.current?.scrollBy(0, 28)
        }
        return [startIndex, endIndex]
      }
      return oldcurrWordPos
    })
  }, [currIndex, text])

  const reset = () => {
    resetTyping()
    setDuration(0)
    setTypingInput('')
    inputRef.current.focus()
    //insertTyping();
    //deleteTyping()
  }

  // Submit inputted word
  const submitWord = () => {
    for (let i = currWordPos[0]; i <= currWordPos[1]; i++) {
      const index = i - currIndex - 1
      if (index > typingInput.length - 1) {
        insertTyping(' ')
      } else {
        insertTyping(typingInput[index])
      }
    }
    // if (lyricsContainerRef.current?.scrollTop)
    insertTyping(' ')
    setTypingInput('')
    setTypeWrong(false)
  }

  // set WPM
  useEffect(() => {
    if (phase === PhaseType.Ended && endTime && startTime) {
      const duration = (endTime - startTime) / 1000
      // setDuration(Math.floor((endTime - startTime) / 1000));
      setCurrWordPos([-1, -1])

      // Save record.
      const newResult: TypingResult = {
        wpm: Math.round((60 / duration) * correctChar),
        duration: duration,
        correctChar: correctChar,
        errorChar: errorChar,
        accuracy: (correctChar / text.length) * 100,
        textLength: text.length,
      }

      onTypingEnded(newResult)

      console.log('save')
    }
  }, [phase, startTime, endTime, correctChar, errorChar, text])

  useEffect(() => {
    const timerId = setInterval(() => {
      if (phase === PhaseType.Started) {
        setDuration(parseFloat((getDuration() / 1000).toFixed(2)))
      }
    }, 100)
    return () => clearInterval(timerId)
  }, [phase])

  useEffect(() => {
    insertTyping()
    deleteTyping()
  }, [])

  return (
    <div>
      {phase === PhaseType.Ended && startTime && endTime ? (
        <div className="text-base">
          <p
            className={`text-xl" ${
              Math.round((60 / duration) * correctChar) >= 30
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {Math.round((60 / duration) * correctChar) >= 30
              ? 'Passed'
              : 'Failed'}
          </p>
          <div className="my-4 flex justify-center items-end">
            <h2
              className={`text-3xl text-center border-solid mx-4 ${
                Math.round((60 / duration) * correctChar) >= 30
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {Math.round((60 / duration) * correctChar)}
            </h2>
            <div className="text-sm"> CPM</div>
          </div>
          <ul className="text-sm mb-4 text-gray-500">
            {/* <li className="text-lg mr-4">Time: {duration}s</li> */}
            <li>Times: {Math.round(duration)}s</li>
            <li>
              {' '}
              Correct / Wrong : {correctChar} / {errorChar}
            </li>

            <li>Accuracy: {((correctChar / text.length) * 100).toFixed(2)}%</li>
          </ul>
        </div>
      ) : null}
      <div
        className={`text-xl select-none  `}
        onClick={() => {
          inputRef.current.focus()
        }}
      >
        <div
          ref={lyricsContainerRef}
          className=" border-purple-500 p-4 rounded-lg  tracking-wide mb-2 h-48 overflow-y-scroll overflow-x-hidden"
        >
          {text.split('').map((letter, index) => {
            const shouldHightlight =
              index >= currWordPos[0] && index <= currWordPos[1]
            const state = charsState[index]
            let styling = 'text-red-500'

            const INIT = 0
            const CORRECT = 1
            const WRONG = 2

            if (shouldHightlight) {
              styling = ''
            } else if (state === INIT) {
              styling = 'text-gray-700'
            } else if (state === CORRECT) {
              styling = 'text-green-400'
            } else if (state === WRONG) {
              // TODO: ???
            }

            if (letter === '\n') {
              return <br key={letter + index} />
            }
            return (
              <span key={letter + index} className={`${styling}`}>
                {letter}
              </span>
            )
          })}
        </div>
        <div
          className={`mb-2 ${typingPhase === TypingPhase.End ? 'hidden' : ''}`}
        >
          <input
            type="text"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                reset()
              } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                submitWord()
              }
            }}
            onChange={(e) => {
              setTypingInput(e.target.value)
            }}
            value={typingInput}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`focus:outline-none bg-black placeholder-gray-500 border-b-2 p-1 w-full ${
              !typingInput.length
                ? 'border-gray-500'
                : typedWrong
                ? 'border-red-500'
                : 'border-green-500'
            } `}
            placeholder={
              phase !== PhaseType.Started
                ? 'Type here... (Press enter to submit)'
                : ''
            }
            disabled={typingPhase === TypingPhase.End}
          />
        </div>
      </div>
      <div
        className={`flex justify-between text-gray-500 mb-8 ${
          typingPhase === TypingPhase.End ? 'hidden' : ''
        }`}
      >
        <span>Time: {duration}s</span>
        <button onClick={() => reset()}>Reset</button>
      </div>

      {phase === PhaseType.Ended && startTime && endTime ? (
        <div className="text-sm">
          <div className="transform rotate-45 ">
            <div className="animate-floatup21 transform scale-90 left-21/40 absolute opacity-75 bg-white shadow-lg top-0.01 buttom-0 m-auto rounded">
              1
            </div>
            <div className="animate-floatup17 transform scale-170 left-15/40 absolute opacity-75 bg-white shadow-lg top-0.01 buttom-0 m-auto rounded">
              2
            </div>
            <div className="animate-floatup09 transform scale-320 left-1/4 absolute opacity-75 bg-white shadow-lg top-0.1 buttom-0 m-auto rounded">
              3
            </div>
            <div className="animate-floatup17 transform scale-320 left-18/40 absolute opacity-75 bg-white shadow-lg top-0.1 buttom-0 m-auto rounded">
              4
            </div>
            <div className="animate-floatup07 transform scale-320 left-21/40 absolute opacity-75 bg-white shadow-lg top-0.1 buttom-0 m-auto rounded">
              4
            </div>
            <div className="animate-floatup13 transform scale-320 left-3/10 absolute opacity-75 bg-white shadow-lg top-0.1 buttom-0 m-auto rounded">
              4
            </div>
          </div>
        </div>
      ) : null}

      {/* Debug */}
      {false && (
        <pre>
          {JSON.stringify({ currWordPos }, null, 2)}
          {JSON.stringify(
            {
              charsState,
              currIndex,
              phase,
              correctChar,
              errorChar,
              startTime,
              endTime,
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  )
}

export default TypeInput
