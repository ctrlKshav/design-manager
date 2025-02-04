import React from 'react';
import { Box, Typography, Tooltip, Paper, IconButton } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAI ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Tooltip
        title={formatDistanceToNow(new Date(message.timestamp ? message.timestamp : 0), {
          addSuffix: true,
        })}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isAI ? 'primary.light' : 'secondary.light',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{fontFamily: 'Outfit, Sans Serif' }}>
            {message.content}
          </Typography>
        </Paper>
      </Tooltip>
      <IconButton
        size="small"
        sx={{
          mt: 0.5,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <MessageCircle size={16} />
      </IconButton>
    </Box>
  );
};