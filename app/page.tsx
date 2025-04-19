"use client";
import { Toaster } from "react-hot-toast";
import { useLibrary } from "./hooks/useLibrary";

const Home = () => {
  const {
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
  } = useLibrary();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-10 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Minha Biblioteca 📚
        </h1>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Ações */}
      <div className="flex justify-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mb-8">
          <button
            className={`flex-1 border border-gray-400 rounded-lg py-2 text-gray-700 hover:bg-gray-200 transition`}
            onClick={() => handleTabChange("livros")}
          >
            Todos os Livros
          </button>
          <button
            className="flex-1 border border-gray-400 rounded-lg py-2 text-gray-700 hover:bg-gray-200 transition"
            onClick={() => handleTabChange("favoritos")}
          >
            Favoritos
          </button>
          <button
            className="flex-1 bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition"
            onClick={() => setShowModal(true)}
          >
            + Adicionar
          </button>
        </div>
      </div>

      <div className="w-full relative mb-8">
        <input
          type="text"
          placeholder="Pesquisar livros..."
          className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className="w-5 h-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>

      {livrosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum livro encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {livrosFiltrados.map((livro: any, index: number) => (
            <li
              key={`${livro.id}-${index}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-1">{livro.title}</h3>
              <p className="text-gray-500 mb-2">{livro.author}</p>
              {tab === "livros" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => removerLivro(livro)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Deletar
                  </button>
                  <button
                    onClick={() => adicionarFavorito(livro)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Favoritar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => removerFavorito(livro)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Livro</h2>
            <input
              type="text"
              placeholder="Nome do Livro"
              className="w-full p-2 mb-4 border rounded"
              value={novoLivro.title}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Autor"
              className="w-full p-2 mb-4 border rounded"
              value={novoLivro.author}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, author: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={salvarNovoLivro}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;