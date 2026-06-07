import { Grid, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

export default function TransactionsPage() {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard title="Transações">
          <Typography variant="body1">Gerencie suas transações de renda e despesa.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use o Dashboard para cadastrar e visualizar transações por enquanto.
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
