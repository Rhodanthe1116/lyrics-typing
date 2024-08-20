import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'

import Layout from 'shared/components/Layout'

import { useAuth } from 'shared/auth/context/authUser'
import dict from 'src/data/ko/dict.json'
import { Input } from 'pageComponents/form/inputs'

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

const Game = ({ questions: questionsFromProps }: { questions: Question[] }) => {
  // randomize questions
  const questions = useMemo(
    () => [...questionsFromProps].sort(() => Math.random() - 0.5),
    [questionsFromProps]
  )

  // questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  function getCurrentQuestion() {
    if (currentQuestionIndex >= questions.length) {
      return undefined
    }
    return questions[currentQuestionIndex]
  }
  function nextQuestion() {
    // set currentQuestionIndex
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }
  function previouseQuestion() {
    // set currentQuestionIndex
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
  }
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
  const [status, setStatus] = useState('init')

  return (
    <>
      <div className="h-full px-4 container max-w-screen-md mx-auto flex flex-col ">
        <div className=" mt-12  flex flex-col items-center gap-4">
          <p className="text-xl">
            {currentQuestionIndex + 1}/{questions.length}
          </p>
          <p className="text-4xl">{currentQuestion?.text}</p>
          <p className="text-xl">{currentQuestion?.['zh-TW']}</p>
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
      </div>
    </>
  )
}

export default Game
