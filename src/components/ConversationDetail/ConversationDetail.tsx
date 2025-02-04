import React, { useState } from 'react';
import {
  Box,
  TextField,  
  Stack,
  Snackbar,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useStore } from '@/store/useStore';

export const ConversationDetail: React.FC = () => {
  const { selectedConversationId } = useStore();
  const { conversations } = useStore();
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const [comment, setComment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = () => {
    if (comment.trim()) {
      // TODO: Implement sending message
      setSnackbarOpen(true);
      setComment('');
    }
  };

  if (!selectedConversation) {
    return (
      <Box 
        sx={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Select a conversation to view messages
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box 
        sx={{ 
          flexGrow: 1,
          overflow: 'auto',
          pb: '200px', // Space for reply container
        }}
      >
        <Stack spacing={2} sx={{ p: 3 }}>
          {selectedConversation.messages.map((message) => (
            <MessageBubble 
              key={message.id}
              message={message}
            />
          ))}
        </Stack>
      </Box>

      <Box 
        sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 0,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={1}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your reply..."
            variant="outlined"
            sx={{ mb: 0, flexGrow: 1, height: '56px' }}
            InputProps={{ style: { fontFamily: 'Poppins , Sans Serif' } }}
          />
          <Button
            variant="contained"
            sx={{fontFamily: 'Montserrat, Sans Serif', ml: 1, height: '56px' }}
            endIcon={<SendIcon size={16} />}
            onClick={handleSubmit}
            disabled={!comment.trim()}
          >
            Send
          </Button>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Reply sent successfully"
      />
    </Box>
  );
};