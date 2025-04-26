import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { getDisputes } from '../api/disputes';
import DisputeDetails from '../components/DisputeDetails';

const Disputes: React.FC = () => {
  const { data: disputes, loading, error, refresh } = useApi(() => getDisputes('open'));

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dispute Resolution
      </Typography>
      <Grid container spacing={3}>
        {disputes?.map((dispute) => (
          <Grid item xs={12} md={6} key={dispute.id}>
            <DisputeDetails dispute={dispute} onRefresh={refresh} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Disputes;