import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User, Workspace } from '../../../types'

const handler = async (req: any, res: any) => {
  try {
    const { name, icon, description } = req.body as {
      name: string
      icon: string
      description: string
    }

    const token: string = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    const workspace = await client.workspace.create({
      data: {
        name,
        icon,
        description,
        members: {
          connect: {
            id: decoded.id,
          },
        },
        ownerId: decoded.id,
      },
    })
    res.status(200).json(workspace)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
