import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { formatCurrency } from 'utils/currency';
import { buildBillSummary } from './billUtils';

export default function BillSummaryCards({ bills, loading }) {
  const summary = buildBillSummary(bills);

  const cards = [
    {
      label: 'Quantidade de contas',
      value: loading ? '...' : summary.count
    },
    {
      label: 'Soma total dos valores',
      value: loading ? '...' : formatCurrency(summary.total)
    },
    {
      label: 'Próximo vencimento',
      value: loading
        ? '...'
        : summary.nextDue
          ? summary.nextDue.toLocaleDateString('pt-BR')
          : '—'
    }
  ];

  return (
    <Grid container spacing={gridSpacing} sx={{ mb: gridSpacing }}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, md: 4 }}>
          <MainCard contentSX={{ p: 2.5 }}>
            <Typography variant="h6" color="text.secondary">
              {card.label}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {card.value}
            </Typography>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}
