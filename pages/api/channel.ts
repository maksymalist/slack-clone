import { client } from '../../prisma/client'

const handler = async (req: any, res: any) => {
  const { channelId } = req.body

  const channel = await client.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  if (!channel) {
    res.status(404).json({
      error: 'Channel not found',
    })
    return
  }

  res.status(200).json(channel)
}
export default handler
