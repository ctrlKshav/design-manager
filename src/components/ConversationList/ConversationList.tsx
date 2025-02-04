import React, { useState, useMemo } from 'react';
import {
  TextField,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import { Search } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import type { Conversation } from '@/types';
import { useStore } from '@/store/useStore';

interface ConversationListProps {
  conversations: Conversation[];
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const { selectedConversationId, setSelectedConversationId } = useStore();

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch = conversation.designer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus.length === 0 ||
        selectedStatus.includes(conversation.status.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchTerm, selectedStatus]);

  const statusOptions = ['New', 'Reviewed', 'Archived'];

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontFamily:'Outfit, Sans Serif' }}>
          Design Feedback
        </Typography>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} />,
            style: { fontFamily: 'Poppins , Sans Serif' }
          }}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} sx={{ mb: 2, fontFamily: 'Poppins, Sans Serif' }}>
          {statusOptions.map((status) => (
            <Chip
              key={status}
              label={status}
              onClick={() => {
                setSelectedStatus((prev) =>
                  prev.includes(status)
                    ? prev.filter((s) => s !== status)
                    : [...prev, status]
                );
              }}
              sx={{fontFamily: 'Poppins, Sans Serif' }}
              color={selectedStatus.includes(status) ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <FixedSizeList
          height={window.innerHeight - 200} // Adjust based on header height
          width="100%"
          itemSize={72}
          itemCount={filteredConversations.length}
          overscanCount={5}
        >
          {({ index, style }) => {
            const conversation = filteredConversations[index];
            return (
              <div style={style}>
                <ConversationItem
                  conversation={conversation}
                  selected={selectedConversationId === conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                />
              </div>
            );
          }}
        </FixedSizeList>
      </Box>
    </Box>
  );
};