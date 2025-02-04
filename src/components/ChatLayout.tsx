import React from 'react';
import { Grid, ThemeProvider } from '@mui/material';
import { theme } from "@/themes/newTheme";
import { ConversationList } from '@/components/ConversationList/ConversationList';
import { useStore } from '@/store/useStore';

interface ChatLayoutProps {
  children: React.ReactNode;
  conversations: any[];
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children, conversations }) => {
  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: '100vh' }}>
        <Grid 
          item 
          xs={12} 
          md={3} 
          sx={{ 
            borderRight: 1, 
            borderColor: 'divider',
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <ConversationList conversations={conversations} />
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={9} 
          sx={{ 
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          {children}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}; 