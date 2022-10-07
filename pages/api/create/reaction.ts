import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'

const handler = async (req: any, res: any) => {
  try {
    const { emoji, messageId } = req.body

    const token: string = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!decoded) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }

    const reaction = await client.reaction.findFirst({
      where: {
        userId: decoded.id,
        messageId,
        emoji,
      },
    })

    if (reaction) {
      await client.reaction.delete({
        where: {
          id: reaction.id,
        },
      })
      res.status(200).json({})
      return
    }

    const new_reaction = await client.reaction.create({
      data: {
        emoji: emoji,
        userId: decoded.id,
        messageId: messageId,
      },
    })

    res.status(200).json(new_reaction)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
export default handler
