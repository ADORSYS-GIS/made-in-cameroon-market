import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Dispute, sendDisputeMessage, resolveDispute } from '../api/disputes';

interface DisputeDetailsProps {
  dispute: Dispute;
  onRefresh: () => void;
}

const DisputeDetails: React.FC<DisputeDetailsProps> = ({ dispute, onRefresh }) => {
  const [message, setMessage] = useState('');
  const [resolution, setResolution] = useState('');

  const handleSendMessage = async () => {
    await sendDisputeMessage(dispute.id, message);
    setMessage('');
    onRefresh();
  };

  const handleResolve = async () => {
    await resolveDispute(dispute.id, resolution);
    setResolution('');
    onRefresh();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Dispute #{dispute.id}</Typography>
        <Typography>Status: {dispute.status}</Typography>
        <Typography>Order ID: {dispute.orderId}</Typography>
        <List>
          {dispute.messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${msg.sender}: ${msg.content}`}
                secondary={new Date(msg.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
        <TextField
          label="Send Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSendMessage} variant="contained" sx={{ mt: 1 }}>
          Send
        </Button>
        {dispute.status === 'open' && (
          <>
            <TextField
              label="Resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleResolve} variant="contained" color="success" sx={{ mt: 1 }}>
              Resolve
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisputeDetails;