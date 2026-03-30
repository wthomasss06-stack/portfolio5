'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, LogOut, Plus, Pencil, Trash2, Star, StarOff,
  Upload, X, Check, AlertCircle, Music2, ChevronDown,
  Eye, EyeOff, Loader2, ImageIcon, Link2
} from 'lucide-react'
import { API_URL } from '@/lib/beats-data'

// ── Mot de passe admin côté frontend (simple protection UI)
// Le vrai contrôle d'accès reste sur Flask (/login)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'changez-moi'

// Helper fetch avec clé admin dans header
const adminFetch = (url, opts = {}) => {
  const headers = { 'X-Admin-Key': ADMIN_PASSWORD, ...(opts.headers || {}) }
  return fetch(url, { ...opts, headers })
}

// ── Genres disponibles
const GENRES = ['Trap', 'Afrobeat', 'UK Drill', 'RnB', 'Coupé-Décalé', 'Dancehall', 'Cloud Rap']

// ── Clés pour tonalités
const KEYS = ['', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
              'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm']

// ─────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .5 }} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(201,168,76,.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, border: '1px solid var(--border2)', background: 'var(--gold-dim)', marginBottom: '1.5rem' }}>
            <Lock size={22} color="var(--gold)" />
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', letterSpacing: '.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '.5rem' }}>
            // Espace admin
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', letterSpacing: '.06em', color: 'var(--white)', lineHeight: 1 }}>
            DRIP BEATZ<br />
            <span style={{ WebkitTextStroke: '1px rgba(244,240,235,.2)', color: 'transparent' }}>STUDIO</span>
          </h1>
        </div>

        {/* Form */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: .4 }}>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              placeholder="Mot de passe admin"
              autoFocus
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 1.2rem',
                background: 'var(--black3)',
                border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                color: 'var(--white)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '.85rem',
                letterSpacing: '.08em',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(201,168,76,.4)' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)' }}
            />
            <button
              onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.8rem', fontFamily: "'DM Mono', monospace", fontSize: '.62rem', color: 'var(--red)', letterSpacing: '.06em' }}>
              <AlertCircle size={13} /> Mot de passe incorrect
            </motion.div>
          )}

          <button
            onClick={attempt}
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '.85rem', letterSpacing: '.1em' }}>
            <Lock size={15} /> Accéder au dashboard
          </button>
        </motion.div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: 'rgba(244,240,235,.15)', letterSpacing: '.08em' }}>
          DRIP BEATZ · ADMIN PANEL · ABIDJAN CI
        </p>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BEAT FORM (add / edit)
// ─────────────────────────────────────────────────────────────
function BeatForm({ beat, onSave, onCancel }) {
  const isEdit = !!beat
  const [form, setForm] = useState({
    title:    beat?.title    || '',
    genre:    beat?.genre    || GENRES[0],
    bpm:      beat?.bpm      || '',
    key:      beat?.key      || '',
    price:    beat?.price    || '',
    drive_id: beat?.driveId  || '',
    tags:     beat?.tags?.join(', ') || '',
    featured: beat?.featured || false,
  })
  const [cover, setCover] = useState(null)
  const [preview, setPreview] = useState(beat?.cover || null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const pickFile = e => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setErr('Image max 5 MB'); return }
    setCover(f)
    setPreview(URL.createObjectURL(f))
    setErr('')
  }

  const submit = async () => {
    if (!form.title.trim()) { setErr('Le titre est obligatoire'); return }
    if (!form.drive_id.trim()) { setErr('Le lien Google Drive est obligatoire'); return }
    if (!form.price.trim()) { setErr('Le prix est obligatoire'); return }
    setLoading(true)
    setErr('')

    // On passe par le backend Flask directement
    // Le front n'a pas de session Flask → on utilise l'endpoint /api/admin/*
    // (à créer) OU on appelle le formulaire HTML Flask via fetch avec credentials
    // Solution simple : appeler /api/beats/add ou /api/beats/<id>/edit
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('admin_key', ADMIN_PASSWORD)
      if (cover) fd.append('cover', cover)

      const url = isEdit
        ? `${API_URL}/api/beats/${beat.id}/edit`
        : `${API_URL}/api/beats/add`

      const res = await adminFetch(url, { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erreur serveur')
      }
      onSave()
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '.75rem 1rem',
    background: 'var(--black)',
    border: '1px solid var(--border)',
    color: 'var(--white)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '.85rem',
    outline: 'none',
    borderRadius: 2,
    transition: 'border-color .2s',
  }
  const labelStyle = {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: '.55rem',
    letterSpacing: '.12em',
    color: 'var(--gold)',
    textTransform: 'uppercase',
    marginBottom: '.4rem',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--black2)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', letterSpacing: '.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '.3rem' }}>
            {isEdit ? '// Modifier le beat' : '// Nouveau beat'}
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--white)', letterSpacing: '.04em' }}>
            {isEdit ? form.title || 'BEAT' : 'AJOUTER UN BEAT'}
          </h2>
        </div>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Colonne gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {/* Titre */}
          <div>
            <label style={labelStyle}>Titre du beat *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="ex: DARK ABIDJAN"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Prix */}
          <div>
            <label style={labelStyle}>Prix *</label>
            <input
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="ex: 15 000 FCFA"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Lien Drive */}
          <div>
            <label style={labelStyle}>Lien Google Drive (audio) *</label>
            <div style={{ position: 'relative' }}>
              <Link2 size={13} style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                value={form.drive_id}
                onChange={e => set('drive_id', e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                style={{ ...inputStyle, paddingLeft: '2.3rem' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <p style={{ marginTop: '.4rem', fontFamily: "'DM Mono', monospace", fontSize: '.52rem', color: 'var(--muted)', letterSpacing: '.04em' }}>
              Colle le lien complet — l'ID est extrait automatiquement
            </p>
          </div>

          {/* Genre */}
          <div>
            <label style={labelStyle}>Genre</label>
            <div style={{ position: 'relative' }}>
              <select
                value={form.genre}
                onChange={e => set('genre', e.target.value)}
                style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* BPM + Key */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>BPM</label>
              <input
                type="number"
                value={form.bpm}
                onChange={e => set('bpm', e.target.value)}
                placeholder="140"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Tonalité</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.key}
                  onChange={e => set('key', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}>
                  {KEYS.map(k => <option key={k} value={k}>{k || '—'}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags (séparés par virgule)</label>
            <input
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="dark, hype, 808"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Featured */}
          <div>
            <label
              onClick={() => set('featured', !form.featured)}
              style={{ display: 'flex', alignItems: 'center', gap: '.8rem', cursor: 'pointer', userSelect: 'none' }}>
              <div style={{
                width: 20, height: 20,
                border: `1px solid ${form.featured ? 'var(--gold)' : 'var(--border)'}`,
                background: form.featured ? 'var(--gold)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s', flexShrink: 0,
              }}>
                {form.featured && <Check size={12} color="var(--black)" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.62rem', color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                Beat mis en avant (Featured)
              </span>
            </label>
          </div>
        </div>

        {/* Colonne droite — Cover */}
        <div>
          <label style={labelStyle}>Image cover</label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', aspectRatio: '1/1',
              border: `1px dashed ${preview ? 'var(--gold)' : 'var(--border)'}`,
              background: 'var(--black)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'border-color .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = preview ? 'var(--gold)' : 'var(--border)'}>
            {preview ? (
              <>
                <img src={preview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <Upload size={24} color="var(--white)" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.6rem', color: 'var(--white)', marginTop: '.4rem', letterSpacing: '.08em' }}>Changer</span>
                </div>
              </>
            ) : (
              <>
                <ImageIcon size={32} color="rgba(201,168,76,.3)" />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.6rem', color: 'var(--muted)', marginTop: '.8rem', letterSpacing: '.08em', textAlign: 'center', padding: '0 1rem' }}>
                  Cliquer pour uploader<br />PNG / JPG / WEBP · max 5 MB
                </span>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} style={{ display: 'none' }} />

          {preview && (
            <button
              onClick={() => { setCover(null); setPreview(null) }}
              style={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.3rem', background: 'none', border: 'none', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '.55rem', letterSpacing: '.08em', cursor: 'pointer' }}>
              <X size={11} /> Supprimer la cover
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {err && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '1.2rem', padding: '.8rem 1rem', background: 'rgba(200,56,42,.1)', border: '1px solid rgba(200,56,42,.3)', fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'var(--red)', letterSpacing: '.06em' }}>
          <AlertCircle size={14} /> {err}
        </motion.div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="btn-outline" style={{ fontSize: '.8rem', padding: '.7rem 1.5rem' }}>
          Annuler
        </button>
        <button onClick={submit} className="btn-gold" style={{ fontSize: '.8rem', padding: '.7rem 1.8rem', minWidth: 140, justifyContent: 'center' }} disabled={loading}>
          {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={15} />}
          {loading ? 'Envoi...' : isEdit ? 'Mettre à jour' : 'Ajouter le beat'}
        </button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// BEAT ROW
// ─────────────────────────────────────────────────────────────
function BeatRow({ beat, onEdit, onDelete, onToggleFeatured }) {
  const [delConfirm, setDelConfirm] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 100px 120px 90px 120px',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.2rem',
        borderBottom: '1px solid var(--border)',
        transition: 'background .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--black3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* Cover thumbnail */}
      <div style={{ width: 48, height: 48, background: 'var(--black3)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
        {beat.cover
          ? <img src={beat.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music2 size={16} color="rgba(201,168,76,.3)" /></div>
        }
      </div>

      {/* Title + genre */}
      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '.04em', color: 'var(--white)' }}>{beat.title}</div>
        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', marginTop: '.15rem' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: 'var(--muted)', letterSpacing: '.06em' }}>{beat.genre}</span>
          {beat.bpm && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '.5rem', color: 'rgba(244,240,235,.2)' }}>· {beat.bpm} BPM</span>}
        </div>
      </div>

      {/* Price */}
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.78rem', fontWeight: 700, color: 'var(--gold)' }}>
        {beat.price}
      </div>

      {/* Drive ID */}
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.52rem', color: 'rgba(244,240,235,.2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={beat.driveId}>
        {beat.driveId ? beat.driveId.slice(0, 16) + '…' : '—'}
      </div>

      {/* Featured */}
      <button
        onClick={() => onToggleFeatured(beat)}
        title={beat.featured ? 'Retirer du featured' : 'Mettre en featured'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem', fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: beat.featured ? 'var(--gold)' : 'var(--muted)', letterSpacing: '.06em', transition: 'color .2s' }}>
        {beat.featured ? <Star size={14} fill="var(--gold)" /> : <StarOff size={14} />}
        {beat.featured ? 'Featured' : 'Normal'}
      </button>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
        <button onClick={() => onEdit(beat)}
          style={{ width: 32, height: 32, background: 'var(--black4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
          <Pencil size={13} color="inherit" />
        </button>

        {delConfirm ? (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', gap: '.3rem' }}>
            <button onClick={() => onDelete(beat.id)}
              style={{ padding: '.3rem .6rem', background: 'var(--red)', border: 'none', color: '#fff', fontFamily: "'DM Mono', monospace", fontSize: '.55rem', letterSpacing: '.06em', cursor: 'pointer' }}>
              Confirmer
            </button>
            <button onClick={() => setDelConfirm(false)}
              style={{ width: 32, height: 32, background: 'var(--black4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={13} color="var(--muted)" />
            </button>
          </motion.div>
        ) : (
          <button onClick={() => setDelConfirm(true)}
            style={{ width: 32, height: 32, background: 'var(--black4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
            <Trash2 size={13} color="inherit" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editBeat, setEditBeat] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/beats`)
      const data = await res.json()
      setBeats(data)
    } catch {
      notify('Impossible de charger les beats', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      // On appelle l'endpoint API admin delete
      const res = await adminFetch(`${API_URL}/api/beats/${id}/delete`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setBeats(b => b.filter(x => x.id !== id))
      notify('Beat supprimé')
    } catch {
      notify('Erreur suppression', 'error')
    }
  }

  const handleToggleFeatured = async (beat) => {
    try {
      const res = await adminFetch(`${API_URL}/api/beats/${beat.id}/toggle-featured`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBeats(b => b.map(x => x.id === beat.id ? { ...x, featured: data.featured } : x))
      notify(data.featured ? 'Beat mis en featured' : 'Featured retiré')
    } catch {
      notify('Erreur', 'error')
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditBeat(null)
    load()
    notify(editBeat ? 'Beat mis à jour !' : 'Beat ajouté !')
  }

  const stats = {
    total: beats.length,
    featured: beats.filter(b => b.featured).length,
    genres: [...new Set(beats.map(b => b.genre).filter(Boolean))].length,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 68 }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 80, right: '2rem', zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: '.6rem',
              padding: '.8rem 1.2rem',
              background: toast.type === 'error' ? 'rgba(200,56,42,.15)' : 'rgba(201,168,76,.1)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(200,56,42,.4)' : 'var(--border2)'}`,
              backdropFilter: 'blur(12px)',
              fontFamily: "'DM Mono', monospace", fontSize: '.65rem',
              color: toast.type === 'error' ? 'var(--red)' : 'var(--gold)',
              letterSpacing: '.06em',
            }}>
            {toast.type === 'error' ? <AlertCircle size={13} /> : <Check size={13} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--black2)' }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.52rem', letterSpacing: '.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '.3rem' }}>
            // Admin panel
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '.06em', color: 'var(--white)', lineHeight: 1 }}>
            DRIP BEATZ · STUDIO
          </h1>
        </div>
        <button onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '.4rem', background: 'none', border: '1px solid var(--border)', padding: '.5rem 1rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '.6rem', letterSpacing: '.08em', cursor: 'pointer', transition: 'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
          <LogOut size={13} /> Déconnexion
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 5%' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', marginBottom: '2.5rem' }}>
          {[
            { val: stats.total, label: 'Beats total' },
            { val: stats.featured, label: 'En featured' },
            { val: stats.genres, label: 'Genres' },
          ].map(({ val, label }) => (
            <div key={label} style={{ padding: '1.5rem 2rem', background: 'var(--black2)' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '.55rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '.3rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Add button */}
        {!showForm && !editBeat && (
          <button
            onClick={() => { setShowForm(true); setEditBeat(null) }}
            className="btn-gold"
            style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.8rem', letterSpacing: '.08em' }}>
            <Plus size={15} /> Ajouter un beat
          </button>
        )}

        {/* Form */}
        <AnimatePresence>
          {(showForm || editBeat) && (
            <BeatForm
              key={editBeat?.id || 'new'}
              beat={editBeat}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditBeat(null) }}
            />
          )}
        </AnimatePresence>

        {/* Beats list */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--black2)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 100px 120px 90px 120px', gap: '1rem', padding: '.8rem 1.2rem', borderBottom: '1px solid var(--border)', background: 'var(--black3)' }}>
            {['Cover', 'Titre', 'Prix', 'Drive ID', 'Statut', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: '.5rem', letterSpacing: '.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem', fontFamily: "'DM Mono', monospace", fontSize: '.65rem' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Chargement…
            </div>
          ) : beats.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Music2 size={36} color="rgba(201,168,76,.15)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '.65rem', color: 'var(--muted)', letterSpacing: '.08em' }}>
                Aucun beat pour l'instant.<br />Ajoute ton premier beat ci-dessus.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {beats.map(beat => (
                <BeatRow
                  key={beat.id}
                  beat={beat}
                  onEdit={b => { setEditBeat(b); setShowForm(false) }}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <p style={{ marginTop: '1.5rem', fontFamily: "'DM Mono', monospace", fontSize: '.52rem', color: 'rgba(244,240,235,.12)', letterSpacing: '.06em', textAlign: 'right' }}>
          Backend Flask · {API_URL}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ROOT — gestion session en localStorage
// ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const ok = sessionStorage.getItem('drip_admin') === '1'
    setAuthed(ok)
    setChecking(false)
  }, [])

  const login = () => {
    sessionStorage.setItem('drip_admin', '1')
    setAuthed(true)
  }

  const logout = () => {
    sessionStorage.removeItem('drip_admin')
    setAuthed(false)
  }

  if (checking) return null

  return (
    <>
      {/* Masque navbar + footer en mode admin */}
      <style>{`
        nav, footer, .global-player { display: none !important; }
        body { padding-bottom: 0 !important; cursor: auto !important; }
        .cursor-dot, .cursor-ring { display: none !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {authed ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={login} />}
    </>
  )
}
