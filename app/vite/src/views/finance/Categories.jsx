import { useEffect, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { createCategory, deleteCategory, getCategories, updateCategory } from 'services/categoryService';

// assets
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'EXPENSE' });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || data || []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModalCreate() {
    setEditingId(null);
    setFormData({ name: '', type: 'EXPENSE' });
    setShowModal(true);
  }

  function openModalEdit(category) {
    setEditingId(category.id);
    setFormData({ name: category.name, type: category.type });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', type: 'EXPENSE' });
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData.name, formData.type);
      } else {
        await createCategory(formData.name, formData.type);
      }
      closeModal();
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar categoria');
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja remover esta categoria?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data?.error || 'Erro ao remover categoria');
      }
    }
  }

  const filteredCategories = categories.filter((cat) => filterType === 'ALL' || cat.type === filterType);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard
          title="Categorias"
          secondary={
            <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={openModalCreate}>
              Nova Categoria
            </Button>
          }
        >
          <Typography variant="body2" sx={{ mb: 2 }}>
            Gerencie suas categorias de renda e despesa
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Button variant={filterType === 'ALL' ? 'contained' : 'outlined'} onClick={() => setFilterType('ALL')}>
              Todas ({categories.length})
            </Button>
            <Button variant={filterType === 'EXPENSE' ? 'contained' : 'outlined'} onClick={() => setFilterType('EXPENSE')}>
              Despesas ({categories.filter((c) => c.type === 'EXPENSE').length})
            </Button>
            <Button variant={filterType === 'INCOME' ? 'contained' : 'outlined'} onClick={() => setFilterType('INCOME')}>
              Receitas ({categories.filter((c) => c.type === 'INCOME').length})
            </Button>
          </Stack>

          {loading ? (
            <Typography>Carregando categorias...</Typography>
          ) : filteredCategories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5">Nenhuma categoria encontrada</Typography>
              <Typography variant="body2">Crie sua primeira categoria para começar</Typography>
            </Box>
          ) : (
            <Grid container spacing={gridSpacing}>
              {filteredCategories.map((category) => (
                <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <MainCard contentSX={{ p: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="h4">{category.name}</Typography>
                      <Chip
                        size="small"
                        label={category.type === 'EXPENSE' ? 'Despesa' : 'Receita'}
                        color={category.type === 'EXPENSE' ? 'error' : 'success'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Criada em {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton color="primary" onClick={() => openModalEdit(category)} aria-label="editar">
                          <IconEdit size={18} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(category.id)} aria-label="remover">
                          <IconTrash size={18} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </MainCard>
                </Grid>
              ))}
            </Grid>
          )}
        </MainCard>
      </Grid>

      <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar Categoria' : 'Criar Categoria'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da Categoria"
              placeholder="Ex: Alimentação, Transporte..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select value={formData.type} label="Tipo" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="EXPENSE">Despesa</MenuItem>
                <MenuItem value="INCOME">Receita</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
