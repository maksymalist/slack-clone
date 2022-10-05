import { Avatar } from '@mantine/core'
import React from 'react'
import { User } from '../types'

type Props = {
  member: User
}

const MemberCard = (props: Props) => {
  return (
    <div>
      <Avatar
        src={props.member.profilePic}
        alt={props.member.name}
        size="md"
        radius={50}
        style={{ margin: '0 auto' }}
      />
      <p>{props.member.name}</p>
    </div>
  )
}

export default MemberCard
