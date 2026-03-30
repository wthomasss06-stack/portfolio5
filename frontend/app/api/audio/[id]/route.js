// Route Handler Next.js — proxy audio Google Drive
// Tourne sur Vercel (serverless), zéro consommation Flask/PythonAnywhere
import { NextResponse } from 'next/server'

export const runtime = 'edge' // Edge runtime = plus rapide, moins de latence

export async function GET(request, { params }) {
  const { id } = params

  // Valide l'ID Drive (sécurité)
  if (!id || !/^[A-Za-z0-9_-]{10,60}$/.test(id)) {
    return new NextResponse('ID invalide', { status: 400 })
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`

  try {
    const upstream = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Range': request.headers.get('range') || '',
      },
    })

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse('Fichier introuvable ou non public', { status: 404 })
    }

    const contentType = upstream.headers.get('content-type') || 'audio/mpeg'
    const contentLength = upstream.headers.get('content-length')

    const headers = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    }
    if (contentLength) headers['Content-Length'] = contentLength

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    })
  } catch (err) {
    return new NextResponse('Erreur proxy: ' + err.message, { status: 502 })
  }
}
