// ── CONFIG BEATMAKER ────────────────────────────────────────
// Remplis ces infos avant de déployer sur Vercel

export const BEATMAKER = {
  name: 'Mano beat777',
  pseudo: 'Mano beat777',
  tagline: 'Trap · Afro · Drill · RnB',
  bio: 'Beatmaker basé à Abidjan 🇨🇮',
  email: 'manobeat777@gmail.com',
  tel: '0789851090',
  whatsapp: '0150135992',
  instagram: 'https://instagram.com/manobeat777',
  tiktok:    'https://tiktok.com/@manobeat777',
  youtube:   'https://youtube.com/@manobeat777',
}

// URL de ton backend Flask sur PythonAnywhere
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://toncompte.pythonanywhere.com'

// Récupère tous les beats depuis Flask
export async function getBeats() {
  try {
    const res = await fetch(`${API_URL}/api/beats`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Génère le lien WhatsApp pour acheter un beat
export function getWALink(beat) {
  const msg = encodeURIComponent(
    `Bonjour ! Je veux acheter le beat "${beat.title}" (${beat.price}). Comment procéder ?`
  )
  return `https://wa.me/${BEATMAKER.whatsapp}?text=${msg}`
}

// Convertit un driveId en URL audio streamable
// ⚠️ Le fichier Drive DOIT être public (Tout le monde avec le lien)
export function getDriveAudioUrl(driveId) {
  // Proxy Next.js (route handler) — évite CORS Drive, zéro quota Flask
  // En local : http://localhost:3000/api/audio/{id}
  // En prod  : https://ton-site.vercel.app/api/audio/{id}
  return `/api/audio/${driveId}`
}
