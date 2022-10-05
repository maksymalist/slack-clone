import Channel from './channel'
import User from './user'

type Message = {
  id: string
  owner: User
  ownerId: string
  content: string
  createdAt: Date
  updatedAt: Date
  channel: Channel
  channelId: string
  replies: Message[]
  replyTo: Message
  replyToId: string
}

export default Message
