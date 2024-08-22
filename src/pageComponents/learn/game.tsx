import { useState, useMemo, useEffect, useCallback } from 'react'

import { Input } from 'pageComponents/form/inputs'
import { textToFilename, toSeconds } from 'src/utils'
import { useTimer } from 'src/timer'
import { Progress } from 'pageComponents/Progress'
import { Button } from 'pageComponents/buttons'
import { calcCPM } from 'shared/utils/typing'
import Link from 'next/link'

export enum TypingPhase {
  Ready,
  Typing,
  End,
}

export interface Question {
  'zh-TW'?: string
  jp?: string
  ko?: string
  text: string
}

async function fetchAndPlayAudio(lang: string, text: string) {
  try {
    const filename = encodeURIComponent(textToFilename(text))
    const response = await fetch(`/audio/${lang}/${filename}/${filename}.mp3`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    console.log('audio', audio)
    await audio.play()
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
  }
}

enum Step {
  Started = 'Started',
  End = 'End',
}

interface AnswerResult {
  text: string
  usedTime: number
}

const DEBUG = false

const Game = ({
  lang,
  questions: questionsFromProps,
}: {
  lang: string
  questions: Question[]
}) => {
  const questionsToUse = useMemo(
    () => (DEBUG ? questionsFromProps.slice(0, 3) : questionsFromProps),
    [questionsFromProps]
  )

  // randomize questions
  const questions = useMemo(
    () => [...questionsToUse].sort(() => Math.random() - 0.5),
    [questionsToUse]
  )

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // record total elapsed time, and time for each question
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const {
    time: timerTime,
    isRunning: timerIsRunning,
    start: timerStart,
    stop: timerStop,
  } = useTimer()

  const [step, setStep] = useState<Step>(Step.Started)

  const start = useCallback(() => {
    setStep(Step.Started)
    setCurrentQuestionIndex(0)
    timerStart()
    setStartTime(Date.now())
    setAnswerResults([])
  }, [])
  useEffect(() => {
    if (DEBUG) {
      return
    }
    start()
  }, [])
  const end = useCallback(() => {
    setStep(Step.End)
    timerStop()
    setEndTime(Date.now())
  }, [])

  function getCurrentQuestion() {
    if (currentQuestionIndex >= questions.length) {
      return undefined
    }
    return questions[currentQuestionIndex]
  }

  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([])
  function nextQuestion() {
    // record question time
    const previousAnsweredTime = answerResults.reduce(
      (acc, cur) => acc + cur.usedTime,
      0
    )
    const usedTime = Date.now() - startTime - previousAnsweredTime
    setAnswerResults((prev) => [
      ...prev,
      {
        text: getCurrentQuestion()?.text ?? '',
        usedTime,
      },
    ])

    if (currentQuestionIndex === questions.length - 1) {
      end()
      return
    }
    // set currentQuestionIndex
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }
  // function previouseQuestion() {
  //   // set currentQuestionIndex
  //   setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
  // }
  function checkAnswer(answer: string) {
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion === undefined) {
      throw new Error('currentQuestion is undefined')
    }

    if (currentQuestion.text === answer) {
      return true
    } else {
      return false
    }
  }
  const currentQuestion = getCurrentQuestion()
  // questions

  const [inputValue, setInputValue] = useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const success = checkAnswer(inputValue)
    if (success) {
      nextQuestion()
      setInputValue('')
      setStatus('init')
    } else {
      setStatus('wrong')
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      // reset()
    } else if (e.key === 'Enter' || e.key === ' ') {
      // e.preventDefault()
      // const success = checkAnswer(inputValue)
      // if (success) {
      //   nextQuestion()
      //   setInputValue('')
      //   setStatus('init')
      // } else {
      //   setStatus('wrong')
      // }
    }
  }
  const [status, setStatus] = useState<'init' | 'wrong'>('init')

  // when new question is loaded, play audio
  useEffect(() => {
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion === undefined) {
      return
    }
    fetchAndPlayAudio(lang, currentQuestion.text)
  }, [currentQuestion, lang])

  const handlePlayAudioClick = () => {
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion === undefined) {
      return
    }
    fetchAndPlayAudio(lang, currentQuestion.text)
  }

  const elapsedTime = endTime - startTime
  const totalUsedTime = {
    min: Math.floor(elapsedTime / 60000),
    sec: Math.floor((elapsedTime % 60000) / 1000),
  }
  const totalSeconds = elapsedTime / 1000
  const maxUsedTime = Math.max(...answerResults.map((r) => r.usedTime))
  const totalCharachter = questions.reduce(
    // remove white space
    (acc, cur) => acc + cur.text.replace(/\s/g, '').length,
    0
  )
  const cpm = calcCPM(totalSeconds, totalCharachter)

  return (
    <>
      <div className="h-full px-4  flex flex-col items-center ">
        <div className="max-w-screen-md w-full">
          {step === Step.Started && (
            <>
              <div className=" mt-12  flex flex-col items-center gap-4">
                <p className="text-xl">
                  {currentQuestionIndex + 1}/{questions.length}
                </p>
                <p className="text-4xl">{currentQuestion?.text}</p>
                <p className="text-xl">{currentQuestion?.['zh-TW']}</p>

                <button onClick={handlePlayAudioClick}>🔊</button>
              </div>

              {/* <TypingInput
          text={JSON.stringify(dict)}
          // onTypingEnded={onTypingEnded}
          // typingPhase={typingPhase}
          // inputRef={inputRef}
        /> */}

              <div className="mt-4"></div>
              <form onSubmit={handleSubmit}>
                <Input
                  // onKeyDown={handleKeyDown}
                  status={status}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <input type="submit" hidden />
              </form>
            </>
          )}
          {step === Step.End && (
            <div className="w-full flex flex-col items-center min-w-80 gap-8 pt-10 ">
              {/* xx min xx sec */}

              <h3 className="text-2xl font-bold">Congratulations!</h3>

              <div className="text-center">
                <h6 className="text-6xl font-bold">{cpm}</h6>
                <p className="text-gray-200 font-bold text-sm">chars/min</p>
              </div>

              <p className="text-sm font-bold text-gray-400">{`${totalUsedTime.min} min ${totalUsedTime.sec} sec`}</p>

              <div className="max-w-96 min-w-80">
                {answerResults.map((result, index) => (
                  <div key={index} className="mt-2">
                    <div className="flex justify-between">
                      <p className="font-bold">{result.text}</p>

                      {/* xx.x s */}
                      <p className="text-sm text-gray-400 font-bold">
                        {toSeconds(result.usedTime)} s
                      </p>
                    </div>
                    {/* show progress bar 
                min: 0
                max: maxUsedTime
                value: result.usedTime
                */}
                    <div className="mt-1"></div>
                    <Progress
                      progress={(result.usedTime / maxUsedTime) * 100}
                    ></Progress>
                  </div>
                ))}
              </div>

              <Button
                variant="outlined"
                onClick={() => {
                  start()
                }}
              >
                RESTART
              </Button>
              <Link href={`/learn/${lang}`}>
                <Button>BACK</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Game
