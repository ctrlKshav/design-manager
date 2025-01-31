import type React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import Chip from "@mui/material/Chip"
import Autocomplete from "@mui/material/Autocomplete"

interface MessageInputProps {
  onSendMessage: (text: string, attachments: string[], taggedUsers: string[]) => void
  availableUsers: string[]
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, availableUsers }) => {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [taggedUsers, setTaggedUsers] = useState<string[]>([])

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments, taggedUsers)
      setMessage("")
      setAttachments([])
      setTaggedUsers([])
    }
  }

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments = Array.from(files).map((file) => file.name)
      setAttachments((prev) => [...prev, ...newAttachments])
    }
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
      <Autocomplete
        multiple
        id="tags-standard"
        options={availableUsers}
        value={taggedUsers}
        onChange={(event, newValue) => {
          setTaggedUsers(newValue)
        }}
        renderInput={(params) => <TextField {...params} variant="standard" label="Tag Users" placeholder="Tag users" />}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
    </Box>
  )
}

