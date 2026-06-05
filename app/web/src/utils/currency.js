export function formatCurrency(value) {
  return Number(value || 0).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}

export function formatInputCurrency(value) {
  const numbers = value.replace(/\D/g, "");

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}