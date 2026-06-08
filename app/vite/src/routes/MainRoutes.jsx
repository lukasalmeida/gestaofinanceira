import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';

const FinanceDashboard = Loadable(lazy(() => import('views/finance/Dashboard')));
const CategoriesPage = Loadable(lazy(() => import('views/finance/Categories')));
const TransactionsPage = Loadable(lazy(() => import('views/finance/Transactions')));
const BillsPage = Loadable(lazy(() => import('views/finance/Bills')));
const FamilyPage = Loadable(lazy(() => import('views/family/Family')));

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: '/',
      element: <FinanceDashboard />
    },
    {
      path: 'transacoes',
      element: <TransactionsPage />
    },
    {
      path: 'categorias',
      element: <CategoriesPage />
    },
    {
      path: 'contas',
      element: <BillsPage />
    },
    {
      path: 'familia',
      element: <FamilyPage />
    }
  ]
};

export default MainRoutes;
