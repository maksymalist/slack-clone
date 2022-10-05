const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function seed() {
  // create a new user

  const user = await prisma.user.create({
    data: {
      name: 'Miles',
      email: 'miles@gmail.com',
      password: await bcrypt.hash('1234', 10),
      profilePic: `https://avatars.dicebear.com/api/identicon/${Math.random()}.svg`,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Sarah',
      email: 'sarah@gmail.com',
      password: await bcrypt.hash('1234', 10),
      profilePic: `https://avatars.dicebear.com/api/identicon/${Math.random()}.svg`,
    },
  })

  // create a new workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Gaming Chat 👾',
      icon: 'https://cdn.iconscout.com/icon/free/png-256/discord-2752218-2284969.png',
      description: 'A place for gamers to chat',
      ownerId: user.id,
      members: {
        connect: [{ id: user.id }, { id: user2.id }],
      },
    },
  })

  // create a new channel
  const channel1 = await prisma.channel.create({
    data: {
      name: 'General 🌐',
      workspaceId: workspace.id,
    },
  })

  const channel2 = await prisma.channel.create({
    data: {
      name: 'League of Legends 🎮',
      workspaceId: workspace.id,
    },
  })

  // create a new message

  const message = await prisma.message.create({
    data: {
      content: 'Hello World',
      channelId: channel1.id,
      ownerId: user.id,
    },
  })

  const message2 = await prisma.message.create({
    data: {
      content: 'Hello World',
      channelId: channel2.id,
      ownerId: user.id,
    },
  })

  const message3 = await prisma.message.create({
    data: {
      content: 'Hello World',
      channelId: channel2.id,
      ownerId: user2.id,
      replyToId: message2.id,
    },
  })
}

seed()
