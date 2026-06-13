import { useEffect, useRef, useState } from 'react';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useAuth } from 'contexts/AuthContext';
import { getProfile, updateAvatar, updateProfile } from 'services/profileService';

import User1 from 'assets/images/users/user-round.svg';
import { IconCamera } from '@tabler/icons-react';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });
  const [initialForm, setInitialForm] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [pendingAvatar, setPendingAvatar] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      try {
        const profile = await getProfile();
        setForm({ name: profile.name, email: profile.email });
        setInitialForm({ name: profile.name, email: profile.email });
        setAvatarPreview(profile.avatarUrl || '');
        updateUser(profile);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
      setPendingAvatar(reader.result);
      setSuccess('');
      setError('');
    };

    reader.readAsDataURL(file);
  }

  function handleCancel() {
    setForm(initialForm);
    setAvatarPreview(user?.avatarUrl || '');
    setPendingAvatar(null);
    setError('');
    setSuccess('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let profile = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim()
      });

      if (pendingAvatar) {
        profile = await updateAvatar(pendingAvatar);
      }

      setForm({ name: profile.name, email: profile.email });
      setInitialForm({ name: profile.name, email: profile.email });
      setAvatarPreview(profile.avatarUrl || '');
      setPendingAvatar(null);
      updateUser(profile);
      setSuccess('Perfil atualizado com sucesso');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress color="warning" />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarPreview || User1}
            alt={form.name}
            sx={{ width: 96, height: 96, cursor: 'pointer', border: '3px solid', borderColor: 'warning.light' }}
            onClick={handleAvatarClick}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              bgcolor: 'warning.main',
              color: 'common.white',
              borderRadius: '50%',
              p: 0.75,
              display: 'flex'
            }}
          >
            <IconCamera size={16} />
          </Box>
        </Box>

        <Box>
          <Typography variant="h4">{form.name || 'Seu perfil'}</Typography>
          <Typography variant="body2" color="text.secondary">
            Clique na foto para selecionar uma nova imagem
          </Typography>
        </Box>

        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
      </Stack>

      <TextField
        label="Nome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        fullWidth
      />
      <TextField
        label="E-mail"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
