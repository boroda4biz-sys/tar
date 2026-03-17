import { useEffect, useMemo, useState } from 'react'
import {
  AdaptivityProvider,
  AppRoot,
  Avatar,
  ConfigProvider,
  Panel,
  PanelHeader,
  Root,
  Text,
  Title,
  View,
} from '@vkontakte/vkui'
import bridge from '@vkontakte/vk-bridge'
import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

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
  const level = 0 // заглушка, позже заменим на реальную механику

  const fullName = useMemo(() => {
    const first = profile?.first_name ?? ''
    const last = profile?.last_name ?? ''
    const name = `${first} ${last}`.trim()
    return name || 'Гость'
  }, [profile])

  const rank = useMemo(() => computeRank(level), [level])

  useEffect(() => {
    // Защита: вне VK WebView bridge может быть заглушкой без send.
    const maybeBridge = bridge as unknown as { send?: unknown }
    if (!maybeBridge.send || typeof (maybeBridge.send as any) !== 'function') {
      return
    }

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
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot mode="full">
          <Root activeView="main">
            <View id="main" activePanel="main_panel">
              <Panel id="main_panel">
                <PanelHeader>Таролог</PanelHeader>
                <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar
                    size={56}
                    src={profile?.photo_200}
                    style={{
                      borderRadius: 18,
                      border: '1px solid rgba(212,175,55,0.45)',
                      background: 'rgba(212,175,55,0.08)',
                    }}
                  />
                  <div>
                    <Title level="2" style={{ marginBottom: 2 }}>
                      {fullName}
                    </Title>
                    <Text style={{ opacity: 0.8 }}>Ранг: {rank}</Text>
                  </div>
                </div>
              </Panel>
            </View>
          </Root>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}



