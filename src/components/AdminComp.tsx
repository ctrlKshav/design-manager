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
        console.log('Fetching threads for admin:', user?.id);
        
        const { data: threadsData, error: threadsError } = await supabase
          .from('threads')
          .select(`
            id,
            user_id,
            admin_id
          `)
          .eq('admin_id', user?.id);

        console.log('Threads data:', threadsData);
        console.log('Threads error:', threadsError);

        if (threadsError) throw threadsError;
        if (!threadsData || threadsData.length === 0) {
          console.log('No threads found');
          setConversations([]);
          useStore.getState().setConversations([]);
          setLoading(false);
          return;
        }

        const threadIds = threadsData.map(thread => thread.id);
        console.log('Thread IDs:', threadIds);

        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            thread_id,
            user_id,
            admin_id,
            role,
            content,
            uploaded_content_url,
            created_at
          `)
          .in('thread_id', threadIds);

        console.log('Messages data:', messagesData);
        console.log('Messages error:', messagesError);

        if (messagesError) throw messagesError;

        // Transform the data into the Conversation format
        const formattedConversations = threadsData.map((thread) => {
          const threadMessages = messagesData.filter(msg => msg.thread_id === thread.id);
          const lastMessage = threadMessages[threadMessages.length - 1];

          return {
            id: thread.id,
            designer: {
              id: thread.user_id,
              name: 'User', // We can update this if we have user details
              avatar: '',
            },
            messages: threadMessages.map((msg) => ({
              id: msg.id.toString(),
              content: msg.content,
              timestamp: msg.created_at,
              role: msg.role as 'user' | 'admin' | 'ai' | 'system',
              user: {
                id: msg.user_id || msg.admin_id || 'ai',
                name: msg.role === 'admin' ? 'Admin' : msg.role === 'ai' ? 'AI Assistant' : 'User',
                avatar: '',
              },
              isRead: true,
            })),
            status: 'new' as const,
            lastMessage: lastMessage ? {
              id: lastMessage.id,
              content: lastMessage.content,
              timestamp: lastMessage.created_at,
              role: lastMessage.role as 'user' | 'admin' | 'ai' | 'system',
              user: {
                id: lastMessage.user_id || lastMessage.admin_id || 'ai',
                name: lastMessage.role === 'admin' ? 'Admin' : lastMessage.role === 'ai' ? 'AI Assistant' : 'User',
                avatar: '',
              },
              isRead: true,
            } : {
              id: '0',
              content: 'No messages yet',
              timestamp: new Date().toISOString(),
              role: 'system' as 'system',
              user: {
                id: 'system',
                name: 'System',
                avatar: '',
              },
              isRead: true,
            },
            unreadCount: 0,
          };
        });

        setConversations(formattedConversations);
        useStore.getState().setConversations(formattedConversations);
      } catch (error) {
        console.error('Error in fetchThreads:', error);
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
