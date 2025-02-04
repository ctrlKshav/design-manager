import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material";
import { theme } from "@/themes/newTheme";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import supabase from '@/utils/supabase';
import type { Message } from "@/types";
import { useLoaderData } from '@tanstack/react-router';

export default function AdminPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user:user} = useLoaderData({from: '/admin-route'});


  useEffect(() => {
    const fetchThreadsAndMessages = async () => {
      try {
        console.log(user)
        
        // Fetch threads using admin_id
        const { data: threadsData, error: threadsError } = await supabase
          .from('conversation_threads')
          .select('id')
          .eq('admin_id', user?.id);
          console.log(threadsData)

        if (threadsError) throw threadsError;

        // Fetch messages for each thread
        const messagesPromises = threadsData.map(async (thread: any) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('thread_id', thread.id);
            console.log(messagesData)

          if (messagesError) throw messagesError;

          return { threadId: thread.id, messages: messagesData };
        });

        const threadsWithMessages = await Promise.all(messagesPromises);
        setThreads(threadsWithMessages);
      } catch (err) {
        console.error('Error fetching threads and messages:', err);
        setError("Failed to load threads and messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchThreadsAndMessages();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Paper
            elevation={0}
            sx={{
              height: "85vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "rgba(99, 102, 241, 0.2)",
              overflow: "hidden",
              backdropFilter: "blur(8px)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(243, 244, 246, 0.9) 100%)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "rgba(99, 102, 241, 0.2)",
                background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                Admin Conversation Threads
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress size={24} sx={{ color: "primary.main" }} />
                </Box>
              )}

              {error && (
                <Alert severity="error" onClose={() => setError("")} sx={{ mx: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              {threads.map((thread) => (
                <Box key={thread.threadId} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Thread ID: {thread.threadId}
                  </Typography>
                  {thread.messages.map((message: any) => (
                    <Paper
                      key={message.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: message.sender === "user" ? "primary.main" : "rgba(248, 250, 252, 0.9)",
                        color: message.sender === "user" ? "white" : "text.primary",
                        borderRadius: message.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {message.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ))}
            </Box>
          </Paper>
        </div>
      </div>
    </ThemeProvider>
  );
}