import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const adicionarFavorito = async (userId: string, livroId: number, token: string) => {
  const response = await axios.post(
    `${API_URL}/favorites/${userId}/${livroId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
