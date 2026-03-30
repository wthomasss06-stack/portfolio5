'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { getBeats } from '@/lib/beats-data'
import BeatCard from '@/components/ui/BeatCard'

export default function BeatsPage() {
  const [allBeats, setAllBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Tous')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    getBeats().then(data => { setAllBeats(data); setLoading(false) })
  }, [])

  const genres = ['Tous', ...new Set(allBeats.map(b => b.genre).filter(Boolean))]

  const filtered = allBeats
    .filter(b => {
      const q = search.toLowerCase()
      return (b.title?.toLowerCase().includes(q) || b.genre?.toLowerCase().includes(q))
        && (genre === 'Tous' || b.genre === genre)
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return parseInt(a.price) - parseInt(b.price)
      if (sortBy === 'price-desc') return parseInt(b.price) - parseInt(a.price)
      if (sortBy === 'bpm-asc')    return (a.bpm || 0) - (b.bpm || 0)
      if (sortBy === 'bpm-desc')   return (b.bpm || 0) - (a.bpm || 0)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 68 }}>

      {/* Header */}
      <div style={{ padding: '5rem 5% 3rem', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .5 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">// Catalogue</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: 'var(--white)', lineHeight: .9, marginBottom: '1rem' }}>
              TOUTES LES<br />
              <span style={{ WebkitTextStroke: '1px rgba(244,240,235,.2)', color: 'transparent' }}>INSTRUMENTALES</span>
            </h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '.7rem', color: 'var(--muted)', letterSpacing: '.1em' }}>
              {loading ? '...' : `${allBeats.length} beat${allBeats.length > 1 ? 's' : ''} disponible${allBeats.length > 1 ? 's' : ''}`} · Preview 30s · Achat WhatsApp
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters sticky */}
      <div style={{
        position: 'sticky', top: 68, zIndex: 100,
        background: 'rgba(8,8,8,.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={13} style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un beat..."
              style={{ width: '100%', padding: '.6rem .8rem .6rem 2.3rem', background: 'var(--black3)', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--white)', fontFamily: "'DM Sans', sans-serif", fontSize: '.82rem', outline: 'none', transition: 'border-color .2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.4)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Genre filters */}
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
            {genres.map(g => (
              <button key={g} onClick={() => setGenre(g)}
                style={{ padding: '.38rem .9rem', borderRadius: 2, border: `1px solid ${genre === g ? 'var(--gold)' : 'var(--border)'}`, background: genre === g ? 'rgba(201,168,76,.12)' : 'transparent', color: genre === g ? 'var(--gold)' : 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                {g}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '.5rem .8rem', background: 'var(--black3)', border: '1px solid var(--border)', borderRadius: 2, color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '.6rem', letterSpacing: '.06em', cursor: 'pointer', outline: 'none' }}>
            <option value="default">Populaires</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
            <option value="bpm-asc">BPM ↑</option>
            <option value="bpm-desc">BPM ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 5%' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 380, background: 'linear-gradient(90deg, var(--black3) 25%, var(--black4) 50%, var(--black3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i*.1}s` }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
                {filtered.map((beat, i) => <BeatCard key={beat.id} beat={beat} index={i} />)}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '6rem 0' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', color: 'rgba(244,240,235,.05)', marginBottom: '1rem' }}>
                  VIDE
                </div>
                <p style={{ fontFamily: "'DM Mono', monospace", color: 'var(--muted)', fontSize: '.75rem', marginBottom: '1.5rem' }}>
                  {allBeats.length === 0 ? 'Aucun beat pour l\'instant.' : 'Aucun résultat pour cette recherche.'}
                </p>
                {allBeats.length > 0 && (
                  <button onClick={() => { setSearch(''); setGenre('Tous') }}
                    className="btn-outline" style={{ fontSize: '.78rem' }}>
                    Réinitialiser
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
