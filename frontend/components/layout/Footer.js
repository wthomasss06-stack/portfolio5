'use client'
import Link from 'next/link'
import { MessageCircle, Instagram } from 'lucide-react'
import { BEATMAKER } from '@/lib/beats-data'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--black)', borderTop: '1px solid var(--border)', padding: '4rem 5% 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '.06em', color: 'var(--white)', lineHeight: 1, marginBottom: '.5rem' }}>
              DIALLO ROGER<br />MANASSÉ
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 280, marginBottom: '1.5rem' }}>
              {BEATMAKER.tagline} · Beats de qualité studio, disponibles directement sur WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { label: 'IG', url: BEATMAKER.instagram },
                { label: 'TK', url: BEATMAKER.tiktok },
                { label: 'YT', url: BEATMAKER.youtube },
              ].map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer"
                  style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'var(--muted)', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <div className="section-label" style={{ marginBottom: '1.2rem' }}>Navigation</div>
            {[{ label: 'Accueil', href: '/' }, { label: 'Beats', href: '/beats' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map(({ label, href }) => (
              <Link key={href} href={href}
                style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.6rem', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="section-label" style={{ marginBottom: '1.2rem' }}>Contact</div>
            <a href={`https://wa.me/${BEATMAKER.whatsapp}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.6rem', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#25d366'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a href={BEATMAKER.instagram} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem', color: 'var(--muted)', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <Instagram size={13} /> Instagram
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'rgba(244,240,235,.2)', letterSpacing: '.08em' }}>
            © 2025 DIALLO ROGER MANASSÉ · ABIDJAN CI
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'rgba(201,168,76,.3)', letterSpacing: '.08em' }}>
            TRAP · AFRO · DRILL · RNB
          </span>
          <Link href="/admin"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '.58rem', color: 'rgba(244,240,235,.12)', letterSpacing: '.08em', transition: 'color .2s', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(201,168,76,.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,240,235,.12)'}>
            ADMINISTRATION
          </Link>
        </div>
      </div>

    </footer>
  )
}
