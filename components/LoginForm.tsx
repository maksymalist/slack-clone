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
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

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

export default function LoginForm() {
  const { classes } = useStyles()
  const [_, login] = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
          Welcome back to Mantine!
        </Title>

        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button
          fullWidth
          mt="xl"
          size="md"
          onClick={() => {
            login(email, password)
          }}
        >
          Login
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            style={{
              color: '#228be6',
              textDecoration: 'underline',
            }}
          >
            Register
          </a>
        </Text>
      </Paper>
    </div>
  )
}
