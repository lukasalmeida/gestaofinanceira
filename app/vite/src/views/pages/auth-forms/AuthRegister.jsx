import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { useAuth } from 'contexts/AuthContext';
import { register } from 'services/authService';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthRegister() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  useEffect(() => {
    if (password) {
      const temp = strengthIndicator(password);
      setStrength(temp);
      setLevel(strengthColor(temp));
    } else {
      setStrength(0);
      setLevel(undefined);
    }
  }, [password]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const data = await register(name, email, password, confirmPassword);
      signIn(data, true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">Cadastre-se com e-mail</Typography>
      </Stack>

      <CustomFormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="outlined-adornment-name-register">Nome completo</InputLabel>
        <OutlinedInput
          id="outlined-adornment-name-register"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </CustomFormControl>

      <CustomFormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="outlined-adornment-email-register">E-mail</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-register"
          type="email"
          value={email}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </CustomFormControl>

      <CustomFormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Senha</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          value={password}
          name="password"
          label="Senha"
          onChange={(e) => setPassword(e.target.value)}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </CustomFormControl>

      <CustomFormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel htmlFor="outlined-adornment-confirm-password-register">Confirmar senha</InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password-register"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          name="confirmPassword"
          label="Confirmar senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </CustomFormControl>

      {strength !== 0 && (
        <FormControl fullWidth>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
              <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                {level?.label}
              </Typography>
            </Stack>
          </Box>
        </FormControl>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            name="acceptedTerms"
            color="primary"
          />
        }
        label={
          <Typography variant="subtitle1">
            Concordo com os &nbsp;
            <Typography variant="subtitle1" component={Link} to="#">
              Termos de Uso
            </Typography>
          </Typography>
        }
      />

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation disabled={loading || !acceptedTerms} fullWidth size="large" type="submit" variant="contained" color="secondary">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </AnimateButton>
      </Box>
    </Box>
  );
}
