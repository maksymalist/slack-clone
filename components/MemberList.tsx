import { Avatar, Button, CopyButton, Popover, Text } from '@mantine/core'
import { IconClipboard, IconClipboardCheck, IconUserPlus } from '@tabler/icons'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../pages/_app'
import { User, Workspace } from '../types'
import MemberCard from './MemberCard'

const MemberList = () => {
  const { activeWorkspace, user } = useContext(UserContext) as {
    activeWorkspace: Workspace
    user: User
  }
  const [members, setMembers] = useState<User[]>([])
  const ownerId = activeWorkspace.ownerId

  useEffect(() => {
    setMembers(activeWorkspace.members)
  }, [activeWorkspace.members])

  const delete_member = async (memberId: string) => {
    const res = await axios.post(`/api/delete/member/`, {
      memberId,
      workspaceId: activeWorkspace.id,
    })
    setMembers(
      res?.data.members
        ? res.data.members
        : members.filter((m) => m.id !== memberId)
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #E8ECEF',
        borderTop: 'none',
        padding: '20px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Text weight="bold">Owner &mdash; 1</Text>
        {members?.map((member: User) => {
          if (member.id !== ownerId) return null

          return <MemberCard user={member} />
        })}
        <br></br>
        <Text weight="bold">Members &mdash; 1</Text>
        {members?.map((member: User) => {
          if (member.id === ownerId) return null

          if (user.id === ownerId)
            return (
              <Popover position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <a>
                    <MemberCard user={member} />
                  </a>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="sm">
                    <Button
                      color="red"
                      variant="outline"
                      onClick={() => {
                        delete_member(member.id)
                      }}
                    >
                      kick out
                      <b style={{ marginLeft: '5px' }}>{member.name}</b>
                    </Button>
                  </Text>
                </Popover.Dropdown>
              </Popover>
            )
          else return <MemberCard user={member} />
        })}
      </div>
      <CopyButton value={`http://localhost:3000/join/${activeWorkspace.id}`}>
        {({ copied, copy }) => (
          <Button
            fullWidth
            variant="outline"
            color={copied ? 'teal' : 'blue'}
            mt={20}
            onClick={copy}
            rightIcon={
              copied ? (
                <IconClipboardCheck size={15} />
              ) : (
                <IconClipboard size={15} />
              )
            }
          >
            {copied ? 'Copied Invite Link' : 'Copy Invite Link'}
          </Button>
        )}
      </CopyButton>
    </div>
  )
}

export default MemberList
