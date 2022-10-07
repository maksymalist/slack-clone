import React, { useEffect, useState } from 'react'
import { Message as MessageType } from '../types'
import Message from '../components/Message'
import EmojiPicker from 'emoji-picker-react'
import { Modal } from '@mantine/core'
import { getCookie } from 'cookies-next'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'

type Props = {
  messages: MessageType[]
  setReplyingTo: (replyingTo: MessageType) => void
}

const MessageList = (props: Props) => {
  const [messages, setMessages] = useState(props.messages) as [
    MessageType[],
    any
  ]
  const [showEmojiPicker, setShowEmojiPicker] = useState(false) as [
    boolean,
    (show: boolean) => void
  ]
  const [currentMessage, setCurrentMessage] = useState('') as [string, any]

  const add_reaction = async (emoji: string, messageId: string) => {
    const token = getCookie('auth-token')
    if (!token) return

    try {
      axios.post(
        '/api/create/reaction',
        {
          emoji: emoji,
          messageId: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'An error occured',
        color: 'red',
      })
    }
  }

  useEffect(() => {
    setMessages(props.messages)
  }, [props.messages])

  return (
    <>
      <Modal
        opened={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        title="Pick a reaction"
        transition="slide-down"
        transitionDuration={200}
        transitionTimingFunction="ease"
      >
        <EmojiPicker
          width={400}
          onEmojiClick={(event, emojiObject) => {
            const emojiUrl = event.getImageUrl(emojiObject as any)
            add_reaction(emojiUrl, currentMessage)
            setCurrentMessage('')
            setShowEmojiPicker(false)
          }}
        />
      </Modal>
      {messages.map((message: MessageType) => {
        //@ts-ignore
        return (
          <Message
            message={message}
            key={message.id}
            setReplyingTo={props.setReplyingTo}
            showEmojiPicker={setShowEmojiPicker}
            setCurrentMessage={setCurrentMessage}
          />
        )
      })}
    </>
  )
}

export default MessageList
