import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import Modal from "../../components/Modal/Modal";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
  });
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModalCreate() {
    setEditingId(null);
    setFormData({ name: "", type: "EXPENSE" });
    setShowModal(true);
  }

  function openModalEdit(category) {
    setEditingId(category.id);
    setFormData({ name: category.name, type: category.type });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", type: "EXPENSE" });
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData.name, formData.type);
        alert("Categoria atualizada com sucesso");
      } else {
        await createCategory(formData.name, formData.type);
        alert("Categoria criada com sucesso");
      }
      closeModal();
      loadCategories();
    } catch (err) {
      alert(`Erro: ${err.response?.data?.message || err.message}`);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja remover esta categoria?")) {
      try {
        await deleteCategory(id);
        alert("Categoria removida com sucesso");
        loadCategories();
      } catch (err) {
        alert(`Erro: ${err.response?.data?.message || err.message}`);
      }
    }
  }

  const filteredCategories = categories.filter(
    (cat) => filterType === "ALL" || cat.type === filterType
  );

  return (
    <MainLayout>
      <div className="categories-container">
        <div className="categories-header">
          <div>
            <h1>Categorias</h1>
            <p>Gerencie suas categorias de renda e despesa</p>
          </div>
          <button className="btn-create" onClick={openModalCreate}>
            <FiPlus /> Nova Categoria
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === "ALL" ? "active" : ""}`}
            onClick={() => setFilterType("ALL")}
          >
            Todas ({categories.length})
          </button>
          <button
            className={`filter-btn ${filterType === "EXPENSE" ? "active" : ""}`}
            onClick={() => setFilterType("EXPENSE")}
          >
            Despesas ({categories.filter((c) => c.type === "EXPENSE").length})
          </button>
          <button
            className={`filter-btn ${filterType === "INCOME" ? "active" : ""}`}
            onClick={() => setFilterType("INCOME")}
          >
            Receitas ({categories.filter((c) => c.type === "INCOME").length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando categorias...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma categoria encontrada</h3>
            <p>Crie sua primeira categoria para começar</p>
          </div>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className={`category-badge ${category.type.toLowerCase()}`}>
                    {category.type === "EXPENSE" ? "Despesa" : "Receita"}
                  </span>
                </div>
                <p className="category-date">
                  Criada em {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="category-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openModalEdit(category)}
                    title="Editar"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(category.id)}
                    title="Remover"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showModal} onClose={closeModal}>
          <div className="modal-content">
            <h2>{editingId ? "Editar Categoria" : "Criar Categoria"}</h2>

            <div className="form-group">
              <label htmlFor="name">Nome da Categoria</label>
              <input
                type="text"
                id="name"
                placeholder="Ex: Alimentação, Transporte..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                {editingId ? "Atualizar" : "Criar"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}