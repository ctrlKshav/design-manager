import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '@/types/conversation';

interface ConversationItemProps {
  conversation: Conversation;
  selected?: boolean;
  onClick?: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  selected = false,
  onClick = () => {},
}) => {
  const { designer, lastMessage, unreadCount } = conversation;

  return (
    <ListItem
      button
      selected={selected}
      onClick={onClick}
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'primary.light',
        },
      }}
    >
      <ListItemAvatar>
        <Badge
          badgeContent={unreadCount}
          color="primary"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar src={designer.avatar} alt={designer.name} />
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            component="span"
            variant="body1"
            color="text.primary"
            noWrap
            sx={{ display: 'block', fontFamily: 'Poppins, Sans Serif', fontWeight: 600 }}
          >
            {designer.name}
          </Typography>
        }
        secondary={
          lastMessage && (
            <>
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                noWrap
                sx={{ display: 'block', fontFamily: 'Poppins, Sans Serif' }}
              >
                {lastMessage.content}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: 'Outfit, Sans Serif' }}
              >
                {formatDistanceToNow(new Date(lastMessage.timestamp), {
                  addSuffix: true,
                })}
              </Typography>
            </>
          )
        }
      />
    </ListItem>
  );
};