"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@mui/material";
import {theme} from "@/themes/newTheme";
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
  LinkIcon,
  X,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/types";
import { isValidUrl } from "@/utils/validation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/newChat")({
    component: ChatInterface,
})

 function ChatInterface() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage, clearChat } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]); // Added scrollToBottom to dependencies

  const handleSend = async () => {
    if (!input.trim()) return;

    if (isLinkMode) {
      if (!isValidUrl(input)) {
        setUrlError("Please enter a valid URL");
        return;
      }
      setUrlError("");
    }

    const tags = input.match(/@(\w+)/g)?.map((tag) => tag.slice(1)) || [];
    const messageContent = isLinkMode
      ? {
          content: "",
          attachments: [{ type: "url", content: input }],
        }
      : { content: input };
    addMessage({
      ...messageContent,
      sender: "user",
      tags,
      attachments: messageContent.attachments?.map((attachment) => ({
        ...attachment,
        type: attachment.type as "image" | "url",
      })),
    });

    setIsLoading(true);
    setTimeout(() => {
      if (tags.length > 0) {
        tags.forEach((tag) => {
          addMessage({
            content: `AI response simulating ${tag}'s style: This is a placeholder response that would match ${tag}'s preferences and tone.`,
            sender: "ai",
            isAiResponse: true,
            tags: [tag],
          });
        });
      }
      setIsLoading(false);
    }, 1000);

    setInput("");
    setIsLinkMode(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLinkMode = () => {
    setIsLinkMode(!isLinkMode);
    setUrlError("");
    setInput("");
    if (!isLinkMode) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        addMessage({
          content: "",
          sender: "user",
          attachments: [
            {
              type: "image",
              content: reader.result as string,
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    // Implement your image click handling logic here
    console.log("Image clicked:", imageUrl);
  };

  const imageOverlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

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
          Design Manager Chat
        </Typography>
      </Box>
      <motion.div
        initial={false}
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(129,140,248,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(129,140,248,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      />

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
              Try sending a message to get started!
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: "sm" }}>
              <Typography variant="body2" color="text.secondary">
                Example Prompts : 
              </Typography>
              {[
                "Would PM like this?",
                "Lorem Ipsum",
                "What feedback would we get",
              ].map((prompt, i) => (
                <Paper
                  key={i}
                  onClick={() => setInput(prompt)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor: alpha("#f8fafc", 0.9),
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "#fff",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -2px rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  <Typography variant="body2">{prompt}</Typography>
                </Paper>
              ))}
            </Box>
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
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 1.5,
                    maxWidth: "70%",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor:
                        message.sender === "user"
                          ? "primary.main"
                          : alpha("#f8fafc", 0.9),
                      color:
                        message.sender === "user" ? "white" : "text.primary",
                      borderRadius:
                        message.sender === "user"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                      boxShadow:
                        message.sender === "user"
                          ? "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -2px rgba(99, 102, 241, 0.1)"
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {message.content && (
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
                    )}

                    {/* Add rendering for URL attachments */}
                    {message.attachments?.map((attachment, index) => {
                      if (attachment.type === "url") {
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: message.content ? 2 : 0,
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                message.sender === "user"
                                  ? alpha("#fff", 0.1)
                                  : alpha("#6366f1", 0.05),
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                bgcolor:
                                  message.sender === "user"
                                    ? alpha("#fff", 0.15)
                                    : alpha("#6366f1", 0.1),
                              },
                            }}
                          >
                            <ExternalLink size={16} />
                            <a
                              href={attachment.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color:
                                  message.sender === "user"
                                    ? "white"
                                    : "#6366f1",
                                textDecoration: "none",
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {attachment.content}
                            </a>
                          </Box>
                        );
                      }
                      if (attachment.type === "image") {
                        return ( // Added return statement and fixed curly braces
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              cursor: "pointer",
                              borderRadius: 2,
                              overflow: "hidden",
                              mt: message.content ? 2 : 0,
                              "&:hover": {
                                "& .image-overlay": {
                                  opacity: 1,
                                },
                              },
                            }}
                            onClick={() => handleImageClick(attachment.content)}
                          >
                            <img
                              src={attachment.content}
                              alt="Uploaded content"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                display: "block", // Added to prevent unwanted spacing
                              }}
                            />
                            <Box
                              className="image-overlay"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.2s ease-in-out",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "white",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                }}
                              >
                                Click to expand
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }
                      return null;
                    })}
                    {message.tags && message.tags.length > 0 && (
                      <Box
                        sx={{
                          mt: 1.5,
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        {message.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={`@${tag}`}
                            size="small"
                            sx={{
                              bgcolor:
                                message.sender === "user"
                                  ? alpha("#fff", 0.2)
                                  : alpha("#6366f1", 0.1),
                              color:
                                message.sender === "user"
                                  ? "white"
                                  : "primary.main",
                              fontWeight: 500,
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    px: 2,
                    color: alpha(
                      message.sender === "user" ? "#6366f1" : "#64748b",
                      0.8
                    ),
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
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
      </Box>

      {urlError && (
        <Alert severity="error" onClose={() => setUrlError("")} sx={{ mx: 2, mb: 2 }}>
          {urlError}
        </Alert>
      )}

<Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on large
    alignItems: "center",
    gap: 2, // Space between input and buttons
  }}
>
  {/* Input Field */}
  <motion.div
    style={{ flexGrow: 1, width: "100%" }}
    animate={{ scale: isLinkMode ? 1.02 : 1 }}
    transition={{ duration: 0.2 }}
  >
    <TextField
      fullWidth
      variant="outlined"
      placeholder={isLinkMode ? "Paste URL here..." : "Type a message... (Use @ to tag people)"}
      value={input}
      onChange={(e) => {
        setInput(e.target.value);
        if (isLinkMode) setUrlError("");
      }}
      onKeyPress={handleKeyPress}
      size="small"
      multiline={!isLinkMode}
      maxRows={4}
      inputRef={inputRef}
      sx={{
        mt:2,
        py:1,
        px:2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          bgcolor: alpha("#f8fafc", 0.8),
          "&:hover": { bgcolor: "#fff" },
          "& fieldset": {
            borderColor: isLinkMode ? "primary.main" : alpha("#6366f1", 0.2),
          },
          "&:hover fieldset": { borderColor: "primary.main" },
          "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
          // Add responsive font size
          fontSize: { xs: "0.875rem", sm: "1rem" },
          "& input::placeholder, & textarea::placeholder": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        },
      }}
    />
  </motion.div>

  {/* Buttons Wrapper */}
  <Box
    sx={{
      display: "flex",
      gap: 1,
      justifyContent: { xs: "center", md: "flex-end" }, // Centered on small, right-aligned on large
      width: { xs: "100%", md: "auto" }, // Full width on small screens
    }}
  >
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Tooltip title="Upload image">
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          size="small"
          disabled={isLinkMode}
          sx={{
            p: 1.25,
            "&:hover": { bgcolor: alpha("#6366f1", 0.1) },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Image size={20} />
        </IconButton>
      </Tooltip>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Tooltip title={isLinkMode ? "Cancel link" : "Add link"}>
        <IconButton
          color="primary"
          size="small"
          onClick={toggleLinkMode}
          sx={{
            p: 1.25,
            bgcolor: isLinkMode ? alpha("#6366f1", 0.1) : "transparent",
            "&:hover": { bgcolor: alpha("#6366f1", 0.1) },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isLinkMode ? <X size={20} /> : <LinkIcon size={20} />}
        </IconButton>
      </Tooltip>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isLoading ? { rotate: 360 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Tooltip title="Send message">
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{
            p: 1.25,
            bgcolor: input.trim() ? "primary.main" : "transparent",
            color: input.trim() ? "white" : "inherit",
            "&:hover": {
              bgcolor: input.trim() ? "primary.dark" : alpha("#6366f1", 0.1),
            },
            transition: "all 0.2s ease-in-out",
            boxShadow: input.trim()
              ? "0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)"
              : "none",
          }}
        >
          <Send size={20} />
        </IconButton>
      </Tooltip>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Tooltip title="Clear chat">
        <IconButton
          onClick={clearChat}
          sx={{
            p: 1.25,
            color: "#ef4444",
            "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Trash2 size={20} />
        </IconButton>
      </Tooltip>
    </motion.div>
  </Box>
</Box>


      {/* Modal remains the same */}
    </Paper>
  
        </div>
      </div>
    </ThemeProvider>
   
        )
};
