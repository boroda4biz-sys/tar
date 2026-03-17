import { useEffect, useMemo, useState } from 'react'
import './style.css'

type Platform = 'telegram' | 'web'

type UserProfile = {
  first_name?: string
  last_name?: string
  photo_url?: string
}

type Rank = 'Новичок' | 'Искатель' | 'Провидец' | 'Магистр'

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'web'
  // Простейшая проверка Mini App Telegram
  if ((window as any).Telegram?.WebApp) return 'telegram'
  return 'web'
}

function computeRank(level: number): Rank {
  if (level >= 15) return 'Магистр'
  if (level >= 10) return 'Провидец'
  if (level >= 5) return 'Искатель'
  return 'Новичок'
}

export default function App() {
  const [platform] = useState<Platform>(() => detectPlatform())
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const level = 0

  useEffect(() => {
    if (platform === 'telegram') {
      const tg = (window as any).Telegram?.WebApp
      if (!tg) return

      tg.ready?.()
      tg.expand?.()

      const unsafe = tg.initDataUnsafe || {}
      const user = unsafe.user || {}

      setProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        photo_url: user.photo_url,
      })
    } else {
      // В обычном вебе просто гость
      setProfile(null)
    }
  }, [platform])

  const fullName = useMemo(() => {
    const first = profile?.first_name ?? ''
    const last = profile?.last_name ?? ''
    const name = `${first} ${last}`.trim()
    return name || 'Гость'
  }, [profile])

  const rank = useMemo(() => computeRank(level), [level])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at top, #1f1140 0, #050816 55%, #02010a 100%)',
        color: '#f9fafb',
        padding: '16px',
        boxSizing: 'border-box',
        fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          Таролог
        </div>
        <div
          style={{
            fontSize: 10,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          {platform === 'telegram' ? 'Telegram Mini App' : 'Web режим'}
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          borderRadius: 16,
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(88,28,135,0.18)) border-box',
          border: '1px solid rgba(212,175,55,0.45)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'radial-gradient(circle at 30% 0, #fef3c7 0, #78350f 55%, #020617 100%)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{fullName}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Ранг: {rank}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
        Это базовая кроссплатформенная оболочка. Дальше сюда добавим Bento‑главную, “Карту дня”,
        энергию и мастеров — всё будет одинаково работать в Telegram Mini App и в вебе.
      </div>
    </div>
  )
}




