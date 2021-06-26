import { useState, useCallback, useRef } from 'react'

export function useDialog() {
  const [open, setIsOpen] = useState(false)
  const loaded = useRef<boolean>(false)

  const onOpen = useCallback(() => {
    loaded.current = true
    setIsOpen(true)
  }, [])
  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return { onOpen, onClose, toggle, open, openConstant: loaded.current }
}
