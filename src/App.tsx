import { useEffect, useMemo, useState } from 'react'
import './style.css'
import { getRandomCard, getRandomSubset, type TarotCard } from './tarotDeck'
import { YesNoSpread } from './YesNoSpread'

type Platform = 'telegram' | 'web'

type UserProfile = {
  first_name?: string
  last_name?: string
  photo_url?: string
}

type Rank = 'Новичок' | 'Искатель' | 'Провидец' | 'Магистр'

type Screen = 'home' | 'yesNo'

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
  const [screen, setScreen] = useState<Screen>('home')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const level = 0
  const [cardOfTheDay, setCardOfTheDay] = useState<TarotCard | null>(null)
  const [, setYesNoPool] = useState<TarotCard[]>([])

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

    // карта дня – фиксируем на сутки через localStorage
    const key = 'tarolog_card_of_the_day'
    const raw = window.localStorage.getItem(key)
    const today = new Date().toISOString().slice(0, 10)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { date: string; card: TarotCard }
        if (parsed.date === today) {
          setCardOfTheDay(parsed.card)
        } else {
          const card = getRandomCard()
          setCardOfTheDay(card)
          window.localStorage.setItem(key, JSON.stringify({ date: today, card }))
        }
      } catch {
        const card = getRandomCard()
        setCardOfTheDay(card)
        window.localStorage.setItem(key, JSON.stringify({ date: today, card }))
      }
    } else {
      const card = getRandomCard()
      setCardOfTheDay(card)
      window.localStorage.setItem(key, JSON.stringify({ date: today, card }))
    }

    // пул для расклада "Да/Нет"
    setYesNoPool(getRandomSubset(10))
  }, [platform])

  const fullName = useMemo(() => {
    const first = profile?.first_name ?? ''
    const last = profile?.last_name ?? ''
    const name = `${first} ${last}`.trim()
    return name || 'Гость'
  }, [profile])

  const rank = useMemo(() => computeRank(level), [level])

  if (screen === 'yesNo') {
    return <YesNoSpread onBack={() => setScreen('home')} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#060508',
        color: '#f9fafb',
        padding: '16px 16px 20px',
        boxSizing: 'border-box',
        fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* фоновые слои */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -80,
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(180,83,9,0.18) 0, transparent 55%), radial-gradient(circle at 80% 0, rgba(88,28,135,0.22) 0, transparent 55%)',
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 120%, rgba(15,23,42,0.96), #02010a 65%)',
          mixBlendMode: 'normal',
          opacity: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            borderRadius: 18,
            background:
              'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.4)) padding-box, linear-gradient(135deg, rgba(212,175,55,0.9), rgba(55,65,81,0.15)) border-box',
            border: '1px solid transparent',
            boxShadow:
              '0 22px 45px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.3), inset 0 0 0 1px rgba(15,23,42,0.85)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background:
                'radial-gradient(circle at 30% 0, #fef3c7 0, #7c2d12 55%, #020617 100%)',
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

        {/* Карта дня */}
        {cardOfTheDay && (
          <section
            style={{
              marginTop: 8,
              marginBottom: 12,
              padding: 14,
              borderRadius: 20,
              background:
                'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92)) padding-box, ' +
                'linear-gradient(135deg, rgba(250,250,249,0.08), rgba(55,65,81,0.3)) border-box',
              border: '1px solid transparent',
              boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
              display: 'flex',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 80,
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 0 25px rgba(250,250,249,0.35)',
                flexShrink: 0,
              }}
            >
              <img
                src={cardOfTheDay.imageUrl}
                alt={cardOfTheDay.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
                  Карта дня
                </div>
                <div style={{ marginTop: 2, fontSize: 16, fontWeight: 600 }}>{cardOfTheDay.name}</div>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Обрати внимание на знаки вокруг — сегодня эта энергия особенно чувствуется в событиях и людях.
              </div>
            </div>
          </section>
        )}

        {/* блок раскладов */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>
            Сделать расклад
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.45 }}>
            Перед раскладом найдите мгновение тишины. Сформулируйте вопрос — и позвольте картам подсветить
            важные символы вашего пути.
          </div>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                title: 'Любовь',
                description: 'О чувствах, связях и внутренней уязвимости сердца.',
                color: 'linear-gradient(135deg, #4c1d95, #ec4899)',
              },
              {
                title: 'Будущее',
                description: 'О вероятных сценариях и перекрёстках судьбы.',
                color: 'linear-gradient(135deg, #0f766e, #38bdf8)',
              },
              {
                title: 'Карьера',
                description: 'О выборе пути, возможностях роста и ресурсах.',
                color: 'linear-gradient(135deg, #854d0e, #facc15)',
              },
              {
                title: 'Да или нет?',
                description: 'Простой формат для чёткого решения: двигаться вперёд или отпустить.',
                color: 'linear-gradient(135deg, #1d4ed8, #22d3ee)',
                onClick: () => setScreen('yesNo' as const),
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={item.onClick}
                style={{
                  border: 'none',
                  padding: 12,
                  borderRadius: 18,
                  textAlign: 'left',
                  cursor: 'pointer',
                  background:
                    'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.85)) padding-box, ' +
                    'linear-gradient(135deg, rgba(148,163,184,0.7), rgba(15,23,42,0.2)) border-box',
                  borderImageSlice: 1,
                  borderImageSource:
                    'linear-gradient(135deg, rgba(148,163,184,0.95), rgba(15,23,42,0.3))',
                  boxShadow: '0 16px 35px rgba(0,0,0,0.95)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: item.color,
                    opacity: 0.22,
                    mixBlendMode: 'screen',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}




