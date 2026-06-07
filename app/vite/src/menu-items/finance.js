import { IconCategory, IconDashboard, IconReceipt, IconUsersGroup } from '@tabler/icons-react';

const icons = {
  IconDashboard,
  IconReceipt,
  IconCategory,
  IconUsersGroup
};

const finance = {
  id: 'finance',
  title: 'Gestão Financeira',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'transactions',
      title: 'Transações',
      type: 'item',
      url: '/transactions',
      icon: icons.IconReceipt,
      breadcrumbs: true
    },
    {
      id: 'categories',
      title: 'Categorias',
      type: 'item',
      url: '/categories',
      icon: icons.IconCategory,
      breadcrumbs: true
    },
    {
      id: 'family',
      title: 'Família',
      type: 'item',
      url: '/family',
      icon: icons.IconUsersGroup,
      breadcrumbs: true
    }
  ]
};

export default finance;
