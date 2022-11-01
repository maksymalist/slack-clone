import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Channel {
    id: String
    name: String
    workspace: Workspace
    workspaceId: String
    messages: [Message]
  }

  type User {
    id: String
    email: String
    name: String
    profilePic: String
    createdAt: String
    updatedAt: String
    workspaces: [Workspace]
    messages: [Message]
  }

  type Workspace {
    id: String
    name: String
    icon: String
    description: String
    ownerId: String
    channels: [Channel]
  }

  type Message {
    id: String
    owner: User
    ownerId: String
    content: String
    createdAt: String
    updatedAt: String
    channel: Channel
    channelId: String
    replies: [Message]
    replyTo: Message
    replyToId: String
    reactions: [Reaction]
  }

  type Reaction {
    id: String
    emoji: String
    message: Message
    messageId: String
    user: User
    userId: String
  }

  type Token {
    token: String
  }

  type Query {
    me: User
    channel(channelId: ID!): Channel
    messages(channelId: ID!): [Message]
    workspace(workspaceId: ID!): Workspace
  }
  type Mutation {
    login(email: String!, password: String!): Token
    register(
      email: String!
      password: String!
      name: String!
      profilePic: String!
    ): Token
    createChannel(name: String!, workspaceId: String!): Channel
    createWorkspace(
      name: String!
      icon: String!
      description: String!
    ): Workspace
    createMessage(message: String!, channelId: String!): Message
    createReaction(emoji: String!, messageId: String!): Reaction
    createReply(content: String!, replyToId: String!, channelId: ID!): Message
    deleteMember(workspaceId: String!, userId: String!): Workspace
  }
`
