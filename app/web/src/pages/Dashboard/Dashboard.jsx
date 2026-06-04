import MainLayout from "../../layouts/MainLayout";

import Card from "../../components/Card/Card";

import './Dashboard.css'

import { useState, useEffect } from "react"
import Modal from "../../components/Modal/Modal"

import Table from "../../components/Table/Table";

import { getTransactions, createTransaction } from "../../services/transactionService";
import { getCategories } from "../../services/categoryService"

import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalanceWallet,
  MdCategory
} from "react-icons/md";

export default function Dashboard() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions || data || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTransaction(type, data) {
    await createTransaction({
      type,
      ...data
    });

    await loadTransactions();

    setIncomeModalOpen(false);
    setExpenseModalOpen(false);
  }

  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : [];

  const income = safeTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const expense = safeTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const balance = income - expense;

  const categoriesCount = new Set(
    safeTransactions
      .map((t) => t.category?.name)
      .filter(Boolean)
  ).size;

  const [incomeForm, setIncomeForm] = useState({
    categoryId: "",
    amount: "",
    description: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    categoryId: "",
    amount: "",
    description: ""
  });

  async function handleSubmitIncome(e) {
    e.preventDefault();

    await handleCreateTransaction("INCOME", {
      ...incomeForm,
      amount: Number(incomeForm.amount),
      date: new Date().toISOString()
    });

    setIncomeForm({
      categoryId: "",
      amount: "",
      description: ""
    });
  }

  async function handleSubmitExpense(e) {
    e.preventDefault();

    await handleCreateTransaction("EXPENSE", {
      ...expenseForm,
      amount: Number(expenseForm.amount),
      date: new Date().toISOString()
    });

    setExpenseForm({
      categoryId: "",
      amount: "",
      description: ""
    });
  }

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data.categories || data || []);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    }
  }

  const [typeFilter, setTypeFilter] = useState("ALL");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = safeTransactions.filter((t) => {
    const matchType =
      typeFilter === "ALL" ? true : t.type === typeFilter;

    const transactionDate = new Date(t.date || t.createdAt);

    const matchStartDate = startDate
      ? transactionDate >= new Date(startDate)
      : true;

    const matchEndDate = endDate
      ? transactionDate <= new Date(endDate)
      : true;

    return matchType && matchStartDate && matchEndDate;
  });

  return (
    <MainLayout>
      <div className="dashboard-cards">
        <Card
          title="Receitas"
          value={`R$ ${income.toFixed(2)}`}
          icon={<MdTrendingUp />}
        />

        <Card
          title="Despesas"
          value={`R$ ${expense.toFixed(2)}`}
          icon={<MdTrendingDown />}
        />

        <Card
          title="Saldo"
          value={`R$ ${balance.toFixed(2)}`}
          icon={<MdAccountBalanceWallet />}
        />

        <Card
          title="Categorias"
          value={categoriesCount}
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

      <div className="table-filters">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">Todos</option>
          <option value="INCOME">Receitas</option>
          <option value="EXPENSE">Despesas</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          className="clear-filter-btn"
          disabled={
            typeFilter === "ALL" &&
            !startDate &&
            !endDate
          }
          onClick={() => {
            setTypeFilter("ALL");
            setStartDate("");
            setEndDate("");
          }}
        >
          Limpar Filtros
        </button>
      </div>

      <Table data={filteredTransactions} />


      <Modal
        isOpen={incomeModalOpen}
        title="Nova Receita"
        onClose={() => setIncomeModalOpen(false)}
      >
        <form onSubmit={handleSubmitIncome}>
          <div className="form-group">
            <label>Categoria</label>

            <select
              value={incomeForm.categoryId}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, categoryId: e.target.value })
              }
            >
              <option value="">Selecione</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor</label>

            <input
              type="number"
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, amount: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>

            <input
              type="text"
              value={incomeForm.description}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, description: e.target.value })
              }
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
        <form onSubmit={handleSubmitExpense}>
          <div className="form-group">
            <label>Categoria</label>

            <select
              value={expenseForm.categoryId}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, categoryId: e.target.value })
              }
            >
              <option value="">Selecione</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor</label>

            <input
              type="number"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>

            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, description: e.target.value })
              }
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