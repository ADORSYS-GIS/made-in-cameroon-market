import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { getSystemMetrics } from '../api/metrics';
import MetricsChart from '../components/MetricsChart';

const SystemHealth: React.FC = () => {
  const { data: metrics, loading, error, refresh } = useApi(getSystemMetrics);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Health
      </Typography>
      <Button variant="contained" onClick={refresh} sx={{ mb: 2 }}>
        Refresh Metrics
      </Button>
      {metrics && <MetricsChart metrics={[metrics]} />}
    </Container>
  );
};

export default SystemHealth;