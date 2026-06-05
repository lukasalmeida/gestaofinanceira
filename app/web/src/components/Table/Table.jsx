import "./Table.css";
import { formatCurrency } from "../../utils/currency";


export default function Table({ data = [] }) {
  return (
    <div className="table-container">
      <h2>Últimas Transações</h2>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">
                Nenhuma transação encontrada
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>

                <td>{item.category?.name}</td>

                <td>
                  <span className={`type ${item.type}`}>
                    {item.type === "INCOME" ? "Receita" : "Despesa"}
                  </span>
                </td>

                <td className={item.type}>
                  <td className={item.type}>
                    {item.type === "INCOME" ? "+" : "-"}
                    {" "}
                    {formatCurrency(item.amount)}
                  </td>
                </td>

                <td>
                  {new Date(item.createdAt).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}