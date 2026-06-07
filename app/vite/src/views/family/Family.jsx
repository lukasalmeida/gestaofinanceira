import { useEffect, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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
import { createFamily, getMyFamily, joinFamily } from 'services/familyService';

// assets
import { IconCopy, IconUsersGroup } from '@tabler/icons-react';

export default function FamilyPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [tokenInput, setTokenInput] = useState('');
  const [familyName, setFamilyName] = useState('');

  async function loadFamily() {
    setLoading(true);
    setError('');

    try {
      const data = await getMyFamily();
      setFamily(data.family);
      setMembers(data.members || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados da família');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFamily();
  }, []);

  async function handleCreateFamily() {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await createFamily(familyName.trim() || undefined);
      setFamily(data.family);
      setMembers(data.members || []);
      setSuccess('Família criada com sucesso! Compartilhe o token com quem deseja convidar.');
      setFamilyName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar família');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleJoinFamily() {
    if (!tokenInput.trim()) {
      setError('Informe o token da família');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await joinFamily(tokenInput);
      setFamily(data.family);
      setMembers(data.members || []);
      setSuccess('Você ingressou na família com sucesso!');
      setTokenInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao ingressar na família');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyToken() {
    if (!family?.inviteToken) return;

    try {
      await navigator.clipboard.writeText(family.inviteToken);
      setSuccess('Token copiado para a área de transferência!');
    } catch {
      setError('Não foi possível copiar o token');
    }
  }

  if (loading) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <MainCard>
            <Typography>Carregando...</Typography>
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  if (!family) {
    return (
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crie uma família financeira ou ingresse em uma existente para compartilhar categorias e transações.
          </Typography>
        </Grid>

        {error && (
          <Grid size={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {success && (
          <Grid size={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Iniciar Família">
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Crie uma nova família e receba um token para convidar outras pessoas.
              </Typography>
              <TextField
                label="Nome da família (opcional)"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                fullWidth
              />
              <Button variant="contained" disabled={submitting} onClick={handleCreateFamily}>
                Iniciar Família
              </Button>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Ingressar em uma Família">
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Informe o token recebido de quem criou a família.
              </Typography>
              <TextField
                label="Token"
                placeholder="FAM-8XK4-9Q2P"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                fullWidth
              />
              <Button variant="outlined" disabled={submitting} onClick={handleJoinFamily}>
                Ingressar
              </Button>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Dados financeiros compartilhados entre os membros da família.
        </Typography>
      </Grid>

      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {success && (
        <Grid size={12}>
          <Alert severity="success">{success}</Alert>
        </Grid>
      )}

      <Grid size={12}>
        <MainCard title="Informações da família">
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body1">{family.id}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Token de convite
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Chip label={family.inviteToken} color="primary" />
                <Button variant="outlined" size="small" startIcon={<IconCopy size={16} />} onClick={handleCopyToken}>
                  Copiar Token
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Data de criação
              </Typography>
              <Typography variant="body1">{new Date(family.createdAt).toLocaleString('pt-BR')}</Typography>
            </Box>

            {family.name && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1">{family.name}</Typography>
              </Box>
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard title="Membros da família">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Data de entrada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Nenhum membro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{new Date(member.createdAt).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
}
