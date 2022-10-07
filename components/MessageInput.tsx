import React, { useEffect, useState } from 'react'
import { Input, Text, Chip, ActionIcon } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import axios from 'axios'
import { showNotification } from '@mantine/notifications'
import { getCookie } from 'cookies-next'
import { Message } from '../types'
import { IconX } from '@tabler/icons'

type Props = {
  channelName: string
  channelId: string
  replyingTo?: Message
  setReplyingTo: (replyingTo: Message) => void
}

const MessageInput = (props: Props) => {
  const [message, setMessage] = useState('')

  useHotkeys([
    [
      'enter',
      () => {
        create_message(message, props.replyingTo)
      },
    ],
  ])

  const create_message = async (
    message: string,
    replyingTo: Message | undefined
  ) => {
    const token = getCookie('auth-token')

    if (!token) return
    if (message.length === 0) {
      showNotification({
        title: 'Message cannot be empty',
        message: 'Please enter a message',
        color: 'red',
      })
      return
    }

    if (replyingTo && replyingTo.id) {
      try {
        const res = await axios.post(
          '/api/create/reply',
          {
            message: message,
            channelId: props.channelId,
            replyToId: replyingTo.id,
          },
          {
            headers: {
              Authorization: `Bearer ${getCookie('auth-token')}`,
            },
          }
        )

        setMessage('')
        props.setReplyingTo({} as Message)
      } catch (error) {
        console.log(error)
        showNotification({
          title: 'Error',
          message: 'Error while creating message',
          color: 'red',
        })
      }
      return
    }

    try {
      const res = await axios.post(
        '/api/create/message',
        {
          message: message,
          channelId: props.channelId,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie('auth-token')}`,
          },
        }
      )

      setMessage('')
    } catch (error) {
      console.log(error)
      showNotification({
        title: 'Error',
        message: 'Error while creating message',
        color: 'red',
      })
    }
  }

  useEffect(() => {
    props.setReplyingTo({} as Message)
  }, [props.channelId])

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 15,
      }}
    >
      {props.replyingTo?.owner && (
        <div
          style={{
            width: '100%',
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: '15px 15px 0 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          replying to{' '}
          <span
            style={{
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: '#228be6',
              marginLeft: 5,
            }}
          >
            @{props.replyingTo?.owner?.name}
          </span>
          <ActionIcon
            onClick={() => {
              props.setReplyingTo({} as Message)
            }}
          >
            <IconX />
          </ActionIcon>
        </div>
      )}
      <Input
        width={'100%'}
        size="lg"
        placeholder={` Message ${props.channelName}`}
        value={message}
        onChange={(e: any) => {
          setMessage(e.currentTarget.value)
        }}
      />
    </div>
  )
}

export default MessageInput
