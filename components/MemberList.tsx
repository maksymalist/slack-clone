import { Text } from '@mantine/core'
import React, { useContext } from 'react'
import { UserContext } from '../pages/_app'
import { User } from '../types'
import MemberCard from './MemberCard'

const MemberList = () => {
  const {
    activeWorkspace: { members, ownerId },
  } = useContext(UserContext) as {
    activeWorkspace: { members: User[]; ownerId: string }
  }

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
      }}
    >
      <Text align="center">Owner ―― 1</Text>
      {members?.map((member: User) => {
        if (member.id !== ownerId) return null

        return <MemberCard key={member.id} member={member} />
      })}

      <Text align="center">Members ―― 1</Text>
      {members?.map((member: User) => {
        if (member.id === ownerId) return null

        return <MemberCard key={member.id} member={member} />
      })}
    </div>
  )
}

export default MemberList
