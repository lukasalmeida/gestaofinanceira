import { Link, Outlet, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const tabs = [
  { label: 'Perfil', path: '/configuracoes/perfil' },
  { label: 'Conta', path: '/configuracoes/conta' }
];

export default function SettingsLayout() {
  const location = useLocation();
  const currentTab = tabs.findIndex((tab) => location.pathname.startsWith(tab.path));

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Configurações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gerencie suas informações pessoais e preferências da conta.
        </Typography>
      </Grid>

      <Grid size={12}>
        <MainCard contentSX={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs value={currentTab === -1 ? 0 : currentTab}>
              {tabs.map((tab) => (
                <Tab key={tab.path} label={tab.label} component={Link} to={tab.path} />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
