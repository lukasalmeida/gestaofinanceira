export async function getApiHealth() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/health`
  );

  if (!response.ok) {
    throw new Error("API indisponível");
  }

  return response.json();
}