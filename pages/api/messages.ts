//@ts-nocheck
import { client } from '../../prisma/client'

const handler = async (req: any, res: any) => {
  try {
    const { channelId } = req.body

    // using dfs to get all replies

    const getReplies = async (messageId: string) => {
      const replies = await client.message.findMany({
        where: {
          replyToId: messageId,
        },
        include: {
          owner: true,
        },
      })

      const repliesWithReplies = await Promise.all(
        replies.map(async (reply) => {
          const replies = await getReplies(reply.id)
          return {
            ...reply,
            replies,
          }
        })
      )

      return repliesWithReplies
    }

    const messages = await client.message.findMany({
      where: {
        channelId,
        replyToId: null,
      },
      include: {
        owner: true,
      },
    })

    const messagesWithReplies = await Promise.all(
      messages.map(async (message) => {
        const replies = await getReplies(message.id)
        return {
          ...message,
          replies,
        }
      })
    )

    res.status(200).json(messagesWithReplies)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
export default handler
