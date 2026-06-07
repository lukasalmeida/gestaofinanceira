import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { formatInputCurrency } from 'utils/currency';

export default function BillFilters({ values, onChange, onApply, onClear, disabled }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        type="number"
        label="Dia de vencimento"
        value={values.dueDay}
        onChange={(e) => onChange({ ...values, dueDay: e.target.value })}
        inputProps={{ min: 1, max: 31 }}
        sx={{ minWidth: 180 }}
      />
      <TextField
        label="Valor mínimo"
        value={values.minAmount}
        onChange={(e) => onChange({ ...values, minAmount: formatInputCurrency(e.target.value) })}
        sx={{ minWidth: 160 }}
      />
      <TextField
        label="Valor máximo"
        value={values.maxAmount}
        onChange={(e) => onChange({ ...values, maxAmount: formatInputCurrency(e.target.value) })}
        sx={{ minWidth: 160 }}
      />
      <Button variant="contained" onClick={onApply} disabled={disabled}>
        Filtrar
      </Button>
      <Button variant="outlined" onClick={onClear} disabled={disabled}>
        Limpar filtros
      </Button>
    </Stack>
  );
}
