import { useContext, useEffect, useState } from 'react'
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Tooltip,
  Title,
  Button,
  ActionIcon,
  Modal,
  Input,
  Textarea,
} from '@mantine/core'
import {
  IconBriefcase,
  IconCameraSelfie,
  IconHash,
  IconLink,
  IconPlus,
} from '@tabler/icons'
import { Channel, User, Workspace } from '../types'
import { UserContext } from '../pages/_app'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import axios from 'axios'
import { showNotification } from '@mantine/notifications'

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
  },

  aside: {
    flex: '0 0 60px',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  mainLink: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  mainLinkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },

  title: {
    boxSizing: 'border-box',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: 18,
    height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  logo: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    paddingTop: theme.spacing.md,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xl,
  },

  link: {
    boxSizing: 'border-box',
    display: 'block',
    textDecoration: 'none',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: 44,
    lineHeight: '44px',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  linkActive: {
    '&, &:hover': {
      borderLeftColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },
}))

export default function DoubleNavbar() {
  const { classes, cx } = useStyles()
  const router = useRouter()

  //@ts-ignore
  const {
    user,
    setActiveChannel,
    setActiveWorkspace,
    activeChannel,
    activeWorkspace,
  } = useContext(UserContext) as {
    user: User
    setActiveChannel: (channel: Channel) => void
    setActiveWorkspace: (workspace: Workspace) => void
    activeChannel: Channel
    activeWorkspace: Workspace
  }

  const spaces = user.workspaces
  const [workspaces, setWorkspaces] = useState([]) as [Workspace[], any]

  const workspaceId = router.query.workspaceId as string
  const channelId = router.query.channelId as string

  // modals

  const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false)
  const [createChannelModal, setCreateChannelModal] = useState(false)

  // inputs

  const [workspaceName, setWorkspaceName] = useState('')
  const [workspaceIcon, setWorkspaceIcon] = useState('')
  const [workspaceDescription, setWorkspaceDescription] = useState('')

  const [channelName, setChannelName] = useState('')

  useEffect(() => {
    if (!spaces) return
    if (workspaceId && channelId) {
      const workspaceIndex = spaces.findIndex(
        (space) => space.id === workspaceId
      )
      const channelIndex = spaces[workspaceIndex].channels.findIndex(
        (channel) => channel.id === channelId
      )
      setWorkspaces(spaces)
      setActiveWorkspace(spaces[workspaceIndex])
      setActiveChannel(spaces[workspaceIndex].channels[channelIndex])
      return
    }
    setWorkspaces(spaces)
    //setActiveWorkspace(spaces[0])
    //setActiveChannel(spaces[0].channels[0])
  }, [spaces])

  const create_channel = async (workspace: Workspace, channelName: string) => {
    try {
      const token = getCookie('auth-token')

      if (!token) {
        router.push('/login')
        return
      }

      const res = await axios.post(
        '/api/create/channel',
        {
          workspace,
          channelName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      window.location.reload()
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: error,
        color: 'red',
      })
    }
  }

  const create_workspace = async (
    name: string,
    icon: string,
    description: string
  ) => {
    try {
      const token = getCookie('auth-token')

      if (!token) {
        router.push('/login')
        return
      }

      const res = await axios.post(
        '/api/create/workspace',
        {
          name,
          icon,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      window.location.reload()
    } catch (error: any) {
      console.log(error)
      showNotification({
        title: 'Error',
        message: error,
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        opened={createChannelModal}
        onClose={() => setCreateChannelModal(false)}
        title={`Create Channel in ${activeWorkspace?.name}`}
      >
        <Input
          onChange={(e: any) => {
            setChannelName(e.target.value)
          }}
          value={channelName}
          placeholder="Channel Name"
          icon={<IconHash />}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{
              width: '100%',
              marginTop: 20,
            }}
            onClick={() => {
              create_channel(activeWorkspace, channelName)
            }}
          >
            ✨ Create Channel ✨
          </Button>
        </div>
      </Modal>
      <Modal
        opened={createWorkspaceModal}
        onClose={() => setCreateWorkspaceModal(false)}
        title={`Create Workspace`}
      >
        <Input
          onChange={(e: any) => {
            setWorkspaceName(e.target.value)
          }}
          value={workspaceName}
          placeholder="Workspace Name"
          icon={<IconBriefcase />}
        />
        <Input
          onChange={(e: any) => {
            setWorkspaceIcon(e.target.value)
          }}
          value={workspaceIcon}
          placeholder="Workspace Image URL (https://example.com/img.png)"
          icon={<IconLink />}
          mt={5}
        />

        <Textarea
          label="Workspace Description"
          value={workspaceDescription}
          onChange={(e: any) => {
            setWorkspaceDescription(e.target.value)
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{
              width: '100%',
              marginTop: 20,
            }}
            onClick={() => {
              create_workspace(
                workspaceName,
                workspaceIcon,
                workspaceDescription
              )
            }}
          >
            ✨ Create Workspace ✨
          </Button>
        </div>
      </Modal>
      <Navbar>
        <Navbar.Section grow className={classes.wrapper}>
          <div className={classes.aside}>
            <div className={classes.logo}>
              <img src="/slack.svg" style={{ width: 30, height: 30 }} />
            </div>
            {workspaces?.map((link: Workspace) => {
              //@ts-ignore

              return (
                <Tooltip
                  label={link.name}
                  position="right"
                  withArrow
                  transitionDuration={0}
                  key={link.name}
                >
                  <UnstyledButton
                    onClick={() => setActiveWorkspace(link)}
                    style={{
                      marginTop: 20,
                      borderRadius: '50%',
                    }}
                    className={cx(classes.mainLink, {
                      [classes.mainLinkActive]:
                        link.name === activeChannel.name,
                    })}
                  >
                    <img
                      src={link.icon}
                      style={{ borderRadius: '50%', width: 45, height: 45 }}
                    />
                  </UnstyledButton>
                </Tooltip>
              )
            })}
            <Button
              style={{
                marginTop: 20,
                borderRadius: '50%',
                width: 45,
                height: 45,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              variant="light"
              onClick={() => setCreateWorkspaceModal(true)}
            >
              <IconPlus size={25} />
            </Button>
          </div>
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {activeWorkspace.name}
            </Title>

            {activeWorkspace?.channels?.map((link, index) => (
              <a
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className={cx(classes.link, {
                  [classes.linkActive]: activeChannel === link,
                })}
                onClick={(event) => {
                  event.preventDefault()
                  router.push(`/workspace/${activeWorkspace.id}/${link.id}`)
                  setActiveChannel(link)
                }}
                key={index}
              >
                <IconHash color="#c4c4c4" />
                {link.name}
              </a>
            ))}
            {activeWorkspace.ownerId === user.id && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: 10,
                }}
              >
                <Button
                  rightIcon={<IconPlus />}
                  variant="white"
                  fullWidth
                  mt={10}
                  onClick={() => setCreateChannelModal(true)}
                >
                  Add Channel
                </Button>
              </div>
            )}
          </div>
        </Navbar.Section>
      </Navbar>
    </>
  )
}
