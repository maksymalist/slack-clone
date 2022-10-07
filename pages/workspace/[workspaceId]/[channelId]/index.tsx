import type { NextPage } from 'next'
import styles from '../../../../styles/Home.module.css'
import Layout from '../../../../components/Layout'
import axios from 'axios'
import { Title } from '@mantine/core'
import { IconHash } from '@tabler/icons'
import { Channel, Message as MessageType } from '../../../../types'
import Message from '../../../../components/Message'
import { useContext } from 'react'
import { UserContext } from '../../../_app'
import MessageInput from '../../../../components/MessageInput'
import MessageList from '../../../../components/MessageList'
import MessageListContainer from '../../../../components/MessageListContainer'

type Props = {
  messages: MessageType[]
  workspaceId: string
  channelId: string
  channelName: string
}

const Home: NextPage<Props> = ({ messages, channelId, channelName }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            marginTop: 20,
            paddingBottom: 20,
            width: '100%',
            borderBottom: '1px solid #e4e2e2',
            marginBottom: 20,
          }}
        >
          <IconHash
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '50%',
              padding: '5px',
              marginBottom: '10px',
            }}
            width={70}
            height={70}
            color="white"
          />
          <Title>Welcome to #{channelName?.split(' ')?.join('-')}</Title>
          <p
            style={{
              marginBottom: 10,
            }}
          >
            <i>
              This is the start of the #{channelName?.split(' ')?.join('-')}{' '}
              channel.
            </i>
          </p>
        </div>
        <MessageListContainer
          messages={messages}
          channelId={channelId}
          channelName={channelName}
        />
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (context: any) => {
  try {
    const channelId = context.params.channelId
    const workspaceId = context.params.workspaceId
    const res = await axios.post('http://localhost:3000/api/messages', {
      channelId,
    })
    const messages = res.data

    // get channel from the /api/channel endpoint

    const channelRes = await axios.post('http://localhost:3000/api/channel', {
      channelId,
    })
    const channel: Channel = channelRes.data

    console.log(messages)

    return {
      props: {
        messages,
        workspaceId,
        channelId,
        channelName: channel.name,
      },
    }
  } catch (error) {
    return {
      props: {
        messages: [],
        workspaceId: '',
        channelId: '',
        channelName: '',
      },
    }
  }
}

export default Home
