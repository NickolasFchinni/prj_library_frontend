import { useState, useEffect } from "react";
import { fetchLivros } from "../services/bookService";
import { Livro } from "../types";

export const useLivros = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const livrosData = await fetchLivros(token);
      setLivros(livrosData);
    } catch (err: any) {
      console.error("Erro ao buscar livros:", err);
      setError("Erro ao buscar livros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  return { livros, loading, error, carregarLivros };
};