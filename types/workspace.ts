import User from './user'
import Channel from './channel'

type Workspace = {
  id: string
  name: string
  icon: string
  description: string
  ownerId: string
  members: User[]
  channels: Channel[]
}

export default Workspace
