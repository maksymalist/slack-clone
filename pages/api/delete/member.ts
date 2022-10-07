import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User, Workspace } from '../../../types'

const handler = async (req: any, res: any) => {
  try {
    const { workspaceId, memberId } = req.body as {
      workspaceId: string
      memberId: string
    }

    // check if member is already in workspace if so, return error

    const member = await client.user.findUnique({
      where: {
        id: memberId,
      },
      include: {
        workspaces: true,
      },
    })

    if (!member) {
      res.status(404).json({
        error: 'Invalid user',
      })
      return
    }

    // remove member from workspace

    const updatedWorkspace = await client.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        members: {
          disconnect: {
            id: memberId,
          },
        },
      },
      include: {
        members: true,
      },
    })

    res.status(200).json(updatedWorkspace)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
