import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { getTransactionSummary } from '../api/transactions';
import { getSystemMetrics } from '../api/metrics';

const Dashboard: React.FC = () => {
  const { data: summary } = useApi(getTransactionSummary);
  const { data: metrics } = useApi(getSystemMetrics);

  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Transaction Summary</Typography>
            <Typography>Total Sales: {summary?.totalSales || 0} XAF</Typography>
            <Typography>Transaction Count: {summary?.transactionCount || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">System Health</Typography>
            <Typography>Uptime: {metrics?.uptime || 0} hours</Typography>
            <Typography>Latency: {metrics?.latency || 0} ms</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;