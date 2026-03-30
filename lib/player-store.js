'use client'
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import { getDriveAudioUrl, API_URL } from './beats-data'

const PREVIEW_SEC = 30
const PlayerCtx = createContext(null)

// ── Keep-alive PythonAnywhere ─────────────────────────────────
// Ping /api/beats toutes les 4 min pour éviter le cold start
function usePingBackend() {
  useEffect(() => {
    const ping = () => fetch(`${API_URL}/api/beats`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {})
    ping() // ping immédiat au chargement
    const id = setInterval(ping, 4 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
}

export function PlayerProvider({ children }) {
  const [currentBeat, setCurrentBeat] = useState(null)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [progress, setProgress]       = useState(0)
  const [volume, setVolume]           = useState(0.8)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(false)
  const audioRef   = useRef(null)
  const preloadRef = useRef({}) // cache des Audio() préchargés { beatId: Audio }

  usePingBackend()

  // ── Précharge l'audio au hover (sans jouer) ───────────────
  const preload = useCallback((beat) => {
    if (!beat?.driveId) return
    if (currentBeat?.id === beat.id) return  // déjà en cours
    if (preloadRef.current[beat.id]) return  // déjà préchargé

    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = getDriveAudioUrl(beat.driveId)
    preloadRef.current[beat.id] = audio
  }, [currentBeat])

  const play = useCallback((beat) => {
    // Toggle pause/play même beat
    if (currentBeat?.id === beat.id) {
      const audio = audioRef.current
      if (!audio) return
      if (isPlaying) { audio.pause(); setIsPlaying(false) }
      else { audio.play().catch(() => {}); setIsPlaying(true) }
      return
    }

    // Nouveau beat — réutilise le préchargé si dispo
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setLoading(true)
    setError(false)
    setProgress(0)
    setCurrentBeat(beat)

    const audio = preloadRef.current[beat.id] || new Audio()
    delete preloadRef.current[beat.id] // libère le cache
    audioRef.current = audio
    audio.volume = volume
    audio.preload = 'auto'
    if (!audio.src) audio.src = getDriveAudioUrl(beat.driveId)

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
    <PlayerCtx.Provider value={{ currentBeat, isPlaying, progress, volume, loading, error, play, preload, seek, changeVolume, stop, PREVIEW_SEC }}>
      {children}
    </PlayerCtx.Provider>
  )
}

export const usePlayer = () => useContext(PlayerCtx)
