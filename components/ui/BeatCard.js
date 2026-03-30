'use client'
import { motion } from 'framer-motion'
import { Play, Pause, ShoppingCart, Music } from 'lucide-react'
import { usePlayer } from '@/lib/player-store'
import { getWALink } from '@/lib/beats-data'

function Waveform({ active, playing }) {
  const heights = [10, 18, 12, 22, 8, 16, 14]
  return (
    <div className={playing ? 'playing' : ''} style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} className={active ? 'waveform-bar' : ''}
          style={{ width: 3, height: h, background: active ? 'var(--gold2)' : 'rgba(244,240,235,.2)', borderRadius: 2 }} />
      ))}
    </div>
  )
}

export default function BeatCard({ beat, index = 0 }) {
  const { currentBeat, isPlaying, loading, play } = usePlayer()
  const isActive = currentBeat?.id === beat.id
  const isThisPlaying = isActive && isPlaying
  const isLoading = isActive && loading

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, delay: index * .06 }}
      className={`beat-card ${isActive ? 'active' : ''}`}>

      {isActive && (
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--gold), var(--gold2))', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      )}

      {/* Cover */}
      <div style={{ position: 'relative', height: 200, background: 'var(--black2)', overflow: 'hidden' }}>
        {beat.cover
          ? <img src={beat.cover} alt={beat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={48} color="rgba(201,168,76,.2)" />
            </div>
          )
        }

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,.9) 0%, rgba(8,8,8,.3) 60%, transparent 100%)' }} />

        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
          <span className="tag tag-gold">{beat.genre}</span>
        </div>

        {beat.featured && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--gold)', color: 'var(--black)', padding: '.2rem .65rem', borderRadius: 2, fontFamily: "'DM Mono', monospace", fontSize: '.55rem', fontWeight: 700, letterSpacing: '.1em' }}>
            FEATURED
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'rgba(244,240,235,.5)' }}>
          {beat.bpm} BPM {beat.key && `· ${beat.key}`}
        </div>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.button
            onClick={() => play(beat)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: .9 }}
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: isActive ? 'var(--gold)' : 'rgba(8,8,8,.75)',
              border: `2px solid ${isActive ? 'var(--gold)' : 'rgba(244,240,235,.4)'}`,
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isActive ? '0 0 32px rgba(201,168,76,.4)' : 'none',
              transition: 'all .25s',
            }}>
            {isLoading
              ? <div style={{ width: 18, height: 18, border: '2px solid rgba(8,8,8,.4)', borderTopColor: '#080808', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              : isThisPlaying
                ? <Pause size={18} color={isActive ? '#080808' : '#f4f0eb'} fill={isActive ? '#080808' : '#f4f0eb'} />
                : <Play size={18} color={isActive ? '#080808' : '#f4f0eb'} fill={isActive ? '#080808' : '#f4f0eb'} style={{ marginLeft: 3 }} />
            }
          </motion.button>
          {isThisPlaying && (
            <div style={{ position: 'absolute', width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(201,168,76,.4)', animation: 'pulse-ring 1.5s ease-out infinite' }} />
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.8rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '.04em', color: 'var(--white)', marginBottom: '.1rem' }}>
              {beat.title}
            </h3>
            {beat.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                {beat.tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: '.5rem' }}>{t}</span>)}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: '.95rem', color: 'var(--gold)', flexShrink: 0, marginLeft: '.8rem' }}>
            {beat.price}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Waveform active={isActive} playing={isThisPlaying} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '.5rem' }}>
          <button onClick={() => play(beat)}
            style={{
              padding: '.65rem', background: 'var(--black2)',
              border: '1px solid var(--border)', borderRadius: 2,
              color: isActive ? 'var(--gold)' : 'var(--muted)',
              fontSize: '.75rem', letterSpacing: '.06em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = isActive ? 'var(--gold)' : 'var(--muted)' }}>
            {isThisPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isThisPlaying ? 'Stop' : '30s'}
          </button>
          <a href={getWALink(beat)} target="_blank" rel="noreferrer"
            className="btn-wa"
            style={{ borderRadius: 2, justifyContent: 'center', fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
            <ShoppingCart size={13} /> Acheter
          </a>
        </div>
      </div>
    </motion.div>
  )
}
