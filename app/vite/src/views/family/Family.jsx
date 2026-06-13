import { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useAuth } from 'contexts/AuthContext';
import {
  createFamily,
  getMyFamily,
  joinFamily,
  removeFamilyMember,
  rotateFamilyToken
} from 'services/familyService';

import { IconCopy, IconRefresh, IconUserMinus, IconUsersGroup } from '@tabler/icons-react';

export default function FamilyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [memberToRemove, setMemberToRemove] = useState(null);

  async function loadFamily() {
    setLoading(true);
    setError('');

    try {
      const data = await getMyFamily();
      setFamily(data.family);
      setMembers(data.members || []);
      setIsCreator(!!data.isCreator);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados da família');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFamily();
  }, []);

  function applyFamilyData(data) {
    setFamily(data.family);
    setMembers(data.members || []);
    setIsCreator(!!data.isCreator);
  }

  async function handleCreateFamily() {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await createFamily(familyName.trim() || undefined);
      applyFamilyData(data);
      setSuccess('Família criada com sucesso!');
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
      applyFamilyData(data);
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
      setSuccess('Código copiado para a área de transferência!');
    } catch {
      setError('Não foi possível copiar o código');
    }
  }

  async function handleRotateToken() {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await rotateFamilyToken();
      applyFamilyData(data);
      setSuccess('Novo código gerado com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao gerar novo código');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveMember() {
    if (!memberToRemove) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await removeFamilyMember(memberToRemove.id);
      applyFamilyData(data);
      setSuccess('Membro removido da família com sucesso');
      setMemberToRemove(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao remover membro');
    } finally {
      setSubmitting(false);
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
        <Stack direction="row" spacing={1} alignItems="center">
          <IconUsersGroup size={24} />
          <Typography variant="body2" color="text.secondary">
            Dados financeiros compartilhados entre os membros da família.
          </Typography>
        </Stack>
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

            {isCreator && family.inviteToken && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Código de convite
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                  <Chip label={family.inviteToken} color="warning" />
                  <Button variant="outlined" size="small" startIcon={<IconCopy size={16} />} onClick={handleCopyToken}>
                    Copiar código
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    startIcon={<IconRefresh size={16} />}
                    disabled={submitting}
                    onClick={handleRotateToken}
                  >
                    Gerar novo código
                  </Button>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Código válido até o final do dia.
                </Typography>
              </Box>
            )}

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
                  {isCreator && <TableCell align="right">Ações</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.name}
                      {member.id === user?.id && (
                        <Chip label="Você" size="small" color="warning" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{new Date(member.createdAt).toLocaleString('pt-BR')}</TableCell>
                    {isCreator && (
                      <TableCell align="right">
                        {member.id !== user?.id && (
                          <IconButton color="error" onClick={() => setMemberToRemove(member)} aria-label="remover membro">
                            <IconUserMinus size={18} />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      <Dialog open={!!memberToRemove} onClose={() => setMemberToRemove(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Remover membro</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente remover este membro da família?</DialogContentText>
          {memberToRemove && (
            <Typography sx={{ mt: 1, fontWeight: 600 }}>{memberToRemove.name}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberToRemove(null)} disabled={submitting}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={handleRemoveMember} disabled={submitting}>
            Remover da Família
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
