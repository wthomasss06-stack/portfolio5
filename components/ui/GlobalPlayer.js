'use client'
import { usePlayer } from '@/lib/player-store'
import { Play, Pause, X, Volume2, VolumeX, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWALink } from '@/lib/beats-data'
import { useState, useRef } from 'react'

const PREVIEW_SEC = 30

function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const s = Math.min(Math.floor(sec), PREVIEW_SEC)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

function Bars({ playing }) {
  return (
    <div className={playing ? 'playing' : ''} style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 20 }}>
      {[8, 16, 11, 19, 7, 14, 10, 17].map((h, i) => (
        <div key={i} className="waveform-bar" style={{ height: h, width: 2 }} />
      ))}
    </div>
  )
}

export default function GlobalPlayer() {
  const { currentBeat, isPlaying, progress, volume, loading, error, play, seek, changeVolume, stop, PREVIEW_SEC: PS } = usePlayer()
  const [muted, setMuted]   = useState(false)
  const [showVol, setShowVol] = useState(false)
  const barRef = useRef(null)

  const elapsed   = progress * (PS || PREVIEW_SEC)
  const remaining = (PS || PREVIEW_SEC) - elapsed
  const pct       = progress * 100

  const handleBarClick = (e) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    seek((e.clientX - rect.left) / rect.width)
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    changeVolume(next ? 0 : 0.8)
  }

  return (
    <AnimatePresence>
      {currentBeat && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000,
            background: 'linear-gradient(180deg, rgba(12,12,12,.97) 0%, rgba(8,8,8,1) 100%)',
            backdropFilter: 'blur(40px)',
            borderTop: '1px solid rgba(201,168,76,.2)',
            boxShadow: '0 -20px 80px rgba(0,0,0,.8), 0 -1px 0 rgba(201,168,76,.08)',
          }}>

          {/* ── Barre de progression cliquable ── */}
          <div
            ref={barRef}
            onClick={handleBarClick}
            style={{
              position: 'relative', height: 2,
              background: 'rgba(255,255,255,.05)',
              cursor: 'pointer',
              overflow: 'visible',
            }}
            onMouseEnter={e => e.currentTarget.style.height = '4px'}
            onMouseLeave={e => e.currentTarget.style.height = '2px'}
          >
            {/* Track rempli */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, rgba(201,168,76,.5) 0%, var(--gold) 100%)',
              boxShadow: '0 0 6px rgba(201,168,76,.4)',
              transition: 'width .15s linear',
            }} />
            {/* Point de lecture */}
            <div style={{
              position: 'absolute', top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--gold)',
              boxShadow: '0 0 8px rgba(201,168,76,.9)',
              transition: 'left .15s linear',
            }} />
          </div>

          {/* ── Corps ── */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '0 5%',
            height: 72,
            gap: '1.2rem',
          }}>

            {/* Cover */}
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              borderRadius: 3,
              border: isPlaying
                ? '1px solid rgba(201,168,76,.6)'
                : '1px solid rgba(201,168,76,.2)',
              overflow: 'hidden',
              background: 'var(--black3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isPlaying ? '0 0 20px rgba(201,168,76,.15)' : 'none',
              transition: 'all .3s',
              fontSize: '1.5rem',
            }}>
              {currentBeat.cover
                ? <img src={currentBeat.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : currentBeat.mood || '🎵'
              }
            </div>

            {/* Titre + genre */}
            <div style={{ minWidth: 0, flex: '0 0 auto', maxWidth: 200 }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.1rem', letterSpacing: '.06em',
                color: 'var(--white)', lineHeight: 1.1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {currentBeat.title}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '.52rem', letterSpacing: '.12em',
                color: 'rgba(201,168,76,.65)',
                marginTop: 3,
              }}>
                {[currentBeat.genre, currentBeat.bpm && `${currentBeat.bpm} BPM`].filter(Boolean).join(' · ')}
              </div>
            </div>

            {/* Bouton play/pause */}
            <button
              onClick={() => play(currentBeat)}
              style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                background: loading ? 'transparent' : isPlaying ? 'var(--gold)' : 'rgba(201,168,76,.12)',
                border: loading ? '1.5px solid rgba(201,168,76,.3)' : isPlaying ? 'none' : '1.5px solid rgba(201,168,76,.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .25s',
                boxShadow: isPlaying ? '0 0 24px rgba(201,168,76,.3)' : 'none',
              }}>
              {loading
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(201,168,76,.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                : isPlaying
                  ? <Pause size={16} color="#080808" fill="#080808" />
                  : <Play size={16} color="var(--gold)" style={{ marginLeft: 2 }} />
              }
            </button>

            {/* Centre : waveform + temps + cercle */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>

              {/* Waveform animée */}
              <div className="hide-mobile">
                <Bars playing={isPlaying} />
              </div>

              {/* Temps écoulé / total */}
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '.58rem', letterSpacing: '.08em',
                display: 'flex', gap: '.3rem', alignItems: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: 'var(--gold)' }}>{fmt(elapsed)}</span>
                <span style={{ color: 'rgba(244,240,235,.2)' }}>/</span>
                <span style={{ color: 'rgba(244,240,235,.25)' }}>0:30</span>
              </div>

              {/* Badge PREVIEW */}
              <div className="hide-mobile" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '.45rem', letterSpacing: '.14em',
                color: 'rgba(201,168,76,.4)',
                border: '1px solid rgba(201,168,76,.15)',
                borderRadius: 2, padding: '2px 6px',
                flexShrink: 0,
              }}>
                PREVIEW
              </div>

              {/* Cercle countdown */}
              <div className="hide-mobile" style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="14" fill="none" stroke="rgba(201,168,76,.08)" strokeWidth="2" />
                  <circle
                    cx="17" cy="17" r="14" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * progress}`}
                    strokeLinecap="round"
                    transform="rotate(-90 17 17)"
                    style={{ transition: 'stroke-dashoffset .15s linear', opacity: .7 }}
                  />
                </svg>
                <span style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '.42rem', color: 'rgba(201,168,76,.8)',
                }}>
                  {remaining > 0 ? `${Math.ceil(remaining)}s` : '✓'}
                </span>
              </div>

              {/* Message erreur */}
              {error && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '.5rem', color: 'rgba(200,56,42,.7)',
                  letterSpacing: '.08em',
                }}>
                  LIEN DRIVE INVALIDE
                </span>
              )}
            </div>

            {/* Volume */}
            <div style={{ position: 'relative', flexShrink: 0 }} className="hide-mobile">
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted ? 'rgba(201,168,76,.3)' : 'rgba(244,240,235,.3)', transition: 'color .2s', padding: '4px' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = muted ? 'rgba(201,168,76,.3)' : 'rgba(244,240,235,.3)'}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Acheter */}
            <a
              href={getWALink(currentBeat)}
              target="_blank" rel="noreferrer"
              className="hide-mobile"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                padding: '.42rem .9rem',
                background: 'var(--gold)',
                color: '#080808',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '.62rem', letterSpacing: '.1em',
                borderRadius: 2, flexShrink: 0,
                textDecoration: 'none', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'none' }}>
              <ShoppingCart size={11} />
              {currentBeat.price || 'ACHETER'}
            </a>

            {/* Fermer */}
            <button
              onClick={stop}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(244,240,235,.15)',
                cursor: 'pointer', flexShrink: 0,
                transition: 'color .2s', padding: '4px',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(244,240,235,.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,240,235,.15)'}>
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
