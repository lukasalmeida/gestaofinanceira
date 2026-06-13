import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useNotifications from 'hooks/useNotifications';
import NotificationList from './NotificationList';

import { IconBell } from '@tabler/icons-react';

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const {
    notifications,
    unreadCount,
    loading,
    error,
    reload,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => {
      const next = !prevOpen;
      if (next) reload();
      return next;
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box sx={{ ml: 2 }}>
        <Badge badgeContent={unreadCount} color="warning" overlap="circular">
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              color: theme.vars.palette.warning.dark,
              background: theme.vars.palette.warning.light,
              '&:hover, &[aria-controls="menu-list-grow"]': {
                color: theme.vars.palette.warning.light,
                background: theme.vars.palette.warning.dark
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [downMD ? 5 : 0, 20] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]} sx={{ maxWidth: 360 }}>
                  <Stack sx={{ gap: 1 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}>
                      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle1">Notificações</Typography>
                        <Chip
                          size="small"
                          label={unreadCount}
                          variant="filled"
                          sx={{ color: 'background.default', bgcolor: 'warning.dark' }}
                        />
                      </Stack>
                      <Button size="small" onClick={markAllAsRead} disabled={!unreadCount}>
                        Marcar todas como lidas
                      </Button>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
                      Contas que vencem nesta semana
                    </Typography>

                    <Divider />

                    <Box sx={{ maxHeight: 'calc(100vh - 220px)', overflowX: 'hidden', '&::-webkit-scrollbar': { width: 5 } }}>
                      <NotificationList
                        notifications={notifications}
                        loading={loading}
                        error={error}
                        onMarkAsRead={markAsRead}
                        onReload={reload}
                      />
                    </Box>
                  </Stack>
                </MainCard>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
