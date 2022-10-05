import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcrypt'

const handler = async (req: any, res: any) => {
  try {
    const { channelId, message } = req.body

    const token: string = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    const new_message = await client.message.create({
      data: {
        content: message,
        channelId: channelId,
        ownerId: decoded.id,
      },
    })

    res.status(200).json(new_message)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
