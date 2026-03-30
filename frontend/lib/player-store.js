'use client'
import { createContext, useContext, useState, useRef, useCallback } from 'react'
import { getDriveAudioUrl } from './beats-data'

const PREVIEW_SEC = 30
const PlayerCtx = createContext(null)

export function PlayerProvider({ children }) {
  const [currentBeat, setCurrentBeat] = useState(null)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [progress, setProgress]       = useState(0)
  const [volume, setVolume]           = useState(0.8)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(false)
  const audioRef = useRef(null)

  const play = useCallback((beat) => {
    // Toggle pause/play même beat
    if (currentBeat?.id === beat.id) {
      const audio = audioRef.current
      if (!audio) return
      if (isPlaying) { audio.pause(); setIsPlaying(false) }
      else { audio.play().catch(() => {}); setIsPlaying(true) }
      return
    }

    // Nouveau beat
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setLoading(true)
    setError(false)
    setProgress(0)
    setCurrentBeat(beat)

    const audio = new Audio()
    audioRef.current = audio
    audio.volume = volume
    audio.preload = 'auto'
    audio.src = getDriveAudioUrl(beat.driveId)

    audio.oncanplay = () => setLoading(false)
    audio.onloadedmetadata = () => setLoading(false)

    audio.ontimeupdate = () => {
      if (audio.currentTime >= PREVIEW_SEC) {
        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)
        setProgress(1)
        return
      }
      setProgress(audio.currentTime / PREVIEW_SEC)
    }

    audio.onended = () => { setIsPlaying(false); setProgress(0) }
    audio.onerror = () => { setLoading(false); setError(true); setIsPlaying(false) }

    audio.play()
      .then(() => { setIsPlaying(true); setLoading(false) })
      .catch(() => { setLoading(false); setError(true) })

  }, [currentBeat, isPlaying, volume])

  const seek = useCallback((pct) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(pct * PREVIEW_SEC, PREVIEW_SEC - 0.5)
    setProgress(pct)
  }, [])

  const changeVolume = useCallback((v) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setIsPlaying(false); setProgress(0); setCurrentBeat(null); setError(false)
  }, [])

  return (
    <PlayerCtx.Provider value={{ currentBeat, isPlaying, progress, volume, loading, error, play, seek, changeVolume, stop, PREVIEW_SEC }}>
      {children}
    </PlayerCtx.Provider>
  )
}

export const usePlayer = () => useContext(PlayerCtx)
