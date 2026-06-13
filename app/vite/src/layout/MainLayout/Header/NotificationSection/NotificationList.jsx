import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { withAlpha } from 'utils/colorUtils';
import { formatCurrency } from 'utils/currency';

function ListItemWrapper({ children, onClick, read }) {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        opacity: read ? 0.65 : 1,
        bgcolor: read ? 'transparent' : withAlpha(theme.palette.warning.light, 0.12),
        '&:hover': onClick
          ? {
              bgcolor: withAlpha(theme.palette.warning.light, 0.2)
            }
          : undefined
      })}
    >
      {children}
    </Box>
  );
}

export default function NotificationList({
  notifications,
  loading,
  error,
  onMarkAsRead,
  onReload
}) {
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={28} color="warning" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button size="small" onClick={onReload}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!notifications.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1">Sem notificações</Typography>
        <Typography variant="body2" color="text.secondary">
          Nenhuma conta vence nesta semana.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      {notifications.map((notification) => (
        <ListItemWrapper
          key={notification.key}
          read={notification.read}
          onClick={!notification.read ? () => onMarkAsRead(notification.key) : undefined}
        >
          <ListItem disablePadding sx={{ alignItems: 'flex-start' }}>
            <ListItemText
              primary={
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{notification.message}</Typography>
                  {!notification.read && <Chip label="Nova" color="warning" size="small" />}
                </Stack>
              }
              secondary={
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Valor: {formatCurrency(notification.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vencimento: {new Date(notification.dueDate).toLocaleDateString('pt-BR')}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        </ListItemWrapper>
      ))}
    </List>
  );
}
