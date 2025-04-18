import { useState } from "react";
import { adicionarFavorito as adicionarFavoritoService } from "../services/favoriteService";
import { Livro } from "../types";
import { toast } from "react-hot-toast"; // ou qualquer toast que queira usar

export const useFavoritos = () => {
  const [loading, setLoading] = useState(false);

  const adicionarFavorito = async (livro: Livro) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId || !token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      await adicionarFavoritoService(userId, livro.id, token);
      toast.success("Livro adicionado aos favoritos!");
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Erro ao favoritar.");
      }
      console.error("Erro ao favoritar:", err);
    } finally {
      setLoading(false);
    }
  };

  return { adicionarFavorito, loading };
};
