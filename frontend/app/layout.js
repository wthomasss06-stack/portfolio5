import './globals.css'
import { PlayerProvider } from '@/lib/player-store'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalPlayer from '@/components/ui/GlobalPlayer'
import Cursor from '@/components/ui/Cursor'

export const metadata = {
  title: 'Diallo Roger Manassé — Beatmaker · Abidjan',
  description: 'Instrumentales Trap, Afro & Drill de qualité studio. Preview 30s gratuit. Achat direct WhatsApp. Beatmaker basé à Abidjan 🇨🇮',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PlayerProvider>
          <Cursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <GlobalPlayer />
        </PlayerProvider>
      </body>
    </html>
  )
}
