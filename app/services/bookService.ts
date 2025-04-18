import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const fetchLivros = async (token: string) => {
  const response = await axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};