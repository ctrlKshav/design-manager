import type React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ input, onInputChange, onSend }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
          Salesforce
        </Typography>
        <KeyboardArrowDownIcon sx={{ ml: 1, color: "text.secondary" }} />
      </Box>
      <TextField
        multiline
        rows={4}
        fullWidth
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type your message..."
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "background.default",
            "&:hover": {
              "& > fieldset": {
                borderColor: "primary.main",
              },
            },
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {input.length}/2000
        </Typography>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={onSend}
          sx={{
            borderRadius: 20,
            px: 3,
            py: 1,
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  )
}

export default ChatInput

