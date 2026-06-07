import { useCallback, useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
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
import { createTransaction, getTransactions, getTransactionsSummary } from 'services/transactionService';
import { formatCurrency, formatInputCurrency, parseCurrency } from 'utils/currency';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const filterParams = {
    page,
    limit,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type: typeFilter,
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [transactionsData, categoriesData, summaryData] = await Promise.all([
        getTransactions(filterParams),
        getTransactionsSummary({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          type: typeFilter,
        }),
      ]);

      setTransactions(transactionsData.transactions || []);
      setTotalPages(transactionsData.pages ?? 0);
      setTotalRecords(transactionsData.total ?? 0);
      setSummary(summaryData);
      setCategories(categoriesData.categories || categoriesData || []);
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleTypeFilterChange(value) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStartDateChange(value) {
    setStartDate(value);
    setPage(1);
  }

  function handleEndDateChange(value) {
    setEndDate(value);
    setPage(1);
  }

  function handleClearFilters() {
    setTypeFilter('ALL');
    setStartDate('');
    setEndDate('');
    setPage(1);
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
            <MainCard>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select value={typeFilter} label="Tipo" onChange={(e) => handleTypeFilterChange(e.target.value)}>
                    <MenuItem value="ALL">Todos</MenuItem>
                    <MenuItem value="INCOME">Receitas</MenuItem>
                    <MenuItem value="EXPENSE">Despesas</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  type="date"
                  label="Data inicial"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
                <TextField
                  type="date"
                  label="Data final"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                />
                <Button
                  variant="outlined"
                  disabled={typeFilter === 'ALL' && !startDate && !endDate}
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Últimas transações</Typography>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Mostrar</InputLabel>
                  <Select
                    value={limit}
                    label="Mostrar"
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
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
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {loading ? 'Carregando...' : 'Nenhuma transação encontrada'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((item) => (
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

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography variant="body2">Total de registros: {totalRecords}</Typography>

                {totalPages > 0 && (
                  <Pagination
                    page={page}
                    count={totalPages}
                    color="primary"
                    onChange={(event, value) => setPage(value)}
                  />
                )}
              </Box>
            </MainCard>
      </Grid>
    </Grid>
  );
}
