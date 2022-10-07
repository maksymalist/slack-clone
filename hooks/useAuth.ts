import { showNotification } from '@mantine/notifications'
import { getCookie, deleteCookie, setCookie } from 'cookies-next'
import axios from 'axios'

const login = async (email: string, password: string) => {
  try {
    const user = await axios.post('/api/auth/login', { email, password })
    if (user) {
      setCookie('auth-token', user.data.token)
      showNotification({
        title: 'Successfully logged in !',
        message: 'a wild user appeared...',
        color: 'green',
        autoClose: 2500,
      })
      window.location = '/' as any
    }
  } catch (error: any) {
    console.log(error)
    showNotification({
      title: 'Error !',
      message: error.message,
      color: 'red',
      autoClose: 2500,
    })
  }
}
const register = async (
  email: string,
  password: string,
  name: string,
  profilePic: string
) => {
  try {
    const token = await axios.post('/api/auth/register', {
      email,
      password,
      name,
      profilePic,
    })
    if (token) {
      showNotification({
        title: 'Successfully registered !',
        message: 'a wild user appeared...',
        color: 'green',
        autoClose: 2500,
      })
      setCookie('auth-token', token.data.token)
      window.location = '/' as any
    }
  } catch (error: any) {
    console.log(error)
    showNotification({
      title: 'Error !',
      message: error.message,
      color: 'red',
      autoClose: 2500,
    })
  }
}
const logout = () => {
  deleteCookie('auth-token')
  window.location = '/login' as any
}

type Auth = [
  (
    email: string,
    password: string,
    name: string,
    profilePic: string
  ) => Promise<void>,
  (email: string, password: string) => Promise<void>,
  () => void
]

const useAuth = (): Auth => {
  return [register, login, logout]
}
export default useAuth
