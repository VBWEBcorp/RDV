import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { EventNote, History, People } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DrawerContent = styled('div')({
  width: 240,
});

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'RDV à venir', icon: <EventNote />, path: '/appointments' },
    { text: 'Historique', icon: <History />, path: '/history' },
    { text: 'CRM', icon: <People />, path: '/crm' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerContent>
        <List>
          {menuItems.map((item) => (
            <StyledListItemButton
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItemButton>
          ))}
        </List>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
