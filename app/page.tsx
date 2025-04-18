"use client"
import { toast, Toaster } from "react-hot-toast"
import React, { useEffect, useState } from "react"
import axios from "axios"

const Home = () => {
  const [livros, setLivros] = useState([])
  const [favoritos, setFavoritos] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("livros")
  const [showModal, setShowModal] = useState(false)
  const [novoLivro, setNovoLivro] = useState({ title: "", author: "" })

  useEffect(() => {
    fetchLivros()
  }, [])

  const fetchLivros = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://127.0.0.1:8000/books", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLivros(response.data)
    } catch (err) {
      console.error("Erro ao buscar livros:", err)
    }
  }

  const fetchFavoritos = async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const response = await axios.get(
        `http://127.0.0.1:8000/favorites/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const favoritosData = response.data || []

      const livrosFavoritos = favoritosData
        .map((fav: any) => fav.book)
        .filter((book: any) => book && book.title)

      setFavoritos(livrosFavoritos)
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err)
    }
  }

  const adicionarFavorito = async (livro: any) => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")

      if (!userId) {
        toast.error("Usuário não identificado.")
        return
      }

      await axios.post(
        `http://127.0.0.1:8000/favorites/${userId}/${livro.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success("Livro adicionado aos favoritos!")
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.detail)
      }
      console.error("Erro ao favoritar:", err)
    }
  }

  const salvarNovoLivro = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://127.0.0.1:8000/books",
        { title: novoLivro.title, author: novoLivro.author },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Livro adicionado com sucesso!")
      setShowModal(false)
      setNovoLivro({ title: "", author: "" })
      fetchLivros()
    } catch (err) {
      console.error("Erro ao adicionar livro:", err)
    }
  }

  const handleTabChange = (newTab: string) => {
    setTab(newTab)
    if (newTab === "favoritos") {
      fetchFavoritos()
    }
  }

  const livrosFiltrados = (tab === "livros" ? livros : favoritos).filter(
    (livro: any) =>
      livro &&
      livro.title &&
      livro.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-10 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Minha Biblioteca 📚
        </h1>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
      {/* Ações */}
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

      <div className="w-full max-w-4xl relative mb-8">
        <input
          type="text"
          placeholder="Pesquisar livros..."
          className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              {tab === "livros" && (
                <button
                  onClick={() => adicionarFavorito(livro)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Favoritar
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
  )
}

export default Home
