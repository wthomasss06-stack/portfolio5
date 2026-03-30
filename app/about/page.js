'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Headphones, MessageCircle } from 'lucide-react'
import { BEATMAKER } from '@/lib/beats-data'

const GENRES = [
  { name: 'Trap', desc: 'Hi-hats rapides, basses lourdes, atmosphères sombres' },
  { name: 'Afrobeat', desc: 'Percussions rythmées, mélodies ensoleillées, énergie CI' },
  { name: 'UK Drill', desc: 'Dark, slides chromatos, 808s percutantes' },
  { name: 'RnB Afro', desc: 'Grooves soul, mélodies douces, ambiance romantique' },
  { name: 'Coupé-Décalé', desc: 'Rythmes ivoiriens fusionnés aux sonorités modernes' },
  { name: 'Dancehall', desc: 'Vibes caribéennes adaptées au marché africain' },
]

const PROCESS = [
  { n: '01', title: 'Création', desc: 'Je commence par une boucle mélodique ou une ligne de drums. Chaque beat part d\'une émotion, pas d\'un template.' },
  { n: '02', title: 'Production', desc: 'Arrangement complet, layering des sons, automation, dynamiques. Durée : 30min à 3h selon la complexité.' },
  { n: '03', title: 'Mix', desc: 'Balance, compression, EQ, saturation. Le mix est fait pour être percutant sur n\'importe quel système audio.' },
  { n: '04', title: 'Livraison', desc: 'Export WAV 24bit/44.1kHz + MP3 320kbps. Tu as les deux formats pour tous tes besoins.' },
]

export default function AboutPage() {
  const heroRef = useRef(null)
  const genreRef = useRef(null)
  const processRef = useRef(null)

  const genreInView = useInView(genreRef, { once: true, margin: '-60px' })
  const processInView = useInView(processRef, { once: true, margin: '-60px' })

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: 68 }}>

      {/* HERO */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'flex-end', padding: '0 5% 6vw', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 30% 70%, rgba(201,168,76,.05), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="section-label" style={{ position: 'absolute', top: '-35vh', left: 0 }}>// À propos</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 13vw, 12rem)', lineHeight: .88, color: 'var(--white)', marginBottom: '3rem' }}>
              BEATMAKER<br />
              <span style={{ color: 'var(--gold)' }}>ABIDJAN</span><br />
              <span style={{ WebkitTextStroke: '1px rgba(244,240,235,.15)', color: 'transparent' }}>STUDIO</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', alignItems: 'end' }} className="about-hero-grid">
              <div>
                <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
                  Je suis <strong style={{ color: 'var(--white)', fontWeight: 500 }}>Mano beat777</strong>,
                  beatmaker basé à Abidjan. Ma mission : créer des instrumentales qui donnent aux artistes
                  ivoiriens et africains les outils sonores pour exprimer leur art à un niveau international.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/beats" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                    <Headphones size={14} /> Voir les beats
                  </Link>
                  <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                    <MessageCircle size={14} /> Contact direct
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }} className="about-hero-photo">
                {[
                  { val: '100%', label: 'Libre de droits' },
                  { val: '24H', label: 'Livraison max' },
                  { val: 'WAV', label: 'Format studio' },
                ].map(({ val, label }) => (
                  <div key={label} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GENRES */}
      <section ref={genreRef} style={{ padding: '6rem 5%', background: 'var(--black2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={genreInView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '3rem' }}>
            <div className="section-label">// Spécialités</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--white)' }}>
              MES GENRES
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {GENRES.map(({ name, desc }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0 }} animate={genreInView ? { opacity: 1 } : {}} transition={{ delay: i * .08 }}
                style={{ padding: '2rem', background: 'var(--black2)', transition: 'background .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--black3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--black2)'}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--white)', marginBottom: '.5rem', letterSpacing: '.04em' }}>
                  {name}
                </div>
                <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section ref={processRef} style={{ padding: '6rem 5%', background: 'var(--black)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={processInView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '3rem' }}>
            <div className="section-label">// Workflow</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--white)' }}>
              MON PROCESSUS
            </h2>
          </motion.div>

          <div>
            {PROCESS.map(({ n, title, desc }, i) => (
              <motion.div key={n}
                initial={{ opacity: 0, x: -20 }} animate={processInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * .1 }}
                style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', padding: '2rem 0', borderBottom: '1px solid var(--border)', alignItems: 'start' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: 'rgba(201,168,76,.2)', lineHeight: 1 }}>{n}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1.05rem', color: 'var(--white)', marginBottom: '.4rem' }}>{title}</div>
                  <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 5%', background: 'var(--black3)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="section-label" style={{ textAlign: 'center' }}>// Prêt à démarrer ?</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--white)', marginBottom: '1rem' }}>
            TON PROCHAIN PROJET
          </h2>
          <p style={{ fontSize: '.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            Écoute les instrus disponibles ou contacte moi directement pour un beat custom.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/beats" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}><Headphones size={14} /> Voir le catalogue</Link>
            <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline">Beat custom</a>
          </div>
        </div>
      </section>
    </div>
  )
}
