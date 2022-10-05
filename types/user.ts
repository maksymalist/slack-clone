import Workspace from './workspace'
import Message from './message'

type User = {
  id: string
  email: string
  name: string
  profilePic: string
  createdAt: Date
  updatedAt: Date
  workspaces: Workspace[]
  messages: Message[]
}

export default User
