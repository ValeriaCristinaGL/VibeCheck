import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ComboboxDemo } from "@/components/ui/comboBox"
import { Label } from "@/components/ui/label"
import { SuccessCard } from "@/components/ui/successCard"
import { useNavigate } from "react-router-dom"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"

// Modal simples para confirmação
function ModalConfirm({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#4A4A4A] text-white p-6 rounded shadow-lg max-w-xs text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-around">
          <Button className="cursor-pointer" variant="destructive" onClick={onConfirm}>
            Sim
          </Button>
          <Button className="cursor-pointer" variant="secondary" onClick={onCancel}>
            Não
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CheckIn({ className, ...props }: React.ComponentProps<"div">) {
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null)
  const [turma, setTurma] = useState("")
  type Turma = { id: number; nome: string };
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const loadTurmas = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/codigo/turmas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!response.ok) throw new Error("Erro ao buscar turmas")

      const turmasApi: Turma[] = await response.json()

      // Filtra turmas inválidas (id 0 ou nome "string")
      const turmasValidas = turmasApi.filter(
        (t) => t.id !== 0 && t.nome.toLowerCase() !== "string"
      )

      setTurmas(turmasValidas.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (err) {
      console.error("Erro ao carregar turmas:", err)
    }
  }, [])


  // Fecha lista ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsListOpen(false)
        setEditIndex(null) // cancela edição se estiver aberta
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        window.location.href = "/"
      } else {
        console.error("Erro ao fazer logout")
      }
    } catch (err) {
      console.error("Erro durante logout:", err)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const newErrors: { [key: string]: string } = {}
    if (!turma.trim()) {
      newErrors.turma = "Por favor, selecione ou crie uma turma."
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    try {
      const response = await fetch(
        "http://localhost:8080/api/codigo/liberar-checkin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nomeTurma: turma }),
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao gerar código de check-in")
      }

      const data = await response.json()
      setCodigoGerado(data.codigo)
      setTurma("")
      setErrors({})
    } catch (error) {
      console.error("Erro ao gerar código de check-in:", error)
      setErrors((prev) => ({
        ...prev,
        geral: "Falha ao liberar check-in. Tente novamente.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const iniciarEdicao = (index: number) => {
    setEditIndex(index)
    setEditValue(turmasFiltradas[index].nome)
    setIsListOpen(true) // mantém lista aberta para edição
  }

  const confirmarEdicao = async () => {
    if (editValue.trim() === "") {
      setErrors((prev) => ({ ...prev, turma: "Nome da turma não pode ser vazio." }))
      return
    }

    try {
      const turmaAntiga = turmasFiltradas[editIndex!]

      const response = await fetch(
        `http://localhost:8080/api/turmas/${parseInt(turmaAntiga.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: editValue,
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao editar turma")
      }

      const novaLista = turmas.map((t) =>
        t.id === turmaAntiga.id ? { ...t, nome: editValue.trim() } : t
      )
      setTurmas(novaLista.sort((a, b) => a.nome.localeCompare(b.nome)))
      setEditIndex(null)
      setEditValue("")
      setErrors({})
      setIsListOpen(false)
    } catch (error) {
      console.error("Erro ao editar turma:", error)
      setErrors((prev) => ({ ...prev, geral: "Erro ao editar turma. Tente novamente." }))
    }
  }

  const cancelarEdicao = () => {
    setEditIndex(null)
    setEditValue("")
    setErrors({})
  }

  const abrirModalExcluir = (index: number) => {
    setDeleteIndex(index)
    setIsListOpen(true) // mantém aberto enquanto confirma exclusão
  }

  const confirmarExclusao = async () => {
    try {
      const turmaParaApagar = turmasFiltradas[deleteIndex!]
      console.log("Apagando turma:", turmaParaApagar.id);

      const response = await fetch(
        `http://localhost:8080/api/turmas/${parseInt(turmaParaApagar.id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao apagar turma")
      }

      const novaLista = turmas.filter((t) => t.id !== turmaParaApagar.id)
      setTurmas(novaLista)
      setDeleteIndex(null)
      setErrors({})
      if (turma === turmaParaApagar.nome) setTurma("")
      setIsListOpen(false)
    } catch (error) {
      console.error("Erro ao apagar turma:", error)
      setErrors((prev) => ({ ...prev, geral: "Erro ao apagar turma. Tente novamente." }))
      setDeleteIndex(null)
    }
  }

  const cancelarExclusao = () => {
    setDeleteIndex(null)
  }

  useEffect(() => {
    loadTurmas()
  }, [turmas, loadTurmas])

  // Filtra turmas com base no texto digitado (case insensitive)
  const turmasFiltradas = turmas.filter((t) =>
  t.nome.toLowerCase().includes(turma.toLowerCase())
)



  return (
    <div
      className={cn("relative flex flex-col gap-6", className)}
      {...props}
      ref={containerRef}
    >
      {/* Botão voltar */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white cursor-pointer hover:bg-transparent absolute top-1 left-4 z-10"
        aria-label="Voltar para dashboard"
        onClick={() => navigate("/dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Botão logout */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="absolute top-1 right-2 cursor-pointer bg-[#394779] text-white hover:bg-[#3d4381]"
      >
        Encerrar Sessão
      </Button>

      <Card className="border-none">
        <img
          src="/vibe-check-logo.png"
          alt="Logo"
          className="mx-auto mb-4 h-48 w-48"
        />

        <CardHeader>
          <CardTitle className="text-white">Check-In</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="turma" className="text-muted-foreground" style={{ color: "#fff" }}>
                Turma
              </Label>

              {/* Combobox para digitar/selecionar/criar turma */}
              <div
                onClick={() => setIsListOpen(true)}
                onFocus={() => setIsListOpen(true)}
              >
                <ComboboxDemo
                  id="turma"
                  value={turma}
                  onChange={(value) => {
                    setTurma(value)
                    clearError("turma")
                    setCodigoGerado(null)
                  }}
                  items={turmas.map((t) => t.nome)} // passa nomes das turmas para sugestão
                  disabled={editIndex !== null}
                />
              </div>

              {/* Lista customizada com botões, aparece só se isListOpen === true */}
              {isListOpen && (
                <div className="bg-[#4A4A4A] rounded-md p-2 max-h-48 overflow-y-auto mt-1">
                  {turmasFiltradas.length === 0 && (
                    <p className="text-white">Nenhuma turma encontrada.</p>
                  )}

                  {turmasFiltradas.map((t, i) => (
                    <div
                      key={t.id}
                      className={cn(
                        "flex items-center justify-between p-1 rounded cursor-pointer",
                        turma === t.nome ? "bg-[#3d4381]" : "hover:bg-[#2a2f57]"
                      )}
                      onClick={() => {
                        if (editIndex === null) {
                          setTurma(t.nome)
                          setIsListOpen(false) // fecha lista ao selecionar
                        }
                      }}
                    >
                      {editIndex === i ? (
                        <>
                          <input
                            type="text"
                            className="rounded px-2 py-1 text-black flex-grow"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button size="sm" variant="outline" onClick={confirmarEdicao} className="ml-2">
                            Salvar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelarEdicao} className="ml-1">
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-white flex-grow truncate">{t.nome}</span>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                iniciarEdicao(i)
                              }}
                              aria-label={`Editar turma ${t.nome}`}
                              title="Editar"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                abrirModalExcluir(i)
                              }}
                              aria-label={`Apagar turma ${t.nome}`}
                              title="Apagar"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {errors.turma && (
                <p className="cursor-pointer text-sm text-red-500 mt-1">{errors.turma}</p>
              )}
            </div>

            {errors.geral && <p className="text-sm text-red-500 mt-2">{errors.geral}</p>}

            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
                style={{ backgroundColor: "#394779", color: "#fff", border: "none" }}
                disabled={isLoading || editIndex !== null}
              >
                {isLoading ? "Liberando..." : "Liberar Check-In"}
              </Button>

              {codigoGerado && <SuccessCard codigo={codigoGerado} />}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal confirmação exclusão */}
      <ModalConfirm
        isOpen={deleteIndex !== null}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        message={`Tem certeza que quer apagar a turma "${
          deleteIndex !== null ? turmasFiltradas[deleteIndex].nome : ""
        }"?`}
      />
    </div>
  )
}
