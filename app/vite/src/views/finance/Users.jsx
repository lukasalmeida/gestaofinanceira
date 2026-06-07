import { Grid, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

export default function UsersPage() {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard title="Usuários">
          <Typography variant="body1">Gerencie os usuários do sistema.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Em breve: listagem e edição de usuários via API.
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
