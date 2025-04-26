import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Drawer } from '@mui/material';
import theme from './styles/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Disputes from './pages/Disputes';
import Transactions from './pages/Transactions';
import SystemHealth from './pages/SystemHealth';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { AuthContext } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              <Sidebar />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Topbar onMenuClick={handleDrawerToggle} />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/vendors"
                  element={
                    <PrivateRoute>
                      <Vendors />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/disputes"
                  element={
                    <PrivateRoute>
                      <Disputes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <PrivateRoute>
                      <Transactions />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/system-health"
                  element={
                    <PrivateRoute>
                      <SystemHealth />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;