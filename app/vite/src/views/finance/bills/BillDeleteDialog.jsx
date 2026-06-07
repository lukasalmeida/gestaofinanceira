import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function BillDeleteDialog({ open, bill, onClose, onConfirm, submitting }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir conta</DialogTitle>
      <DialogContent>
        <DialogContentText>Tem certeza que deseja excluir esta conta?</DialogContentText>
        {bill?.description && (
          <DialogContentText sx={{ mt: 1, fontWeight: 600 }}>{bill.description}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={submitting}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
