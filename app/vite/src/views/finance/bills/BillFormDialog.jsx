import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { formatInputCurrency } from 'utils/currency';
import { RECURRENCE_OPTIONS } from './constants';

export default function BillFormDialog({ open, title, form, onChange, onClose, onSubmit, submitting }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Descrição"
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Valor"
            value={form.amount}
            onChange={(e) => onChange({ ...form, amount: formatInputCurrency(e.target.value) })}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Recorrência</InputLabel>
            <Select
              value={form.recurrence}
              label="Recorrência"
              onChange={(e) => onChange({ ...form, recurrence: e.target.value })}
            >
              {RECURRENCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="Dia de vencimento"
            value={form.dueDay}
            onChange={(e) => onChange({ ...form, dueDay: e.target.value })}
            inputProps={{ min: 1, max: 31 }}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={submitting}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
