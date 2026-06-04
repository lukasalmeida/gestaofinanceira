import MainLayout from "../../layouts/MainLayout";

import Card from "../../components/Card/Card";

import './Dashboard.css'

import { useState } from "react"
import Modal from "../../components/Modal/Modal"

import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalanceWallet,
  MdCategory
} from "react-icons/md";

export default function Dashboard() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
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
      <div className="dashboard-actions">
        <button
          className="income-btn"
          onClick={() => setIncomeModalOpen(true)}
        >
          + Receita
        </button>

        <button
          className="expense-btn"
          onClick={() => setExpenseModalOpen(true)}
        >
          - Despesa
        </button>
      </div>


      <Modal
        isOpen={incomeModalOpen}
        title="Nova Receita"
        onClose={() => setIncomeModalOpen(false)}
      >
        <form>
          <div className="form-group">
            <label>Categoria</label>

            <select>
              <option>Selecione</option>
            </select>
          </div>

          <div className="form-group">
            <label>Valor</label>

            <input
              type="number"
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>

            <input
              type="text"
              placeholder="Descrição"
            />
          </div>

          <button type="submit">
            Salvar Receita
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={expenseModalOpen}
        title="Nova Despesa"
        onClose={() => setExpenseModalOpen(false)}
      >
        <form>
          <div className="form-group">
            <label>Categoria</label>

            <select>
              <option>Selecione</option>
            </select>
          </div>

          <div className="form-group">
            <label>Valor</label>

            <input
              type="number"
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>

            <input
              type="text"
              placeholder="Descrição"
            />
          </div>

          <button type="submit">
            Salvar Despesa
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}