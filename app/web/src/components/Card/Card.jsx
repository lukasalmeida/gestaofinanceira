import "./Card.css";

export default function Card({
  title,
  value,
  icon,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <span>{title}</span>

        <div className="card-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>
    </div>
  );
}