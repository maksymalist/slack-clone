import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Text, Popover, Button } from '@mantine/core'
import { User } from '../types'
import useAuth from '../hooks/useAuth'
import { IconHash } from '@tabler/icons'
import { UserContext } from '../pages/_app'

const TopBar = () => {
  //@ts-ignore
  const { user, activeChannel, setUser } = useContext(UserContext)
  const [_, __, logout] = useAuth()

  return (
    <div
      style={{
        height: '60px',
        borderBottom: '1px solid #eaeaea',
        backgroundColor: '#fff',
        width: '100%',
        color: '#000',
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 2,
      }}
    >
      <Text
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {' '}
        {activeChannel?.name && (
          <>
            <IconHash /> {activeChannel.name}{' '}
          </>
        )}
      </Text>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={
                  user?.profilePic ||
                  `https://avatars.dicebear.com/api/bottts/${user?.id}.svg`
                }
                alt="Mantine"
                size="md"
                style={{
                  marginRight: '10px',
                }}
                radius="xl"
              />
              <Text>{user?.email}</Text>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Text align="center" mb="md" mt="sm">
              Signed in as <b>{user?.name}</b>
            </Text>
            <Button
              fullWidth
              color="red"
              onClick={() => {
                logout()
                setUser({})
              }}
            >
              Logout
            </Button>
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  )
}
export default TopBar
