import { Box, AppBar, Toolbar, Typography, styled } from '@mui/material';
import Sidebar from './Sidebar';

const MainContent = styled('main')({
  flexGrow: 1,
  padding: 24,
  marginLeft: 240,
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - 240px)`,
          ml: '240px',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Gestion des Rendez-vous
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <MainContent>
        <Toolbar /> {/* This creates space below the AppBar */}
        {children}
      </MainContent>
    </Box>
  );
};

export default Layout;
