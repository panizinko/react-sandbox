export async function fetchServices() {
  const response = await fetch("http://localhost:3001/services");
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  return response.json();
}
