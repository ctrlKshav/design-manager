// app/newChat/page.tsx
"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/themes/newTheme";
import {
  Box,
  Chip,
  Typography,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
  alpha,
  Alert,
} from "@mui/material";
import {
  Send,
  Image,
  Trash2,
  X,
  MessageSquare,
  Save,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import supabase from "@/utils/supabase";
import { ChatLayout } from '@/components/ChatLayout';
import { useStore } from '@/store/useStore';
import type { Conversation } from '@/types/conversation';

export const Route = createFileRoute("/newChat")({
  component: ChatInterface,
  loader: async () => {
    // First authenticate the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: "user@gmail.com",
      password: "realuser"
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { user: null, conversations: [] };
    }

    // Then fetch user's conversations
    const { data: threadsData, error: threadsError } = await supabase
      .from('threads')
      .select(`
        id,
        user_id,
        messages (
          id,
          content,
          created_at,
          user_id,
          admin_id,
          role,
          thread_id
        )
      `)
      .eq('user_id', authData.user?.id);

    if (threadsError) {
      console.error('Error fetching threads:', threadsError);
      return { user: authData.user, conversations: [] };
    }

    // Transform the data into conversations format
    const conversations = threadsData.map((thread) => {
      const threadMessages = thread.messages || [];
      const lastMessage = threadMessages[threadMessages.length - 1];

      return {
        id: thread.id,
        designer: {
          id: thread.user_id,
          name: 'AI Assistant',
          avatar: '',
        },
        messages: threadMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.created_at,
          role: msg.role,
          user: {
            id: msg.user_id,
            name: msg.role,
            avatar: '',
          },
          isRead: true,
        })),
        status: 'new',
        lastMessage: lastMessage ? {
         id: lastMessage.id,
          content: lastMessage.content,
          timestamp: lastMessage.created_at,
          role: lastMessage.role,
          user: {
            id: lastMessage.user_id,
            name: lastMessage.role,
            avatar: '',
          },
          isRead: true,
        } : null,
        unreadCount: 0,
      };
    });

    return { user: authData.user, conversations };
  }
});

async function sendImageAndQuestion(imageFile: File, question: string) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('question', question);

  try {
    const response = await fetch('http://localhost:8000/analyze-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to get analysis');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending image for analysis:', error);
    throw error;
  }
}

async function saveConversationToSupabase(messages: Message[], user: any) {
  try {
    // Fetch the admin ID using the admin's email
    const adminEmail = "admin@gmail.com"; // Replace with the actual admin email
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (adminError || !adminData) throw new Error('Admin not found');

    // First create a conversation thread with admin_id
    const { data: threadData, error: threadError } = await supabase
      .from('threads')
      .insert([{ user_id: user?.id, admin_id: adminData.id , title: "New Chat"}])
      .select()
      .single();

    if (threadError) throw threadError;

    // Then save all messages
    const messagesForDb = messages.map(msg => ({
      thread_id: threadData.id,
      content: msg.content,
      uploaded_content_url: msg.attachments?.[0]?.content,
      created_at: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
      role: msg.role
    }));

    const { error: messagesError } = await supabase
      .from('messages')
      .insert(messagesForDb);

    if (messagesError) throw messagesError;

    return threadData.id;
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

function ChatInterface() {
  const { user, conversations } = useLoaderData({ from: '/newChat' });
  const { setConversations } = useStore();
  const { selectedConversationId } = useStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage, clearChat } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Update store with conversations from loader
  React.useEffect(() => {
    setConversations(conversations);
  }, [conversations, setConversations]);

  // Add this effect to clear the chat store when selecting an existing conversation
  React.useEffect(() => {
    if (selectedConversation) {
      clearChat();
    }
  }, [selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    if (messages.length > 0 && !showSaveButton) {
      setShowSaveButton(true);
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedFile) {
      setError("Please provide both an image and a question");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create user message
      const userMessage: Omit<Message, "id" | "timestamp"> = {
        content: input,
        role: "user",
      };

      // Add user message to UI
      addMessage(userMessage);

      // Send to backend and get analysis
      const analysis = await sendImageAndQuestion(selectedFile, input);

      // Create AI message
      const aiMessage: Omit<Message, "id" | "timestamp"> = {
        content: analysis.response,
        role: "ai",
      };

      // Add AI response to UI
      addMessage(aiMessage);

      // Clear input and selected file
      setInput("");
      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleSaveConversation = async () => {
    setIsSaving(true);
    try {
      await saveConversationToSupabase(messages,  user);
      // Show success message
      setError("Conversation saved successfully!");
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError("Failed to save conversation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ChatLayout conversations={conversations}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto">
          <Paper
            elevation={0}
            sx={{
              height: "85vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: alpha("#6366f1", 0.2),
              boxShadow:
                "0 4px 6px -1px rgb(99 102 241 / 0.1), 0 2px 4px -2px rgb(99 102 241 / 0.1)",
              overflow: "hidden",
              backdropFilter: "blur(8px)",
              background: `linear-gradient(135deg, ${alpha("#fff", 0.9)} 0%, ${alpha(
                "#f3f4f6",
                0.9
              )} 100%)`,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                background: `
                  radial-gradient(circle at top left, ${alpha(
                    "#818cf8",
                    0.1
                  )} 0%, transparent 25%),
                  radial-gradient(circle at bottom right, ${alpha(
                    "#ec4899",
                    0.1
                  )} 0%, transparent 25%)
                `,
                pointerEvents: "none",
              },
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: alpha("#6366f1", 0.2),
                background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 50%)",
                  pointerEvents: "none",
                },
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
                <MessageSquare size={24} />
                {selectedConversation ? 'Conversation History' : 'New Image Analysis Chat'}
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
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: alpha("#f1f5f9", 0.5),
                },
                "&::-webkit-scrollbar-thumb": {
                  background: alpha("#6366f1", 0.2),
                  borderRadius: "4px",
                  "&:hover": {
                    background: alpha("#6366f1", 0.3),
                  },
                },
              }}
            >
              {selectedConversation ? (
                // Show selected conversation messages
                <AnimatePresence>
                  {selectedConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: message.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: message.role === "user" ? "row-reverse" : "row",
                            alignItems: "flex-start",
                            gap: 1.5,
                            maxWidth: "70%",
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: message.role === "user" ? "primary.main" : alpha("#f8fafc", 0.9),
                              color: message.role === "user" ? "white" : "text.primary",
                              borderRadius: message.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                              position: "relative",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-1px)",
                              },
                              boxShadow: message.role === "user"
                                ? "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -2px rgba(99, 102, 241, 0.1)"
                                : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                lineHeight: 1.7,
                                letterSpacing: "-0.01em",
                                wordBreak: "break-word",
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Paper>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            px: 2,
                            color: alpha(
                              message.role === "user" ? "#6366f1" : "#64748b",
                              0.8
                            ),
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                // Show new chat interface
                <>
                  {messages.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        py: 8,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" color="text.primary">
                        Upload an image and ask a question about it!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You can ask questions about the content, style, or details of the image.
                      </Typography>
                    </Box>
                  )}

                  <AnimatePresence>
                    {messages.map((message: Message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: message.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: message.role === "user" ? "row-reverse" : "row",
                              alignItems: "flex-start",
                              gap: 1.5,
                              maxWidth: "70%",
                            }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: message.role === "user" ? "primary.main" : alpha("#f8fafc", 0.9),
                                color: message.role === "user" ? "white" : "text.primary",
                                borderRadius: message.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                                position: "relative",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                },
                                boxShadow: message.role === "user"
                                  ? "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -2px rgba(99, 102, 241, 0.1)"
                                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  lineHeight: 1.7,
                                  letterSpacing: "-0.01em",
                                  wordBreak: "break-word",
                                  mb: message.attachments?.length ? 2 : 0,
                                }}
                              >
                                {message.content}
                              </Typography>

                              {message.attachments?.map((attachment, index) => (
                                attachment.type === "image" && (
                                  <Box
                                    key={index}
                                    sx={{
                                      mt: message.content ? 2 : 0,
                                      borderRadius: 2,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <img
                                      src={attachment.content}
                                      alt="Uploaded content"
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  </Box>
                                )
                              ))}
                            </Paper>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.5,
                              px: 2,
                              color: alpha(
                                message.role === "user" ? "#6366f1" : "#64748b",
                                0.8
                              ),
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        <CircularProgress size={24} sx={{ color: "primary.main" }} />
                      </Box>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}

              {selectedConversation && (
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: alpha('#6366f1', 0.2),
                    bgcolor: alpha('#fff', 0.9),
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Ask a question about your image..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      size="small"
                      multiline
                      maxRows={4}
                      inputRef={inputRef}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: alpha('#f8fafc', 0.8),
                          '&:hover': {
                            bgcolor: '#fff',
                          },
                          '& fieldset': {
                            borderColor: alpha('#6366f1', 0.2),
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            borderWidth: '1px',
                          },
                        },
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Tooltip title="Upload image">
                        <IconButton
                          color="primary"
                          onClick={() => fileInputRef.current?.click()}
                          size="small"
                          sx={{
                            p: 1.25,
                            bgcolor: selectedFile ? alpha('#6366f1', 0.1) : 'transparent',
                            '&:hover': {
                              bgcolor: alpha('#6366f1', 0.1),
                            },
                          }}
                        >
                          <Image size={20} />
                        </IconButton>
                      </Tooltip>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Tooltip title="Send message">
                        <IconButton
                          color="primary"
                          onClick={handleSend}
                          disabled={!input.trim() || !selectedFile || isLoading}
                          sx={{
                            p: 1.25,
                            bgcolor: input.trim() && selectedFile ? 'primary.main' : 'transparent',
                            color: input.trim() && selectedFile ? 'white' : 'inherit',
                            '&:hover': {
                              bgcolor: input.trim() && selectedFile ? 'primary.dark' : alpha('#6366f1', 0.1),
                            },
                            '&.Mui-disabled': {
                              bgcolor: 'transparent',
                              color: alpha('#6366f1', 0.3),
                            },
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: input.trim() && selectedFile
                              ? '0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)'
                              : 'none',
                          }}
                        >
                          <Send size={20} />
                        </IconButton>
                      </Tooltip>
                    </motion.div>

                    {showSaveButton && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tooltip title="Save conversation">
                          <IconButton
                            onClick={handleSaveConversation}
                            disabled={isSaving}
                            sx={{
                              p: 1.25,
                              color: '#10b981',
                              '&:hover': {
                                bgcolor: alpha('#10b981', 0.1),
                              },
                            }}
                          >
                            {isSaving ? (
                              <CircularProgress size={20} sx={{ color: '#10b981' }} />
                            ) : (
                              <Save size={20} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Tooltip title="Clear chat">
                        <IconButton
                          onClick={() => {
                            clearChat();
                            setSelectedFile(null);
                            setInput('');
                          }}
                          sx={{
                            p: 1.25,
                            color: '#ef4444',
                            '&:hover': {
                              bgcolor: alpha('#ef4444', 0.1),
                            },
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </Tooltip>
                    </motion.div>
                  </Box>

                  {selectedFile && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: 'block',
                        color: 'text.secondary',
                      }}
                    >
                      Image selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              )}

              {!selectedConversation && (
                <>
                  {error && (
                    <Alert severity="error" onClose={() => setError("")} sx={{ mx: 2, mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />

                  <Box
                    sx={{
                      p: 2,
                      borderTop: '1px solid',
                      borderColor: alpha('#6366f1', 0.2),
                      bgcolor: alpha('#fff', 0.9),
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask a question about your image..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        size="small"
                        multiline
                        maxRows={4}
                        inputRef={inputRef}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: alpha('#f8fafc', 0.8),
                            '&:hover': {
                              bgcolor: '#fff',
                            },
                            '& fieldset': {
                              borderColor: alpha('#6366f1', 0.2),
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '1px',
                            },
                          },
                        }}
                      />

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tooltip title="Upload image">
                          <IconButton
                            color="primary"
                            onClick={() => fileInputRef.current?.click()}
                            size="small"
                            sx={{
                              p: 1.25,
                              bgcolor: selectedFile ? alpha('#6366f1', 0.1) : 'transparent',
                              '&:hover': {
                                bgcolor: alpha('#6366f1', 0.1),
                              },
                            }}
                          >
                            <Image size={20} />
                          </IconButton>
                        </Tooltip>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tooltip title="Send message">
                          <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || !selectedFile || isLoading}
                            sx={{
                              p: 1.25,
                              bgcolor: input.trim() && selectedFile ? 'primary.main' : 'transparent',
                              color: input.trim() && selectedFile ? 'white' : 'inherit',
                              '&:hover': {
                                bgcolor: input.trim() && selectedFile ? 'primary.dark' : alpha('#6366f1', 0.1),
                              },
                              '&.Mui-disabled': {
                                bgcolor: 'transparent',
                                color: alpha('#6366f1', 0.3),
                              },
                              transition: 'all 0.2s ease-in-out',
                              boxShadow: input.trim() && selectedFile
                                ? '0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)'
                                : 'none',
                            }}
                          >
                            <Send size={20} />
                          </IconButton>
                        </Tooltip>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tooltip title="Save conversation">
                          <IconButton
                            onClick={handleSaveConversation}
                            disabled={isSaving}
                            sx={{
                              p: 1.25,
                              color: '#10b981',
                              '&:hover': {
                                bgcolor: alpha('#10b981', 0.1),
                              },
                            }}
                          >
                            {isSaving ? (
                              <CircularProgress size={20} sx={{ color: '#10b981' }} />
                            ) : (
                              <Save size={20} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tooltip title="Clear chat">
                          <IconButton
                            onClick={() => {
                              clearChat();
                              setSelectedFile(null);
                              setInput('');
                            }}
                            sx={{
                              p: 1.25,
                              color: '#ef4444',
                              '&:hover': {
                                bgcolor: alpha('#ef4444', 0.1),
                              },
                            }}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Tooltip>
                      </motion.div>
                    </Box>

                    {selectedFile && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          display: 'block',
                          color: 'text.secondary',
                        }}
                      >
                        Image selected: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </div>
      </div>
    </ChatLayout>
  );
}

export default ChatInterface;