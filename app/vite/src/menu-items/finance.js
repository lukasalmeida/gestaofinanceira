import { IconCategory, IconDashboard, IconReceipt, IconUsers } from '@tabler/icons-react';

const icons = {
  IconDashboard,
  IconReceipt,
  IconCategory,
  IconUsers
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
      id: 'users',
      title: 'Usuários',
      type: 'item',
      url: '/users',
      icon: icons.IconUsers,
      breadcrumbs: true
    }
  ]
};

export default finance;
