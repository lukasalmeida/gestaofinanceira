import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { updatePassword } from 'services/profileService';

export default function AccountSettings() {
  const [form, setForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleCancel() {
    setForm({ currentPassword: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updatePassword(form);
      setSuccess('Senha atualizada com sucesso');
      setForm({ currentPassword: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Atualize sua senha de acesso ao sistema.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Senha atual"
        type="password"
        value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        fullWidth
      />
      <TextField
        label="Nova senha"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        fullWidth
      />
      <TextField
        label="Confirmar nova senha"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        fullWidth
      />

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="warning" onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={saving}>
          Cancelar
        </Button>
      </Stack>
    </Stack>
  );
}
