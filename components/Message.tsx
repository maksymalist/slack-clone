import {
  Avatar,
  Button,
  Text,
  HoverCard,
  Tooltip,
  ActionIcon,
} from '@mantine/core'
import React, { useContext, useState } from 'react'
import { Message, Reaction, User } from '../types'
import useFormatDate from '../hooks/useFormatDate'

//icons
import { IconMessage, IconMoodSmile } from '@tabler/icons'

import { UserContext } from '../pages/_app'
import { getCookie } from 'cookies-next'
import axios from 'axios'
import { showNotification } from '@mantine/notifications'

type Props = {
  message: Message
  setReplyingTo: (replyingTo: Message) => void
  showEmojiPicker: (show: boolean) => void
  setCurrentMessage: (message: string) => void
}

const Message = (props: Props) => {
  const { user: current_user } = useContext(UserContext) as { user: User }
  const msg = props.message
  const user: User = msg.owner
  const date = useFormatDate(new Date(msg.createdAt))

  const [showingReplies, setShowingReplies] = useState(false)

  type ReactionCount = {
    id: string
    emoji: string
    message: Message
    messageId: string
    users: string[]
    count: number
  }

  const group_reactions = (reactions: Reaction[]): ReactionCount[] => {
    const new_reactions: ReactionCount[] = []
    for (let i = 0; i < reactions.length; i++) {
      const reaction: any = reactions[i]

      const reactionCount = reactions.filter((r) => r.emoji === reaction.emoji)

      reaction.count = reactionCount.length
      reaction.users = reactionCount.map((r) => r.userId)

      if (!new_reactions.some((r) => r.emoji === reaction.emoji)) {
        new_reactions.push(reaction)
      }
    }

    return new_reactions as ReactionCount[]
  }

  const add_reaction = async (emoji: string, messageId: string) => {
    const token = getCookie('auth-token')
    if (!token) return

    try {
      axios.post(
        '/api/create/reaction',
        {
          emoji: emoji,
          messageId: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'An error occured',
        color: 'red',
      })
    }
  }

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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {group_reactions(msg.reactions || [])?.map(
                    (reaction: ReactionCount) => {
                      const isReacted = reaction.users.includes(
                        current_user?.id || ''
                      )
                      return (
                        <Button
                          size="xs"
                          mr={5}
                          variant={isReacted ? 'filled' : 'outline'}
                          color={isReacted ? 'blue' : 'gray'}
                          onClick={() => add_reaction(reaction.emoji, msg.id)}
                        >
                          <img
                            src={reaction?.emoji}
                            alt="reaction"
                            style={{
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          <div
                            style={{
                              width: '5px',
                            }}
                          />
                          <Text>{reaction.count}</Text>
                        </Button>
                      )
                    }
                  )}
                </div>
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
                props.showEmojiPicker(true)
                props.setCurrentMessage(msg.id)
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
                <Message
                  message={reply}
                  setReplyingTo={props.setReplyingTo}
                  showEmojiPicker={props.showEmojiPicker}
                  setCurrentMessage={props.setCurrentMessage}
                />
              )
            })
          ) : msg.replies.length > 0 ? (
            <Button
              onClick={() => setShowingReplies(true)}
              variant="subtle"
              size="xs"
            >
              {msg.replies.length} REPLIES
            </Button>
          ) : null}
        </div>
        {showingReplies && (
          <Button
            onClick={() => setShowingReplies(false)}
            variant="subtle"
            color="red"
            size="xs"
          >
            HIDE
          </Button>
        )}
      </div>
    </>
  )
}

export default Message
