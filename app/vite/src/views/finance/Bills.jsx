import { useEffect, useMemo, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useBills from 'hooks/useBills';
import { gridSpacing } from 'store/constant';
import { createBill, deleteBill, updateBill } from 'services/billService';
import { getMyFamily } from 'services/familyService';
import { parseCurrency } from 'utils/currency';

import BillDeleteDialog from './bills/BillDeleteDialog';
import BillFilters from './bills/BillFilters';
import BillFormDialog from './bills/BillFormDialog';
import BillSummaryCards from './bills/BillSummaryCards';
import BillsTable from './bills/BillsTable';
import { EMPTY_BILL_FORM } from './bills/constants';

// assets
import { IconPlus, IconUsersGroup } from '@tabler/icons-react';

const EMPTY_FILTERS = {
  dueDay: '',
  minAmount: '',
  maxAmount: ''
};

function billToForm(bill) {
  const amount = Number(bill.amount || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return {
    description: bill.description || '',
    amount,
    recurrence: bill.recurrence || 'MONTHLY',
    dueDay: String(bill.dueDay ?? '')
  };
}

function formToPayload(form) {
  return {
    description: form.description.trim(),
    amount: parseCurrency(form.amount),
    recurrence: form.recurrence,
    dueDay: Number(form.dueDay)
  };
}

function validateForm(form) {
  if (!form.description.trim()) return 'Descrição é obrigatória';
  if (!form.amount || parseCurrency(form.amount) <= 0) return 'Valor deve ser maior que zero';
  if (!form.dueDay || Number(form.dueDay) < 1 || Number(form.dueDay) > 31) {
    return 'Dia de vencimento deve estar entre 1 e 31';
  }
  return '';
}

export default function BillsPage() {
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [hasFamily, setHasFamily] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState(EMPTY_BILL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingBill, setDeletingBill] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const apiFilters = useMemo(() => {
    const filters = {};

    if (appliedFilters.dueDay) filters.dueDay = appliedFilters.dueDay;
    if (appliedFilters.minAmount) filters.minAmount = parseCurrency(appliedFilters.minAmount);
    if (appliedFilters.maxAmount) filters.maxAmount = parseCurrency(appliedFilters.maxAmount);

    return filters;
  }, [appliedFilters]);

  const { bills, loading, error, reload } = useBills(apiFilters);

  useEffect(() => {
    async function loadFamily() {
      try {
        const data = await getMyFamily();
        setHasFamily(!!data.family);
      } catch {
        setHasFamily(false);
      }
    }

    loadFamily();
  }, []);

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity });
  }

  function openCreateDialog() {
    setEditingBill(null);
    setFormData(EMPTY_BILL_FORM);
    setFormOpen(true);
  }

  function openEditDialog(bill) {
    setEditingBill(bill);
    setFormData(billToForm(bill));
    setFormOpen(true);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditingBill(null);
    setFormData(EMPTY_BILL_FORM);
  }

  function openDeleteDialog(bill) {
    setDeletingBill(bill);
    setDeleteOpen(true);
  }

  function closeDeleteDialog() {
    setDeleteOpen(false);
    setDeletingBill(null);
  }

  async function handleSave() {
    const validationError = validateForm(formData);
    if (validationError) {
      showMessage(validationError, 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload = formToPayload(formData);

      if (editingBill) {
        await updateBill(editingBill.id, payload);
        showMessage('Conta atualizada com sucesso');
      } else {
        await createBill(payload);
        showMessage('Conta cadastrada com sucesso');
      }

      closeFormDialog();
      reload();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Erro ao salvar conta', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingBill) return;

    setSubmitting(true);

    try {
      await deleteBill(deletingBill.id);
      showMessage('Conta excluída com sucesso');
      closeDeleteDialog();
      reload();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Erro ao excluir conta', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleApplyFilters() {
    setAppliedFilters(draftFilters);
  }

  function handleClearFilters() {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }

  return (
    <Box>
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Contas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie despesas recorrentes ou futuras e acompanhe seus vencimentos.
          </Typography>
        </Grid>

        {hasFamily && (
          <Grid size={12}>
            <Alert severity="info" icon={<IconUsersGroup size={20} />}>
              Estas contas são compartilhadas entre os membros da família.
            </Alert>
          </Grid>
        )}

        <Grid size={12}>
          <BillSummaryCards bills={bills} loading={loading} />
        </Grid>

        <Grid size={12}>
          <MainCard
            title="Listagem de contas"
            secondary={
              <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={openCreateDialog}>
                Nova Conta
              </Button>
            }
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <BillFilters
              values={draftFilters}
              onChange={setDraftFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              disabled={loading}
            />

            <BillsTable bills={bills} loading={loading} onEdit={openEditDialog} onDelete={openDeleteDialog} />
          </MainCard>
        </Grid>
      </Grid>

      <BillFormDialog
        open={formOpen}
        title={editingBill ? 'Editar Conta' : 'Nova Conta'}
        form={formData}
        onChange={setFormData}
        onClose={closeFormDialog}
        onSubmit={handleSave}
        submitting={submitting}
      />

      <BillDeleteDialog
        open={deleteOpen}
        bill={deletingBill}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        submitting={submitting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
