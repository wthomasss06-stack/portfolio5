'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { BEATMAKER } from '@/lib/beats-data'

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Beats', href: '/beats' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const path = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 68,
        background: scrolled ? 'rgba(8,8,8,.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(244,240,235,.06)' : '1px solid transparent',
        transition: 'all .4s',
        display: 'flex', alignItems: 'center',
        padding: '0 5%',
      }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.35rem', letterSpacing: '.12em', color: '#f4f0eb', lineHeight: 1 }}>
            DIALLO ROGER MANASSÉ
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.5rem', letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 2 }}>
            Beatmaker · Abidjan CI
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hide-mobile">
          {LINKS.map(({ label, href }) => {
            const active = path === href
            return (
              <Link key={href} href={href} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '.8rem', fontWeight: 500,
                letterSpacing: '.08em', textTransform: 'uppercase',
                color: active ? 'var(--gold)' : 'rgba(244,240,235,.5)',
                borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: 2, transition: 'color .2s, border-color .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f4f0eb' }}
              onMouseLeave={e => { e.currentTarget.style.color = active ? 'var(--gold)' : 'rgba(244,240,235,.5)' }}>
                {label}
              </Link>
            )
          })}
          <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer"
            className="btn-gold" style={{ padding: '.55rem 1.4rem', fontSize: '.75rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
            <ShoppingBag size={13} /> Acheter
          </a>
        </div>

        <button onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: '#f4f0eb', display: 'none', padding: 4 }}
          className="show-mobile">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
              background: 'rgba(8,8,8,.98)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(244,240,235,.06)',
              padding: '2rem 5%',
            }}>
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '1.1rem 0', borderBottom: '1px solid rgba(244,240,235,.06)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '.08em', color: path === href ? 'var(--gold)' : 'rgba(244,240,235,.7)' }}>
                {label}
              </Link>
            ))}
            <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer"
              className="btn-gold" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <ShoppingBag size={15} /> Acheter un beat
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
