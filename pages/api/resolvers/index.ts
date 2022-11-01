import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import { User, Workspace, Message, Reaction, Channel } from '../../../types'
import bcrypt from 'bcrypt'

export const resolvers = {
  Query: {
    me: async (_: any, args: any, context: any) => {
      try {
        const token = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
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
          return null
        }

        return user
      } catch (error) {
        console.log(error)
        return null
      }
    },
    channel: async (_: any, args: any, context: any) => {
      const { channelId } = args as {
        channelId: string
      }

      const channel = await client.channel.findUnique({
        where: {
          id: channelId,
        },
      })

      if (!channel) {
        return null
      }

      return channel
    },
    workspace: async (_: any, args: any, context: any) => {
      const { workspaceId } = args as {
        workspaceId: string
      }

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
        return null
      }

      return workspace
    },
    messages: async (_: any, args: any, context: any) => {
      try {
        const { channelId } = args as {
          channelId: string
        }

        // using dfs to get all replies

        const getReplies = async (messageId: string) => {
          const replies = await client.message.findMany({
            where: {
              replyToId: messageId,
            },
            include: {
              owner: true,
              reactions: true,
            },
          })

          const repliesWithReplies: any = await Promise.all(
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
            reactions: true,
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

        return messagesWithReplies
      } catch (error) {
        return null
      }
    },
  },
  Mutation: {
    login: async (_: any, args: any) => {
      try {
        const { email, password } = args
        const user = await client.user.findFirst({ where: { email } })
        if (!user) {
          return {
            token: null,
          }
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return {
            token: null,
          }
        }
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: 60 * 60 * 24 * 3, // 3 days
          }
        )
        return { token }
      } catch (error) {
        console.log(error)
        return {
          token: null,
        }
      }
    },
    register: async (_: any, args: any) => {
      try {
        const { email, password, name, profilePic } = args
        const user = await client.user.create({
          data: {
            email: email,
            password: bcrypt.hashSync(password, 10),
            name: name,
            profilePic:
              profilePic ||
              `https://avatars.dicebear.com/api/identicon/${Math.random()}.svg`,
          },
        })
        if (!user) {
          return {
            token: null,
          }
        }
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: 60 * 60 * 24 * 3, // 3 days
          }
        )
        return { token }
      } catch (error) {
        console.log(error)
        return {
          token: null,
        }
      }
    },
    createChannel: async (_: any, args: any, context: any) => {
      try {
        const { workspace, channelName } = args as {
          workspace: Workspace
          channelName: string
        }

        const token: string = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
        }

        if (decoded.id !== workspace.ownerId) {
          return null
        }

        const channel = await client.channel.create({
          data: {
            name: channelName,
            workspaceId: workspace.id,
          },
        })

        return channel
      } catch (error) {
        console.log(error)
        return null
      }
    },
    createWorkspace: async (_: any, args: any, context: any) => {
      try {
        const { name, icon, description } = args as {
          name: string
          icon: string
          description: string
        }

        const token: string = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
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
        return workspace
      } catch (error) {
        console.log(error)
        return null
      }
    },
    createMessage: async (_: any, args: any, context: any) => {
      try {
        const { channelId, message } = args as {
          channelId: string
          message: string
        }

        const token: string = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
        }

        const new_message = await client.message.create({
          data: {
            content: message,
            channelId: channelId,
            ownerId: decoded.id,
          },
        })

        return new_message
      } catch (error) {
        console.log(error)
        return null
      }
    },
    createReaction: async (_: any, args: any, context: any) => {
      try {
        const { emoji, messageId } = args as {
          emoji: string
          messageId: string
        }

        const token: string = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
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
          return reaction
        }

        const new_reaction = await client.reaction.create({
          data: {
            emoji: emoji,
            userId: decoded.id,
            messageId: messageId,
          },
        })

        return new_reaction
      } catch (error) {
        console.log(error)
        return null
      }
    },
    createReply: async (_: any, args: any, context: any) => {
      try {
        const { channelId, message, replyToId } = args as {
          channelId: string
          message: string
          replyToId: string
        }

        const token: string = context.req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as any

        if (!decoded) {
          return null
        }

        const new_message = await client.message.create({
          data: {
            content: message,
            channelId: channelId,
            ownerId: decoded.id,
            replyToId: replyToId,
          },
        })

        return new_message
      } catch (error) {
        console.log(error)
        return null
      }
    },
    deleteMember: async (_: any, args: any, context: any) => {
      try {
        const { workspaceId, memberId } = args as {
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
          return null
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

        return updatedWorkspace
      } catch (error) {
        console.log(error)
        return null
      }
    },
  },
}
