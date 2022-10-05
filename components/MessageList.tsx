import React, { useEffect, useState } from 'react'
import { Message as MessageType } from '../types'
import Message from '../components/Message'

type Props = {
  messages: MessageType[]
  setReplyingTo: (replyingTo: MessageType) => void
}

const MessageList = (props: Props) => {
  const [messages, setMessages] = useState(props.messages) as [
    MessageType[],
    any
  ]
  useEffect(() => {
    setMessages(props.messages)
  }, [props.messages])
  return (
    <>
      {messages.map((message: MessageType) => {
        //@ts-ignore
        return (
          <Message
            message={message}
            key={message.id}
            setReplyingTo={props.setReplyingTo}
          />
        )
      })}
    </>
  )
}

export default MessageList
