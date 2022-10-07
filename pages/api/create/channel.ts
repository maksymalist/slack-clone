import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User, Workspace } from '../../../types'

const handler = async (req: any, res: any) => {
  try {
    const { workspace, channelName } = req.body as {
      workspace: Workspace
      channelName: string
    }

    const token: string = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    if (decoded.id !== workspace.ownerId) {
      res.status(401).json({
        error: 'You are not authorized to do this',
      })
      return
    }

    const channel = await client.channel.create({
      data: {
        name: channelName,
        workspaceId: workspace.id,
      },
    })

    res.status(200).json(channel)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
