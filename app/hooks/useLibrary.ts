import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BookService, FavoriteService } from "../services/api";

export const useLibrary = () => {
  const [livros, setLivros] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("livros");
  const [showModal, setShowModal] = useState(false);
  const [novoLivro, setNovoLivro] = useState({ title: "", author: "" });

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    try {
      const data = await BookService.getAllBooks();
      setLivros(data);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
    }
  };

  const fetchFavoritos = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const favoritosData = await FavoriteService.getFavorites(userId);
      const livrosFavoritos = favoritosData
        .map((fav: any) => fav.book)
        .filter((book: any) => book && book.title);

      setFavoritos(livrosFavoritos);
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
    }
  };

  const adicionarFavorito = async (livro: any) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Usuário não identificado.");
        return;
      }

      await FavoriteService.addFavorite(userId, livro.id);
      toast.success("Livro adicionado aos favoritos!");
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.detail);
      }
      console.error("Erro ao favoritar:", err);
    }
  };

  const removerFavorito = async (livro: any) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Usuário não identificado.");
        return;
      }

      await FavoriteService.removeFavorite(userId, livro.id);
      toast.success("Livro removido dos favoritos!");
      fetchFavoritos();
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.detail);
      }
      console.error("Erro ao remover dos favoritos:", err);
    }
  };

  const removerLivro = async (livro: any) => {
    try {
      await BookService.deleteBook(livro.id);
      toast.success("Livro removido!");
      fetchLivros();
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.detail);
      }
      console.error("Erro ao remover livro:", err);
    }
  };

  const salvarNovoLivro = async () => {
    try {
      await BookService.addBook(novoLivro.title, novoLivro.author);
      toast.success("Livro adicionado com sucesso!");
      setShowModal(false);
      setNovoLivro({ title: "", author: "" });
      fetchLivros();
    } catch (err) {
      console.error("Erro ao adicionar livro:", err);
    }
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    if (newTab === "favoritos") {
      fetchFavoritos();
    }
  };

  const livrosFiltrados = (tab === "livros" ? livros : favoritos).filter(
    (livro: any) =>
      livro &&
      livro.title &&
      livro.title.toLowerCase().includes(search.toLowerCase())
  );

  return {
    livros,
    favoritos,
    search,
    tab,
    showModal,
    novoLivro,
    livrosFiltrados,
    setSearch,
    setShowModal,
    setNovoLivro,
    adicionarFavorito,
    removerFavorito,
    removerLivro,
    salvarNovoLivro,
    handleTabChange,
  };
};