import { useState } from 'react'
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core'
import useAuth from '../hooks/useAuth'
import { showNotification } from '@mantine/notifications'
import { IconX } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    height: '100vh',
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

export default function RegisterForm() {
  const { classes } = useStyles()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [register] = useAuth()

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome to Slack!
        </Title>

        <TextInput
          label="Name"
          placeholder="John Doe"
          size="md"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          size="md"
        />
        <TextInput
          label="Profile image (optional)"
          value={profilePicture}
          onChange={(event) => setProfilePicture(event.currentTarget.value)}
          placeholder="https://example.com/image.png"
          size="md"
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          placeholder="Your password"
          mt="md"
          size="md"
        />
        <PasswordInput
          label="Confirm password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
          placeholder="Your password"
          mt="md"
          size="md"
        />

        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button
          fullWidth
          mt="xl"
          size="md"
          onClick={() => {
            if (password !== passwordConfirm) {
              showNotification({
                title: 'Error !',
                message: 'Passwords do not match',
                color: 'red',
                autoClose: 2500,
                icon: <IconX />,
              })
              return
            }
            register(email, password, name, profilePicture)
          }}
        >
          Register
        </Button>

        <Text align="center" mt="md">
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: '#228be6',
              textDecoration: 'underline',
            }}
          >
            Login
          </a>
        </Text>
      </Paper>
    </div>
  )
}
