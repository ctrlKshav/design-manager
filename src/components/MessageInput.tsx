import type React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import Chip from "@mui/material/Chip"

interface MessageInputProps {
  onSendMessage: (text: string, attachments: string[]) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments)
      setMessage("")
      setAttachments([])
      setTags([])
    }
  }

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments = Array.from(files).map((file) => file.name)
      setAttachments((prev) => [...prev, ...newAttachments])
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "@") {
      // Simulate tag suggestion
      setTimeout(() => {
        setTags(["John", "Alice", "Bob"])
      }, 100)
    }
  }

  const handleTagClick = (tag: string) => {
    setMessage((prev) => prev + tag + " ")
    setTags([])
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        {attachments.map((attachment, index) => (
          <Chip
            key={index}
            label={attachment}
            onDelete={() => {
              setAttachments(attachments.filter((_, i) => i !== index))
            }}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="attachment-button-file"
          type="file"
          onChange={handleAttachment}
          multiple
        />
        <label htmlFor="attachment-button-file">
          <IconButton component="span" color="primary">
            <AttachFileIcon />
          </IconButton>
        </label>
        <Button variant="contained" color="primary" onClick={handleSend} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
      {tags.length > 0 && (
        <Box sx={{ display: "flex", mt: 1 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} onClick={() => handleTagClick(tag)} sx={{ mr: 1 }} />
          ))}
        </Box>
      )}
    </Box>
  )
}

