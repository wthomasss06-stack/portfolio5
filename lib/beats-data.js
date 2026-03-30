// ── CONFIG BEATMAKER ────────────────────────────────────────
// Remplis ces infos avant de déployer sur Vercel

export const BEATMAKER = {
  name: 'TON NOM',                          // ex: DRIP BEATZ
  tagline: 'Trap · Afro · Drill · RnB',
  bio: 'Beatmaker basé à Abidjan 🇨🇮',
  whatsapp: '225XXXXXXXXX',                 // numéro sans +
  instagram: 'https://instagram.com/toncompte',
  tiktok:    'https://tiktok.com/@toncompte',
  youtube:   'https://youtube.com/@toncompte',
}

// URL de ton backend Flask sur PythonAnywhere
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aka8elvis77.pythonanywhere.com'

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
  // URL de téléchargement direct — fonctionne si le fichier est public
  return `https://drive.google.com/uc?export=download&id=${driveId}&confirm=t`
}

// URL pour l'iframe preview Drive (fallback)
export function getDriveIframeUrl(driveId) {
  return `https://drive.google.com/file/d/${driveId}/preview`
}
