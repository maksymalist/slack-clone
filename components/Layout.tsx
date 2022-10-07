import type { NextPage } from 'next'
import Head from 'next/head'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import styles from '../styles/Home.module.css'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { User } from '../types'
import { getCookie } from 'cookies-next'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { UserContext } from '../pages/_app'
import MemberList from './MemberList'

type Props = {
  children: React.ReactNode
}

const Layout = (props: Props) => {
  const auth: any = useContext(UserContext)
  const router = useRouter()

  const me = async () => {
    const token = getCookie('auth-token')

    if (!token) {
      router.push('/login')
      return
    }

    const res = await axios.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    auth.setUser(res.data)
  }
  useEffect(() => {
    me()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          flex: '0 0 300px',
          height: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        <SideBar />
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        <TopBar />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
          }}
        >
          <div
            style={{
              flex: 80,
            }}
          >
            {props.children}
          </div>
          {router.pathname !== '/' && (
            <div
              style={{
                flex: 20,
                height: '100%',
                position: 'sticky',
                top: 60,
              }}
            >
              <MemberList />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
