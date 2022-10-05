import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User } from '../../../types'

const handler = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    const user: any = await client.user.findFirst({
      where: { id: decoded.id },
      include: {
        workspaces: {
          include: { channels: true, members: true },
        },
      },
    })
    if (!user) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
