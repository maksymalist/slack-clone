import '../styles/globals.css'
import type { AppProps } from 'next/app'
import SideBar from '../components/SideBar'
import { createContext, useEffect, useState } from 'react'

import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

import { Channel, User, Workspace } from '../types'

export const UserContext = createContext({})

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState({}) as [User, any]
  const [activeChannel, setActiveChannel] = useState({}) as [Channel, any]
  const [activeWorkspace, setActiveWorkspace] = useState({}) as [Workspace, any]

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        activeWorkspace: activeWorkspace,
        setActiveWorkspace: setActiveWorkspace,
        activeChannel: activeChannel,
        setActiveChannel: setActiveChannel,
      }}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="top-right">
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </UserContext.Provider>
  )
}

export default MyApp
