import {
  Avatar,
  Button,
  Text,
  HoverCard,
  Tooltip,
  ActionIcon,
} from '@mantine/core'
import React, { useState } from 'react'
import { Message, User } from '../types'
import useFormatDate from '../hooks/useFormatDate'

//icons
import { IconMessage, IconMoodSmile } from '@tabler/icons'

type Props = {
  message: Message
  setReplyingTo: (replyingTo: Message) => void
}

const Message = (props: Props) => {
  const msg = props.message
  const user: User = msg.owner
  const date = useFormatDate(new Date(msg.createdAt))

  const [showingReplies, setShowingReplies] = useState(false)

  return (
    <>
      <HoverCard position="top-end">
        <HoverCard.Target>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              {msg.replyToId ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    style={{
                      borderBottom: '1px solid #e4e2e2',
                      borderLeft: '1px solid #e4e2e2',
                      width: '30px',
                      height: '30px',
                      marginRight: '10px',
                      borderRadius: '0 0 0 5px',
                    }}
                  ></div>
                  <Avatar
                    src={
                      user?.profilePic ||
                      `https://avatars.dicebear.com/api/bottts/${user?.id}.svg`
                    }
                    alt="Mantine"
                    radius={50}
                    size="md"
                    mr={10}
                    style={{
                      border: '1px solid #e4e2e2',
                    }}
                  />
                </div>
              ) : (
                <Avatar
                  src={
                    user?.profilePic ||
                    `https://avatars.dicebear.com/api/bottts/${user?.id}.svg`
                  }
                  alt="Mantine"
                  radius={50}
                  size="md"
                  mr={10}
                  style={{
                    border: '1px solid #e4e2e2',
                  }}
                />
              )}
            </div>
            <div>
              <div>
                <Text mb={0}>
                  <b>{user?.name + ' '}</b>
                  <i>{date}</i>
                </Text>
                <Text>{msg.content}</Text>
              </div>
            </div>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Tooltip label="add reaction 😂" position="top" withArrow>
            <ActionIcon
              size="lg"
              color="blue"
              variant="light"
              p={2}
              style={{
                marginRight: '10px',
              }}
              onClick={() => {
                setShowingReplies(!showingReplies)
              }}
            >
              <IconMoodSmile />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="reply to message 💬" position="top" withArrow>
            <ActionIcon
              size="lg"
              color="blue"
              p={2}
              variant="light"
              onClick={() => {
                props.setReplyingTo(msg)
              }}
            >
              <IconMessage />
            </ActionIcon>
          </Tooltip>
        </HoverCard.Dropdown>
      </HoverCard>
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <div>
          {showingReplies ? (
            msg?.replies.map((reply: Message) => {
              return (
                <Message message={reply} setReplyingTo={props.setReplyingTo} />
              )
            })
          ) : msg.replies.length > 0 ? (
            <Button
              onClick={() => setShowingReplies(true)}
              variant="light"
              size="xs"
            >
              show replies ({msg.replies.length})
            </Button>
          ) : null}
        </div>
        {showingReplies && (
          <Button
            onClick={() => setShowingReplies(false)}
            variant="light"
            color="red"
            size="xs"
          >
            hide replies
          </Button>
        )}
      </div>
    </>
  )
}

export default Message
