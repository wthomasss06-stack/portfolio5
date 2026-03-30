'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, ArrowDown, Headphones, MessageCircle,
  Clock, FileAudio, BadgeCheck,
  Banknote, FolderOpen, Zap, Waves, Music, Heart,
} from 'lucide-react'
import { BEATMAKER, getBeats } from '@/lib/beats-data'
import BeatCard from '@/components/ui/BeatCard'


// ── HERO CAROUSEL ─────────────────────────────────────────────
const GENRE_SLIDES = [
  {
    genre: 'TRAP',
    label: 'Hard · 808s · Dark',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1400&q=80&auto=format&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(5,0,14,.82) 0%,rgba(18,0,40,.7) 45%,rgba(8,0,20,.85) 100%)',
    accent: '#c9a84c',
    icon: <Zap size={28} />,
    bpm: '140 BPM',
  },
  {
    genre: 'AFROBEAT',
    label: 'Vibe · Danse · CI',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=80&auto=format&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(10,7,0,.82) 0%,rgba(28,15,0,.7) 45%,rgba(10,6,0,.85) 100%)',
    accent: '#ff9d00',
    icon: <Waves size={28} />,
    bpm: '100 BPM',
  },
  {
    genre: 'UK DRILL',
    label: 'Cold · Dark · Slides',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&q=80&auto=format&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(2,4,6,.88) 0%,rgba(3,12,8,.75) 45%,rgba(2,6,4,.88) 100%)',
    accent: '#4ade80',
    icon: <Zap size={28} />,
    bpm: '140 BPM',
  },
  {
    genre: 'RNB',
    label: 'Smooth · Soul · Emotion',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1400&q=80&auto=format&fit=crop',
    overlay: 'linear-gradient(160deg,rgba(8,0,14,.84) 0%,rgba(20,0,34,.72) 45%,rgba(10,0,16,.87) 100%)',
    accent: '#c084fc',
    icon: <Heart size={28} />,
    bpm: '90 BPM',
  },
]

function HeroCarousel({ beats }) {
  const count = GENRE_SLIDES.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(c => (c + 1) % count), 4200)
  }, [count])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  return (
    <div
      onMouseEnter={() => { clearInterval(timerRef.current); setPaused(true) }}
      onMouseLeave={() => { setPaused(false); startTimer() }}
      style={{ position: 'relative', width: '100%' }}>

      {/* Slides */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
        <AnimatePresence mode="wait">
          {GENRE_SLIDES.map((slide, i) => {
            if (i !== active) return null
            const beat = beats[i] || null
            return (
              <motion.div
                key={slide.genre}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: .97 }}
                transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '16/7',
                  minHeight: 220,
                  display: 'flex',
                  alignItems: 'stretch',
                }}>

                {/* Real photo background */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />

                {/* Dark gradient overlay for readability */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: slide.overlay,
                }} />

                {/* Beat cover image bg (subtle blend) */}
                {beat?.cover && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${beat.cover})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: .12, filter: 'blur(4px)',
                  }} />
                )}

                {/* Grid overlay */}
                <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />

                {/* Content */}
                <div style={{
                  position: 'relative', zIndex: 2,
                  display: 'flex', alignItems: 'center',
                  width: '100%', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 5vw, 3.5rem)',
                  gap: 'clamp(1.5rem, 4vw, 3rem)',
                  flexWrap: 'wrap',
                }}>

                  {/* Beat cover card or genre placeholder */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: .15, duration: .5 }}
                    style={{
                      flexShrink: 0,
                      width: 'clamp(90px, 16vw, 160px)',
                      aspectRatio: '1/1',
                      border: `1px solid ${slide.accent}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,.4)',
                      backdropFilter: 'blur(8px)',
                    }}>
                    {beat?.cover ? (
                      <img src={beat.cover} alt={beat.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '.4rem', color: slide.accent,
                      }}>
                        {slide.icon}
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '.45rem', letterSpacing: '.15em',
                          color: slide.accent, textTransform: 'uppercase',
                        }}>{slide.bpm}</span>
                      </div>
                    )}
                    {/* Corner accents */}
                    <div style={{ position: 'absolute', top: '.4rem', left: '.4rem', width: 14, height: 14, borderTop: `2px solid ${slide.accent}`, borderLeft: `2px solid ${slide.accent}` }} />
                    <div style={{ position: 'absolute', bottom: '.4rem', right: '.4rem', width: 14, height: 14, borderBottom: `2px solid ${slide.accent}`, borderRight: `2px solid ${slide.accent}` }} />
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .2, duration: .5 }}
                    style={{ flex: 1, minWidth: 160 }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '.55rem', letterSpacing: '.2em',
                      color: slide.accent, textTransform: 'uppercase',
                      marginBottom: '.5rem',
                    }}>// {beat ? `Beat #${beat.id}` : 'Genre'} · {slide.bpm}</div>

                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                      lineHeight: .9, letterSpacing: '.02em',
                      color: '#f4f0eb', marginBottom: '.6rem',
                    }}>
                      {beat ? beat.title : slide.genre}
                    </h3>

                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {(beat?.tags?.length ? beat.tags.slice(0, 3) : slide.label.split(' · ')).map(t => (
                        <span key={t} style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '.52rem', letterSpacing: '.1em',
                          color: 'rgba(244,240,235,.5)',
                          border: '1px solid rgba(244,240,235,.1)',
                          padding: '.2rem .6rem', borderRadius: 1,
                        }}>{t}</span>
                      ))}
                    </div>

                    <Link href="/beats" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                      padding: '.6rem 1.4rem',
                      background: slide.accent,
                      color: '#080808',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700, fontSize: '.75rem',
                      letterSpacing: '.06em', textTransform: 'uppercase',
                      borderRadius: 2, transition: 'opacity .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      <Headphones size={13} />
                      {beat ? 'Ecouter ce beat' : `Ecouter les ${slide.genre}`}
                    </Link>
                  </motion.div>

                  {/* Price badge if beat */}
                  {beat?.price && (
                    <motion.div
                      initial={{ opacity: 0, scale: .8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: .35 }}
                      style={{
                        flexShrink: 0, alignSelf: 'flex-start',
                        border: `1px solid ${slide.accent}60`,
                        padding: '.8rem 1.2rem',
                        background: `${slide.accent}12`,
                        backdropFilter: 'blur(8px)',
                        textAlign: 'center',
                      }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.5rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.2rem' }}>Prix</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: slide.accent, lineHeight: 1 }}>{beat.price}</div>
                    </motion.div>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(244,240,235,.06)' }}>
                  <motion.div
                    key={`${active}-progress`}
                    initial={{ scaleX: 0 }} animate={{ scaleX: paused ? undefined : 1 }}
                    transition={{ duration: 4.2, ease: 'linear' }}
                    style={{ height: '100%', background: slide.accent, transformOrigin: 'left', scaleX: 0 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  const [beats, setBeats] = useState([])
  useEffect(() => {
    getBeats().then(data => setBeats(data.slice(0, 4)))
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 5% 6vw',
      position: 'relative', overflow: 'hidden',
      background: 'var(--black)',
    }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .6, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vw', background: 'radial-gradient(ellipse, rgba(201,168,76,.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <motion.div
        animate={{ top: ['-4%', '104%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)', zIndex: 1, pointerEvents: 'none' }}
      />

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
        style={{ position: 'absolute', top: '10vh', left: '5%', zIndex: 2, display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', animation: 'dot-blink 1.4s ease-in-out infinite', display: 'inline-block' }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.6rem', letterSpacing: '.18em', color: 'rgba(201,168,76,.8)', textTransform: 'uppercase' }}>
          Beats disponibles · Abidjan CI
        </span>
      </motion.div>

      {/* Counter top right */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
        style={{ position: 'absolute', top: '10vh', right: '5%', zIndex: 2, textAlign: 'right' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Genres</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--white)', lineHeight: 1 }}>Trap · Afro · Drill</div>
      </motion.div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1, ease: [.22,1,.36,1] }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>// Beatmaker professionnel</div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            lineHeight: .88, letterSpacing: '.01em',
            color: 'var(--white)',
            marginBottom: '2rem',
          }}>
            MANO <span style={{ WebkitTextStroke: '1px rgba(244,240,235,.25)', color: 'transparent' }}>BEAT777</span>
          </h1>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }}
          style={{ marginBottom: '2.5rem' }}>
          <HeroCarousel beats={beats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .5 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.75, maxWidth: 380, fontWeight: 300 }}>
            Des instrumentales de qualité studio. Ecoute 30s, achète direct.
            Livraison fichier le jour même via WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
            <Link href="/beats" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
              <Headphones size={15} /> Explorer les beats
            </Link>
            <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '2.5rem', right: '5%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.5rem', letterSpacing: '.15em', color: 'var(--muted)', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>scroll</span>
        <ArrowDown size={14} color="var(--muted)" />
      </motion.div>
    </section>
  )
}

// ── MARQUEE ───────────────────────────────────────────────────
function Marquee() {
  const items = ['Trap', 'Afrobeat', 'Drill', 'RnB', 'Coupé-Décalé', 'Dancehall', 'Cloud Rap', 'Wave CI', 'MoMo', 'Abidjan', 'CI', 'Studio Quality']
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0', overflow: 'hidden', background: 'var(--black2)' }}>
      <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content', gap: '3rem', alignItems: 'center' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '.12em', color: i % 3 === 0 ? 'var(--gold)' : 'rgba(244,240,235,.2)', whiteSpace: 'nowrap' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── STATS ─────────────────────────────────────────────────────
function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const items = [
    { val: '30S', label: 'Preview gratuit', icon: <Headphones size={16} color="var(--gold)" /> },
    { val: '24H', label: 'Livraison fichier', icon: <Clock size={16} color="var(--gold)" /> },
    { val: '100%', label: 'Qualité studio', icon: <BadgeCheck size={16} color="var(--gold)" /> },
    { val: 'WAV', label: 'Format pro', icon: <FileAudio size={16} color="var(--gold)" /> },
  ]
  return (
    <section ref={ref} style={{ padding: '6rem 5%', background: 'var(--black)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="stats-grid">
        {items.map(({ val, label, icon }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '2.5rem 2rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className={`stat-item stat-item-${i}`}>
            <div style={{ marginBottom: '.6rem' }}>{icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--gold)', lineHeight: 1, marginBottom: '.4rem' }}>{val}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── FEATURED BEATS ───────────────────────────────────────────
function FeaturedBeats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBeats().then(data => {
      setBeats(data.filter(b => b.featured).slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <section id="featured" ref={ref} style={{ padding: '6rem 5%', background: 'var(--black2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-label">// Top instrus</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--white)', lineHeight: .95 }}>
              BEATS EN CE<br />MOMENT
            </h2>
          </div>
          <Link href="/beats" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontFamily: "'DM Mono', monospace", fontSize: '.7rem', color: 'var(--gold)', letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--gold)', paddingBottom: 2 }}>
            Voir tout <ArrowRight size={12} />
          </Link>
        </motion.div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 360, background: 'linear-gradient(90deg,var(--black3) 25%,var(--black4) 50%,var(--black3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
          </div>
        ) : beats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '.75rem' }}>
            Aucun beat featured pour l'instant.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {beats.map((beat, i) => <BeatCard key={beat.id} beat={beat} index={i} />)}
          </div>
        )}
      </div>
    </section>
  )
}

// ── ABOUT TEASER ─────────────────────────────────────────────
function AboutTeaser() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '8rem 5%', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .4 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="about-teaser-grid">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .7 }}>
            <div style={{ aspectRatio: '4/5', background: 'var(--black3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12rem', color: 'rgba(244,240,235,.03)', userSelect: 'none', lineHeight: 1, textAlign: 'center' }}>M77</div>
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: 40, height: 40, borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: 40, height: 40, borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--black)', padding: '.6rem 1.5rem', whiteSpace: 'nowrap', fontFamily: "'DM Mono', monospace", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em' }}>
                ABIDJAN CI · STUDIO
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .7, delay: .15 }}>
            <div className="section-label">// A propos</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: .9, color: 'var(--white)', marginBottom: '1.8rem' }}>
              BEATS FAITS<br />POUR FRAPPER
            </h2>
            <p style={{ fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: '1rem' }}>
              Je suis <strong style={{ color: 'var(--white)', fontWeight: 500 }}>Mano beat777</strong>, beatmaker basé à Abidjan.
              Je produis des instrus Trap, Afro et Drill pensées pour les artistes qui veulent sortir du lot.
            </p>
            <p style={{ fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
              Sonorités actuelles, mix propre, livraison rapide. Chaque beat est 100% libre de droits à l'achat.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '2rem' }}>
              {['Trap', 'Afrobeat', 'UK Drill', 'RnB', 'Coupé-Décalé'].map(g => <span key={g} className="tag">{g}</span>)}
            </div>
            <Link href="/about" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
              En savoir plus <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── HOW IT WORKS ─────────────────────────────────────────────
function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const steps = [
    { n: '01', icon: <Headphones size={28} color="var(--gold)" />, title: 'Tu écoutes', desc: "Preview 30 secondes pour chaque beat. Tu sens l'énergie avant de t'engager." },
    { n: '02', icon: <MessageCircle size={28} color="var(--gold)" />, title: 'Tu contactes', desc: "Clique Acheter — WhatsApp s'ouvre avec le nom du beat déjà écrit." },
    { n: '03', icon: <Banknote size={28} color="var(--gold)" />, title: 'Tu paies', desc: 'Wave ou MoMo. Rapide, sécurisé. Pas de compte à créer, pas de plateforme.' },
    { n: '04', icon: <FolderOpen size={28} color="var(--gold)" />, title: 'Tu reçois', desc: 'WAV ou MP3, livré dans la journée. Tu démarres direct sur ton projet.' },
  ]
  return (
    <section ref={ref} style={{ background: 'var(--black3)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ padding: '4rem 5% 0' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            <div className="section-label">// Processus</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--white)' }}>COMMENT CA MARCHE</h2>
          </motion.div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border)', marginTop: '2.5rem' }} className="process-grid">
          {steps.map(({ n, icon, title, desc }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
              style={{ padding: '2.5rem 2rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }} className={`process-item process-item-${i}`}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: 'rgba(201,168,76,.08)', lineHeight: 1, marginBottom: '.5rem' }}>{n}</div>
              <div style={{ marginBottom: '.8rem' }}>{icon}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.95rem', color: 'var(--white)', marginBottom: '.5rem' }}>{title}</div>
              <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function CtaFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ background: 'var(--gold)', padding: '8rem 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.62rem', letterSpacing: '.2em', color: 'rgba(8,8,8,.5)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>// Ton prochain hit</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: .88, color: 'var(--black)', marginBottom: '2rem' }}>
          COMMENCE<br />ICI.
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(8,8,8,.6)', maxWidth: 480, margin: '0 auto 2.5rem' }}>
          Pas d'abonnement. Pas de système compliqué. Tu écoutes, tu kiffes, tu achètes.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/beats" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '1rem 2.5rem', background: 'var(--black)', color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.9rem', letterSpacing: '.06em', textTransform: 'uppercase', borderRadius: 2 }}>
            <Headphones size={16} /> Explorer les beats
          </Link>
          <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '1rem 2.5rem', background: 'transparent', color: 'var(--black)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.9rem', letterSpacing: '.06em', textTransform: 'uppercase', border: '2px solid rgba(8,8,8,.3)', borderRadius: 2 }}>
            <MessageCircle size={16} /> WhatsApp direct
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <FeaturedBeats />
      <AboutTeaser />
      <Process />
      <CtaFinal />
    </>
  )
}
