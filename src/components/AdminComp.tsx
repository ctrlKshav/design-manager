import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConversationList } from '@/components/ConversationList/ConversationList';
import { ConversationDetail } from '@/components/ConversationDetail/ConversationDetail';
import { useLoaderData } from '@tanstack/react-router';
import supabase from '@/utils/supabase';
import type { Conversation } from '@/types/conversation';
import { useStore } from '@/store/useStore';

// Sample data - replace with actual API calls
const mockConversations = [
  {
    id: '1',
    designer: {
      id: 'designer1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    messages: [
      {
        id: 'm1',
        content: 'Here is the initial feedback for your design.',
        timestamp: new Date().toISOString(),
        sender: 'ai',
        user: {
          id: 'ai1',
          name: 'AI Assistant',
          avatar: '',
        },
        isRead: false,
      },
    ],
    status: 'new',
    lastMessage: {
      id: 'm1',
      content: 'Here is the initial feedback for your design.',
      timestamp: new Date().toISOString(),
      sender: 'ai',
      user: {
        id: 'ai1',
        name: 'AI Assistant',
        avatar: '',
      },
      isRead: false,
    },
    unreadCount: 1,
  },
] as const;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
    },
    secondary: {
      main: '#9c27b0',
      light: '#f3e5f5',
    },
  },
});

function AdminComp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useLoaderData({ from: '/admin-route' });

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        // Step 1: Fetch conversation threads using admin_id
        const { data: threadsData, error: threadsError } = await supabase
          .from('conversation_threads')
          .select(`
            id,
            user_id
            `)
          .eq('admin_id', user?.id);

        if (threadsError) throw threadsError;

        // Step 2: Fetch messages for each thread
        const threadIds = threadsData.map(thread => thread.id);
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            text,
            created_at,
            sender_id,
            thread_id
          `)
          .in('thread_id', threadIds);

        if (messagesError) throw messagesError;

        // Step 3: Transform the data into the Conversation format
        const formattedConversations = threadsData.map((thread) => {
          const threadMessages = messagesData.filter(msg => msg.thread_id === thread.id);
          const lastMessage = threadMessages[threadMessages.length - 1];

          return {
            id: thread.id,
            designer: {
              id: 'designer_id_placeholder', // Replace with actual designer ID if available
              name: 'designer_name_placeholder', // Replace with actual designer name if available
              avatar: 'designer_avatar_placeholder', // Replace with actual designer avatar if available
            },
            messages: threadMessages.map((msg) => ({
              id: msg.id,
              content: msg.text,
              timestamp: msg.created_at,
              sender: msg.sender_id,
              user: {
                id: thread.user_id,
                name: msg.sender_id === 'ai' ? 'AI Assistant' : 'User Name Placeholder', // Replace with actual user name if available
                avatar: msg.sender_id === 'ai' ? '' : 'User Avatar Placeholder', // Replace with actual user avatar if available
              },
              isRead: true,
            })),
            status: 'new' as 'new', // Ensure status is of type 'new'
            lastMessage: {
              id: lastMessage.id,
              content: lastMessage.text,
              timestamp: lastMessage.created_at,
              sender: lastMessage.sender_id,
              user: {
                id: thread.user_id,
                name: lastMessage.sender_id === 'ai' ? 'AI Assistant' : 'User Name Placeholder', // Replace with actual user name if available
                avatar: lastMessage.sender_id === 'ai' ? '' : 'User Avatar Placeholder', // Replace with actual user avatar if available
              },
              isRead: true,
            },
            unreadCount: 0,
          };
        });

        setConversations(formattedConversations);
        useStore.getState().setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchThreads();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid2 container sx={{ height: '100vh' }}>
        <Grid2
          component="div"
          item={true}
          xs={12}
          md={4}
          sx={{ 
            borderRight: 1, 
            borderColor: 'divider',
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <ConversationList conversations={conversations} />
        </Grid2>
        <Grid2 
          item 
          xs={12} 
          md={8} 
          sx={{ 
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <ConversationDetail />
        </Grid2>
      </Grid2>
    </ThemeProvider>
  );
}

export default AdminComp
