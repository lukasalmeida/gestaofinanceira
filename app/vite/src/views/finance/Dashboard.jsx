import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getCategories } from 'services/categoryService';
import { createTransaction, getTransactions } from 'services/transactionService';
import { formatCurrency, formatInputCurrency, parseCurrency } from 'utils/currency';

const emptyForm = { categoryId: '', amount: '', description: '' };

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState(emptyForm);
  const [expenseForm, setExpenseForm] = useState(emptyForm);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [transactionsData, categoriesData] = await Promise.all([getTransactions(), getCategories()]);
      setTransactions(transactionsData.transactions || transactionsData || []);
      setCategories(categoriesData.categories || categoriesData || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTransaction(type, form, resetForm, closeModal) {
    await createTransaction({
      type,
      categoryId: form.categoryId,
      description: form.description,
      amount: parseCurrency(form.amount),
      date: new Date().toISOString()
    });

    resetForm(emptyForm);
    closeModal();
    await loadData();
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const income = safeTransactions.filter((t) => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const expense = safeTransactions.filter((t) => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const balance = income - expense;
  const categoriesCount = new Set(safeTransactions.map((t) => t.category?.name).filter(Boolean)).size;

  const filteredTransactions = safeTransactions.filter((t) => {
    const matchType = typeFilter === 'ALL' ? true : t.type === typeFilter;
    const transactionDate = new Date(t.date || t.createdAt);
    const matchStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const matchEndDate = endDate ? transactionDate <= new Date(endDate) : true;

    return matchType && matchStartDate && matchEndDate;
  });

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  const stats = [
    { label: 'Receitas', value: formatCurrency(income), color: 'success.main' },
    { label: 'Despesas', value: formatCurrency(expense), color: 'error.main' },
    { label: 'Saldo', value: formatCurrency(balance), color: 'primary.main' },
    { label: 'Categorias em uso', value: categoriesCount, color: 'text.primary' }
  ];

  return (
    <Grid container spacing={gridSpacing} sx={{mt: 2}}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ lg: 3, md: 6, sm: 6, xs: 12 }}>
          <MainCard contentSX={{ p: 2.5 }}>
            <Typography variant="h6" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h3" sx={{ color: stat.color, mt: 1 }}>
              {loading ? '...' : stat.value}
            </Typography>
          </MainCard>
        </Grid>
      ))}

      <Grid size={12}>
        <MainCard title="Transações">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="success" onClick={() => setIncomeModalOpen(true)}>
              + Receita
            </Button>
            <Button variant="contained" color="error" onClick={() => setExpenseModalOpen(true)}>
              - Despesa
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Tipo</InputLabel>
              <Select value={typeFilter} label="Tipo" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="INCOME">Receitas</MenuItem>
                <MenuItem value="EXPENSE">Despesas</MenuItem>
              </Select>
            </FormControl>
            <TextField type="date" label="Data inicial" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <TextField type="date" label="Data final" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Button
              variant="outlined"
              disabled={typeFilter === 'ALL' && !startDate && !endDate}
              onClick={() => {
                setTypeFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
            >
              Limpar filtros
            </Button>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {loading ? 'Carregando...' : 'Nenhuma transação encontrada'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.category?.name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={item.type === 'INCOME' ? 'Receita' : 'Despesa'}
                          color={item.type === 'INCOME' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: item.type === 'INCOME' ? 'success.main' : 'error.main' }}>
                        {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>{new Date(item.date || item.createdAt).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      <TransactionDialog
        open={incomeModalOpen}
        title="Nova Receita"
        categories={incomeCategories}
        form={incomeForm}
        setForm={setIncomeForm}
        onClose={() => setIncomeModalOpen(false)}
        onSubmit={() => handleCreateTransaction('INCOME', incomeForm, setIncomeForm, () => setIncomeModalOpen(false))}
      />

      <TransactionDialog
        open={expenseModalOpen}
        title="Nova Despesa"
        categories={expenseCategories}
        form={expenseForm}
        setForm={setExpenseForm}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={() => handleCreateTransaction('EXPENSE', expenseForm, setExpenseForm, () => setExpenseModalOpen(false))}
      />
    </Grid>
  );
}

function TransactionDialog({ open, title, categories, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select value={form.categoryId} label="Categoria" onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <MenuItem value="">Selecione</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: formatInputCurrency(e.target.value) })} fullWidth />
          <TextField label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
