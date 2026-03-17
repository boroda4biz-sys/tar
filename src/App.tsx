import { useEffect, useMemo, useState } from 'react'
import { AdaptivityProvider, Panel, PanelHeader, Root, View } from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css'

type UserProfile = {
  first_name?: string
  last_name?: string
  photo_200?: string
}

type Rank = 'Новичок' | 'Искатель' | 'Провидец' | 'Магистр'

function computeRank(level: number): Rank {
  if (level >= 15) return 'Магистр'
  if (level >= 10) return 'Провидец'
  if (level >= 5) return 'Искатель'
  return 'Новичок'
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const level = 0 // временно: позже заменим на сохраненную механику

  const fullName = useMemo(() => {
    const first = profile?.first_name ?? ''
    const last = profile?.last_name ?? ''
    const name = `${first} ${last}`.trim()
    return name || 'Гость'
  }, [profile])

  const rank = useMemo(() => computeRank(level), [level])

  useEffect(() => {
    // В обычном браузере VK Bridge может быть "заглушкой" без методов.
    const maybeBridge = bridge as unknown as { send?: unknown }
    if (!maybeBridge.send || typeof (maybeBridge.send as any) !== 'function') return

    bridge
      .send('VKWebAppInit', {})
      .catch(() => {})
      .finally(() => {
        bridge
          .send('VKWebAppGetUserInfo', {})
          .then((res: unknown) => {
            const data = res as UserProfile | null
            setProfile(data)
          })
          .catch(() => setProfile(null))
      })
  }, [])

  return (
    <Root activeView="main">
      <AdaptivityProvider>
        <View activePanel="main_panel" id="main">
          <Panel id="main_panel">
            <PanelHeader>Таролог</PanelHeader>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.35)',
                    overflow: 'hidden',
                  }}
                >
                  {profile?.photo_200 ? (
                    <img src={profile.photo_200} alt="avatar" style={{ width: '100%', height: '100%' }} />
                  ) : null}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{fullName}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>Ранг: {rank}</div>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 14, opacity: 0.85 }}>
                Пытаюсь получить данные профиля через `VKBridge`.
              </div>
            </div>
          </Panel>
        </View>
      </AdaptivityProvider>
    </Root>
  )
}

