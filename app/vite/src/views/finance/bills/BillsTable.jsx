import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { formatCurrency } from 'utils/currency';
import { getRecurrenceLabel } from './billUtils';

import { IconEdit, IconTrash } from '@tabler/icons-react';

function LoadingRows() {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: 6 }).map((__, cellIndex) => (
        <TableCell key={cellIndex}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default function BillsTable({ bills, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Recorrência</TableCell>
              <TableCell>Dia de vencimento</TableCell>
              <TableCell>Data de criação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingRows />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!bills.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Nenhuma conta cadastrada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cadastre despesas recorrentes ou futuras para acompanhar seus vencimentos.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Recorrência</TableCell>
            <TableCell>Dia de vencimento</TableCell>
            <TableCell>Data de criação</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id} hover>
              <TableCell>{bill.description}</TableCell>
              <TableCell>{formatCurrency(bill.amount)}</TableCell>
              <TableCell>
                <Chip size="small" label={getRecurrenceLabel(bill.recurrence)} />
              </TableCell>
              <TableCell>Dia {bill.dueDay}</TableCell>
              <TableCell>{new Date(bill.createdAt).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <IconButton color="primary" aria-label="editar conta" onClick={() => onEdit(bill)}>
                    <IconEdit size={18} />
                  </IconButton>
                  <IconButton color="error" aria-label="excluir conta" onClick={() => onDelete(bill)}>
                    <IconTrash size={18} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
