import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import axios from 'axios'
import { Workspace } from '../../types'
import { Avatar, Blockquote, Button, Chip } from '@mantine/core'
import { IconCircleCheck, IconX } from '@tabler/icons'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'

type Props = {
  workspace: Workspace
  token: string
}

const Home: NextPage<Props> = ({ workspace, token }) => {
  const join_workspace = async (token: string) => {
    if (!token) {
      window.location.href = '/login'
      return
    }

    try {
      const res = await axios.post(
        '/api/create/member',
        {
          workspace,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      window.location.href = '/'
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <h1 className={styles.title}>
          Wanna join <a href="https://nextjs.org">{workspace?.name}</a>?
        </h1>
        <br />
        <Avatar
          src={
            workspace.icon
              ? workspace.icon
              : 'https://cdn.discordapp.com/attachments/841000000000000000/841000000000000000/unknown.png'
          }
          alt="Mantine"
          size={120}
          style={{
            border: '1px solid #e4e2e2',
          }}
          radius={120}
        />
        <br />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <Chip
            color="blue"
            variant="filled"
            checked
            style={{
              marginRight: '10px',
            }}
          >
            {workspace?.members?.length} members
          </Chip>
          <Chip color="indigo" variant="filled" checked>
            {workspace?.channels?.length} channels
          </Chip>
        </div>
        <Blockquote cite="~ the admin">{workspace?.description}</Blockquote>
        <br />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Button
            variant="filled"
            color="green"
            style={{
              marginRight: '10px',
            }}
            onClick={() => join_workspace(token)}
            rightIcon={<IconCircleCheck />}
          >
            yes please!
          </Button>
          <Link href="/">
            <Button variant="outline" color="red" rightIcon={<IconX />}>
              no thanks.
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  const token = context.req.cookies['auth-token']
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const workspaceId = context.params.workspaceId
  const workspace = await axios.post('http://localhost:3000/api/workspace/', {
    workspaceId,
  })

  console.log(workspace.data.ownerId, '^46&*%&*%&*$%*$%&%*&#^$($*@&#*$^#($^')

  return {
    props: {
      token,
      workspace: workspace.data,
    },
  }
}

export default Home
