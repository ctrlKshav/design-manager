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
  const [showUserDropdown, setShowUserDropdown] = useState(false)

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

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    setShowUserDropdown(value.endsWith('@'))
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
      <Box sx={{ display: "flex", alignItems: "center", position: 'relative' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message. You can tag people using @"
          value={message}
          onChange={handleMessageChange}
          InputProps={{
            startAdornment: taggedUsers.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                {taggedUsers.map((user) => (
                  <Chip
                    key={user}
                    label={`@${user}`}
                    size="small"
                    onDelete={() => setTaggedUsers(prev => prev.filter(u => u !== user))}
                  />
                ))}
              </Box>
            ),
          }}
        />
        {showUserDropdown && (
          <Autocomplete
            open
            options={availableUsers}
            onChange={(event, value) => {
              if (value) {
                setTaggedUsers(prev => [...prev, value])
                setMessage(prev => prev.replace(/@$/, `@${value} `))
              }
              setShowUserDropdown(false)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                variant="outlined"
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  boxShadow: 1
                }}
              />
            )}
            sx={{ mb: 1 }}
            componentsProps={{ paper: { sx: { boxShadow: 2 } } }}
            disablePortal
          />
        )}
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

