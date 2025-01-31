import type React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { useTheme } from "@mui/material/styles"

interface PromptSuggestionsProps {
  prompts: string[]
  onSelectPrompt: (prompt: string) => void
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ prompts, onSelectPrompt }) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: "100%", mb: 6 }}>
      <Typography color="text.secondary" sx={{ mb: 2, fontWeight: "medium" }}>
        Ask about:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
        {prompts.map((prompt, i) => (
          <Chip
            key={i}
            label={prompt}
            onClick={() => onSelectPrompt(prompt)}
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
              },
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default PromptSuggestions

