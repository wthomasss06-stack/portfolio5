'use client'
import { useEffect, useState } from 'react'

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e) => setHover(!!e.target.closest('a,button,[data-hover]'))
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" style={{ left: pos.x, top: pos.y }} />
      <div className={`cursor-ring ${hover ? 'hover' : ''}`} style={{ left: pos.x, top: pos.y }} />
    </>
  )
}
