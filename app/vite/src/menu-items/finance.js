import { IconCategory, IconDashboard, IconFileInvoice, IconReceipt, IconUsersGroup } from '@tabler/icons-react';

const icons = {
  IconDashboard,
  IconReceipt,
  IconCategory,
  IconFileInvoice,
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
      url: '/transacoes',
      icon: icons.IconReceipt,
      breadcrumbs: true
    },
    {
      id: 'categories',
      title: 'Categorias',
      type: 'item',
      url: '/categorias',
      icon: icons.IconCategory,
      breadcrumbs: true
    },
    {
      id: 'bills',
      title: 'Contas',
      type: 'item',
      url: '/contas',
      icon: icons.IconFileInvoice,
      breadcrumbs: true
    },
    {
      id: 'family',
      title: 'Família',
      type: 'item',
      url: '/familia',
      icon: icons.IconUsersGroup,
      breadcrumbs: true
    }
  ]
};

export default finance;
