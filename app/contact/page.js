'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink, MessageCircle, Instagram,
  Music2, Youtube, Play,
  CreditCard, FileAudio, Clock, BadgeCheck
} from 'lucide-react'
import { BEATMAKER, getBeats } from '@/lib/beats-data'

export default function ContactPage() {
  const [beats, setBeats] = useState([])

  useEffect(() => {
    getBeats().then(setBeats)
  }, [])

  const socials = [
    { name: 'WhatsApp', icon: <MessageCircle size={28} color="#25d366" />, url: `https://wa.me/${BEATMAKER.whatsapp}`, desc: 'Acheter un beat, beat custom, questions' },
    { name: 'Instagram', icon: <Instagram size={28} color="var(--muted)" />, url: BEATMAKER.instagram, desc: 'Previews & behind-the-scenes' },
    { name: 'TikTok', icon: <Music2 size={28} color="var(--muted)" />, url: BEATMAKER.tiktok, desc: 'Clips de création, challenges' },
    { name: 'YouTube', icon: <Youtube size={28} color="var(--muted)" />, url: BEATMAKER.youtube, desc: 'Beats en full & type beats' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 68 }}>

      {/* Header */}
      <section style={{ padding: '5rem 5% 4rem', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .4 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">// Contact</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(4rem, 10vw, 9rem)', lineHeight: .88, color: 'var(--white)', marginBottom: '1.5rem' }}>
              ON BOSSE<br />
              <span style={{ color: 'var(--gold)' }}>ENSEMBLE ?</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: 480, lineHeight: 1.7 }}>
              {BEATMAKER.bio} · Disponible pour des beats standards et des productions custom.
            </p>
          </motion.div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Left */}
          <div>
            {/* Big WA CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
              style={{ background: '#25d366', padding: '3rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '8rem', color: 'rgba(0,0,0,.06)', lineHeight: 1, userSelect: 'none' }}>WA</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#fff', letterSpacing: '.04em', marginBottom: '.5rem' }}>
                  WHATSAPP DIRECT
                </h2>
                <p style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.8)', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Tu envoies un message, on discute du beat, tu paies par Wave ou MoMo, je t'envoie le fichier complet.
                </p>
                <a href={`https://wa.me/${BEATMAKER.whatsapp}?text=${encodeURIComponent('Bonjour ! Je veux acheter un beat.')}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '1rem 2rem', background: '#fff', color: '#25d366', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '.88rem', letterSpacing: '.06em', textTransform: 'uppercase', borderRadius: 2 }}>
                  <MessageCircle size={16} /> Ouvrir WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Socials */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
              {socials.map(({ name, icon, url, desc }, i) => (
                <motion.a key={name} href={url} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .07 }}
                  style={{ padding: '1.5rem', background: 'var(--black3)', display: 'block', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--black4)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--black3)'}>
                  <div style={{ marginBottom: '.6rem' }}>{icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.9rem', color: 'var(--white)', marginBottom: '.2rem' }}>{name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                  <div style={{ marginTop: '.8rem', display: 'flex', alignItems: 'center', gap: '.3rem', fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'var(--gold)' }}>
                    Ouvrir <ExternalLink size={9} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right - Beat list */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 }}>
            <div className="section-label" style={{ marginBottom: '1.2rem' }}>// Acheter un beat précis</div>
            <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Clique pour ouvrir WhatsApp avec le nom du beat déjà écrit.
            </p>

            {beats.length > 0 ? (
              <div style={{ border: '1px solid var(--border)' }}>
                {beats.map((beat, i) => (
                  <a key={beat.id}
                    href={`https://wa.me/${BEATMAKER.whatsapp}?text=${encodeURIComponent(`Bonjour ! Je veux acheter le beat "${beat.title}" (${beat.price}).`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', borderBottom: i < beats.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--black3)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                      <Music2 size={18} color="rgba(201,168,76,.4)" />
                      <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.85rem', color: 'var(--white)' }}>{beat.title}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'var(--muted)', letterSpacing: '.06em' }}>{beat.genre}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: '.82rem', color: 'var(--gold)', flexShrink: 0 }}>{beat.price}</div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'rgba(244,240,235,.05)', marginBottom: '.5rem' }}>NO BEATS</div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'var(--muted)' }}>
                  Aucun beat disponible pour l'instant.<br />Reviens bientôt.
                </p>
              </div>
            )}

            {/* Info box */}
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--black3)', border: '1px solid var(--border2)' }}>
              <div className="section-label" style={{ marginBottom: '.8rem', color: 'var(--gold)' }}>// Infos utiles</div>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}><CreditCard size={13} /> Paiement : Wave · Orange Money · MTN MoMo</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}><FileAudio size={13} /> Format livré : WAV 24bit + MP3 320kbps</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}><Clock size={13} /> Délai de livraison : moins de 24h</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><BadgeCheck size={13} /> Beat 100% libre de droits à l'achat</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style suppressHydrationWarning>{`
        @media(max-width:768px){
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
