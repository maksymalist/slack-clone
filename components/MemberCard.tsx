import { Avatar, Text } from '@mantine/core'
import { User } from '../types'

const MemberCard = ({ user }: { user: User }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
      }}
    >
      <Avatar
        src={
          user.profilePic ||
          `https://avatars.dicebear.com/api/bottts/${user.id}.svg`
        }
        alt="Mantine"
        size="md"
        style={{
          marginRight: '10px',
          border: '1px solid #e4e2e2',
        }}
        radius="xl"
      />
      <Text>{user.name}</Text>
    </div>
  )
}

export default MemberCard
