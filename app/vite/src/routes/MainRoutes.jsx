import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';

const FinanceDashboard = Loadable(lazy(() => import('views/finance/Dashboard')));
const CategoriesPage = Loadable(lazy(() => import('views/finance/Categories')));
const TransactionsPage = Loadable(lazy(() => import('views/finance/Transactions')));
const BillsPage = Loadable(lazy(() => import('views/finance/Bills')));
const FamilyPage = Loadable(lazy(() => import('views/family/Family')));
const SettingsLayout = Loadable(lazy(() => import('views/settings/SettingsLayout')));
const ProfileSettings = Loadable(lazy(() => import('views/settings/ProfileSettings')));
const AccountSettings = Loadable(lazy(() => import('views/settings/AccountSettings')));

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
    },
    {
      path: 'configuracoes',
      element: <SettingsLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/configuracoes/perfil" replace />
        },
        {
          path: 'perfil',
          element: <ProfileSettings />
        },
        {
          path: 'conta',
          element: <AccountSettings />
        }
      ]
    }
  ]
};

export default MainRoutes;
