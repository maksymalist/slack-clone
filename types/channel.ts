import Message from './message'
import Workspace from './workspace'

type Channel = {
  id: string
  name: string
  workspace: Workspace
  workspaceId: string
  messages: Message[]
}

export default Channel
