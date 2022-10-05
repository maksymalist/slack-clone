import React, { useState } from 'react'
import { Message as MessageType } from '../types'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

type Props = {
  messages: MessageType[]
  channelName: string
  channelId: string
}

const MessageListContainer = (props: Props) => {
  const [replyingTo, setReplyingTo] = useState({}) as [MessageType, any]
  return (
    <>
      <MessageList messages={props.messages} setReplyingTo={setReplyingTo} />
      <MessageInput
        channelName={props.channelName}
        setReplyingTo={setReplyingTo}
        channelId={props.channelId}
        replyingTo={replyingTo}
      />
    </>
  )
}

export default MessageListContainer
