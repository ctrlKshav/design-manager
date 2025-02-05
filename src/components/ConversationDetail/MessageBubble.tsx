import React from 'react';
import { Box, Typography, Tooltip, Paper, IconButton } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import type { Message } from '@/types/conversation';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAdmin = message.role === 'admin';
  const isAI = message.role === 'ai';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Tooltip
        title={formatDistanceToNow(new Date(message.timestamp), {
          addSuffix: true,
        })}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isAdmin ? 'success.light' : isAI ? 'primary.light' : 'secondary.light',
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
            {isAdmin ? 'Admin' : isAI ? 'AI Assistant' : 'User'}
          </Typography>
          <Typography variant="body1">
            <ReactMarkdown>{message.content}</ReactMarkdown>
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