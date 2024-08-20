import { forwardRef } from 'react'

export const Input = forwardRef<
  HTMLInputElement,
  {
    status?: 'init' | 'wrong' | 'correct'
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function Input(
  props = {
    status: 'init',
  },
  ref
) {
  const { status, className } = props

  const border =
    status === 'init'
      ? 'border-gray-500'
      : status === 'wrong'
        ? 'border-red-500'
        : 'border-green-500'

  return (
    <input
      ref={ref}
      type="text"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={`focus:outline-none bg-slate-800 placeholder-gray-500 border-b-2 p-1 w-full text-3xl ${border} ${className}`}
      {...props}
    />
  )
})
