import Message from './message'
import User from './user'

type Reaction = {
  id: string
  emoji: string
  message: Message
  messageId: string
  user: User
  userId: string
}

export default Reaction
