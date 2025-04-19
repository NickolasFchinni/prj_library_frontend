import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const BookService = {
  getAllBooks: async () => {
    const response = await axios.get(`${API_BASE_URL}/books`, getAuthHeader());
    return response.data;
  },

  addBook: async (title: string, author: string) => {
    await axios.post(
      `${API_BASE_URL}/books`,
      { title, author },
      getAuthHeader()
    );
  },

  deleteBook: async (bookId: number) => {
    await axios.delete(`${API_BASE_URL}/books/${bookId}`, getAuthHeader());
  },
};

export const FavoriteService = {
  getFavorites: async (userId: any) => {
    const response = await axios.get(
      `${API_BASE_URL}/favorites/${userId}`,
      getAuthHeader()
    );
    return response.data || [];
  },

  addFavorite: async (userId: string, bookId: number) => {
    await axios.post(
      `${API_BASE_URL}/favorites/${userId}/${bookId}`,
      {},
      getAuthHeader()
    );
  },

  removeFavorite: async (userId: string, bookId: number) => {
    await axios.delete(
      `${API_BASE_URL}/favorites/${userId}/${bookId}`,
      getAuthHeader()
    );
  },
};