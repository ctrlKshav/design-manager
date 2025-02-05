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
import supabase from '@/utils/supabase';
import { useLoaderData } from '@tanstack/react-router';

export const ConversationDetail: React.FC = () => {
  const { selectedConversationId } = useStore();
  const { conversations } = useStore();
  const { user } = useLoaderData({ from: '/admin-route' });
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const [comment, setComment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || !selectedConversationId || !user?.id) return;

    setIsSubmitting(true);
    try {
      // Insert the message into the database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            thread_id: selectedConversationId,
            admin_id: user.id,
            role: 'admin',
            content: comment.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      // Update the local state
      const newMessage = {
        id: messageData.id.toString(),
        content: messageData.content,
        timestamp: messageData.created_at,
        role: 'admin' as const,
        user: {
          id: user.id,
          name: 'Admin',
          avatar: '',
        },
        isRead: true,
      };

      // Update the conversations in the store
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
            status: 'reviewed' as const // Update status when admin replies
          };
        }
        return conv;
      });

      useStore.getState().setConversations(updatedConversations);
      setSnackbarOpen(true);
      setComment('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
              message={{
                ...message,
                content: message.content
              }}
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
            onKeyPress={handleKeyPress}
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
            disabled={!comment.trim() || isSubmitting}
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