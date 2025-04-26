import React from 'react';
import { Container, Typography } from '@mui/material';
import { useApi } from '../hooks/useApi';
import { getTransactions } from '../api/transactions';
import TransactionTable from '../components/TransactionTable';

const Transactions: React.FC = () => {
  const { data: transactions, loading, error } = useApi(getTransactions);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transaction Monitoring
      </Typography>
      <TransactionTable transactions={transactions || []} />
    </Container>
  );
};

export default Transactions;