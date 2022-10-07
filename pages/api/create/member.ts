import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User, Workspace } from '../../../types'

const handler = async (req: any, res: any) => {
  try {
    const { workspace } = req.body as {
      workspace: Workspace
    }

    const token: string = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    if (decoded.id === workspace.ownerId) {
      res.status(401).json({
        error: 'You are not authorized to do this',
      })
      return
    }

    // check if member is already in workspace if so, return error

    const member = await client.user.findUnique({
      where: {
        id: decoded.id,
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

    const spaces = member.workspaces.map((space: any) => space.id)

    if (spaces.includes(workspace.id)) {
      res.status(400).json({
        error: 'User is already in workspace',
      })
      return
    }

    // add member to workspace

    await client.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        members: {
          connect: {
            id: decoded.id,
          },
        },
      },
    })

    res.status(200).json({
      message: 'Member added to workspace',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
