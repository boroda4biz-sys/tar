import { useMemo, useState } from 'react'
import type { TarotCard } from './tarotDeck'
import { getRandomSubset } from './tarotDeck'

type Props = {
  onBack: () => void
}

export function YesNoSpread({ onBack }: Props) {
  const [pool] = useState<TarotCard[]>(() => getRandomSubset(10))
  const [pickedIds, setPickedIds] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  const pickedCards = useMemo(
    () => pool.filter((c) => pickedIds.includes(c.id)),
    [pool, pickedIds],
  )

  const canPickMore = !revealed && pickedIds.length < 3

  const handlePick = (id: string) => {
    if (!canPickMore) return
    if (pickedIds.includes(id)) return
    setPickedIds((prev) => [...prev, id])
  }

  const handleReveal = () => {
    if (pickedIds.length === 3) {
      setRevealed(true)
    }
  }

  const verdict = useMemo(() => {
    if (!revealed || pickedCards.length !== 3) {
      return 'Сформулируйте вопрос, выберите три карты и нажмите «Открыть ответ».'
    }

    const majors = pickedCards.filter((c) => c.arcana === 'major').length
    if (majors >= 2) {
      return 'Скорее всего — Да. Энергия ситуации поддерживает движение вперёд.'
    }
    if (majors === 1) {
      return 'Ответ неочевиден. Карты предлагают прислушаться к интуиции и знакам вокруг.'
    }
    return 'Скорее — Нет. Сейчас лучше сделать паузу, понаблюдать и не торопиться с решением.'
  }, [pickedCards, revealed])

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
        <button
          onClick={onBack}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#e5e7eb',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ fontWeight: 600, fontSize: 16 }}>Да / Нет</div>
        <div style={{ width: 24 }} />
      </header>

      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>
        Держите в уме свой вопрос. Когда будете готовы — по очереди выберите три карты из ряда,
        а затем откройте ответ.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 8,
          marginBottom: 16,
        }}
      >
        {pool.map((card) => {
          const pickedIndex = pickedIds.indexOf(card.id)
          const isPicked = pickedIndex !== -1
          const showFace = revealed && isPicked

          return (
            <button
              key={card.id}
              onClick={() => handlePick(card.id)}
              disabled={revealed || (!isPicked && !canPickMore)}
              style={{
                position: 'relative',
                aspectRatio: '3 / 5',
                borderRadius: 10,
                border: isPicked ? '2px solid #D4AF37' : '1px solid rgba(148,163,184,0.4)',
                overflow: 'hidden',
                cursor: revealed ? 'default' : 'pointer',
                background:
                  'radial-gradient(circle at 30% 0, #fef3c7 0, #1e293b 60%, #020617 100%)',
                boxShadow: isPicked
                  ? '0 0 18px rgba(212,175,55,0.7)'
                  : '0 10px 20px rgba(0,0,0,0.7)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                transform: isPicked ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {showFace ? (
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: '#e5e7eb',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  ✶
                </div>
              )}

              {isPicked && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '999px',
                    background: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {pickedIndex + 1}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleReveal}
        disabled={revealed || pickedIds.length !== 3}
        style={{
          border: 'none',
          borderRadius: 999,
          padding: '10px 16px',
          marginBottom: 12,
          background: revealed
            ? 'rgba(55,65,81,0.8)'
            : pickedIds.length === 3
            ? 'linear-gradient(135deg, #D4AF37, #fbbf24)'
            : 'rgba(31,41,55,0.9)',
          color: revealed || pickedIds.length !== 3 ? '#e5e7eb' : '#020617',
          fontWeight: 600,
          fontSize: 14,
          cursor: revealed || pickedIds.length !== 3 ? 'default' : 'pointer',
        }}
      >
        {revealed ? 'Ответ получен' : pickedIds.length === 3 ? 'Открыть ответ' : 'Выберите 3 карты'}
      </button>

      <div
        style={{
          marginTop: 8,
          padding: 14,
          borderRadius: 16,
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(55,65,81,0.8)',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {verdict}
      </div>
    </div>
  )
}

