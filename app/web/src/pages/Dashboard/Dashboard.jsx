import MainLayout from "../../layouts/MainLayout";

import Card from "../../components/Card/Card";

import './Dashboard.css'

import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalanceWallet,
  MdCategory
} from "react-icons/md";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard-cards">
        <Card
          title="Receitas"
          value="R$ 0,00"
          icon={<MdTrendingUp />}
        />

        <Card
          title="Despesas"
          value="R$ 0,00"
          icon={<MdTrendingDown />}
        />

        <Card
          title="Saldo"
          value="R$ 0,00"
          icon={<MdAccountBalanceWallet />}
        />

        <Card
          title="Categorias"
          value="0"
          icon={<MdCategory />}
        />
      </div>
    </MainLayout>
  );
}