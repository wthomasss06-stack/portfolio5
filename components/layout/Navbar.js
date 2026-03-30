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

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [path])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64,
        background: scrolled ? 'rgba(8,8,8,.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(244,240,235,.07)' : '1px solid transparent',
        transition: 'all .4s',
        display: 'flex', alignItems: 'center',
        padding: '0 5%',
      }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem', letterSpacing: '.12em', color: '#f4f0eb', lineHeight: 1 }}>
            {BEATMAKER.pseudo}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.48rem', letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 2 }}>
            Beatmaker · Abidjan CI
          </span>
        </Link>

        {/* Desktop links */}
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

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)}
          style={{
            background: open ? 'rgba(201,168,76,.1)' : 'none',
            border: open ? '1px solid rgba(201,168,76,.3)' : '1px solid transparent',
            borderRadius: 4,
            color: '#f4f0eb', padding: '6px 8px',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          className="show-mobile"
          aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: .25, ease: [.22,1,.36,1] }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
              background: 'rgba(8,8,8,.98)', backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(244,240,235,.07)',
              padding: '1.5rem 5% 2rem',
            }}>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .06 }}>
                  <Link href={href} onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1rem 0',
                      borderBottom: '1px solid rgba(244,240,235,.05)',
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1.6rem', letterSpacing: '.08em',
                      color: path === href ? 'var(--gold)' : 'rgba(244,240,235,.8)',
                      transition: 'color .2s',
                    }}>
                    {label}
                    {path === href && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1.5rem' }}>
              <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer"
                className="btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '.85rem', padding: '.9rem' }}>
                <ShoppingBag size={15} /> Acheter un beat
              </a>
              <a href={`tel:${BEATMAKER.tel}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                  padding: '.75rem',
                  border: '1px solid rgba(244,240,235,.12)', borderRadius: 2,
                  fontFamily: "'DM Mono', monospace", fontSize: '.7rem',
                  letterSpacing: '.12em', color: 'var(--muted)',
                }}>
                📞 {BEATMAKER.tel}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

