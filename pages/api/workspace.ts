import { client } from '../../prisma/client'

const handler = async (req: any, res: any) => {
  const { workspaceId } = req.body

  const workspace = await client.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
      channels: true,
    },
  })

  if (!workspace) {
    res.status(404).json({
      error: 'Workspace not found',
    })
    return
  }

  res.status(200).json(workspace)
}
export default handler
