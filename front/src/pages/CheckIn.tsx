import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SuccessCard } from "@/components/successCard";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { Home, LogIn, LogOut, Pencil, Plus, Save, X } from "lucide-react";
import {
  getTemporaryTurmaId,
  isSameTurmaName,
  normalizeTurmas,
  sortTurmas,
  type Turma,
} from "@/lib/turmas";

function ModalConfirm({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-xs text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-around gap-4">
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={onConfirm}
          >
            Sim
          </Button>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onCancel}
          >
            Não
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTurma, setIsSavingTurma] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const navigate = useNavigate();

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetTurmaEditor = useCallback(() => {
    setTurma("");
    setSelectedTurmaId(null);
  }, []);

  const loadTurmas = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/avaliacao/turmas",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar turmas");

      const turmasApi: Turma[] = await response.json();
      setTurmas(normalizeTurmas(turmasApi));
    } catch (err) {
      console.error("Erro ao carregar turmas:", err);
      toast.error("Não foi possível carregar as turmas.", { duration: 3000 });
    }
  }, []);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  const turmaSelecionada = useMemo(
    () => turmas.find((item) => item.id === selectedTurmaId) ?? null,
    [selectedTurmaId, turmas]
  );

  const turmasFiltradas = useMemo(
    () =>
      turmas.filter((item) =>
        item.nome.toLowerCase().includes(turma.toLowerCase())
      ),
    [turmas, turma]
  );

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) navigate("/");
      else console.error("Erro ao fazer logout");
    } catch (err) {
      console.error("Erro durante logout:", err);
    }
  };

  const handleSelectTurma = (item: Turma) => {
    setSelectedTurmaId(item.id);
    setTurma(item.nome);
    setCodigoGerado(null);
    clearError("turma");
  };

  const handleTurmaChange = (value: string) => {
    setTurma(value);
    clearError("turma");
    setCodigoGerado(null);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nomeTurma = turma.trim();
    const newErrors: { [key: string]: string } = {};

    if (!nomeTurma) {
      newErrors.turma = "Por favor, selecione ou crie uma turma.";
    }

    if (
      selectedTurmaId !== null &&
      turmaSelecionada &&
      !isSameTurmaName(turmaSelecionada.nome, nomeTurma)
    ) {
      newErrors.turma = "Salve a edição da turma antes de liberar o check-in.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/avaliacao/liberar-checkin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nomeTurma: nomeTurma }),
        }
      );

      if (!response.ok) throw new Error("Erro ao gerar código de check-in");

      const data = await response.json();
      setCodigoGerado(data.codigo);
      await loadTurmas();

      resetTurmaEditor();
      setErrors({});
      toast.success("Código de check-in liberado!", { duration: 3000 });
    } catch (error) {
      console.error("Erro ao gerar código de check-in:", error);
      setErrors((prev) => ({
        ...prev,
        geral: "Falha ao liberar check-in. Tente novamente.",
      }));
      toast.error("Falha ao liberar check-in.", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAdicionarTurma = () => {
    const nomeTurma = turma.trim();
    if (!nomeTurma) {
      setErrors((prev) => ({
        ...prev,
        turma: "Digite o nome da nova turma antes de adicionar.",
      }));
      return;
    }

    const turmaExiste = turmas.some((item) => isSameTurmaName(item.nome, nomeTurma));
    if (turmaExiste) {
      toast.error("Turma já existe na lista.", { duration: 2000 });
      return;
    }

    const novaTurma: Turma = {
      id: getTemporaryTurmaId(),
      nome: nomeTurma,
      isTemp: true,
    };

    setTurmas((prev) => sortTurmas([...prev, novaTurma]));
    setSelectedTurmaId(novaTurma.id);
    setTurma(novaTurma.nome);
    clearError("turma");
    toast.success("Turma adicionada. Ela será salva ao liberar um check-in.", {
      duration: 3000,
    });
  };

  const handleSalvarEdicao = async () => {
    const nomeTurma = turma.trim();

    if (selectedTurmaId === null) {
      toast.error("Selecione uma turma para editar.", { duration: 2000 });
      return;
    }

    if (!nomeTurma) {
      setErrors((prev) => ({
        ...prev,
        turma: "Digite o nome da turma antes de salvar.",
      }));
      return;
    }

    const turmaDuplicada = turmas.some(
      (item) => item.id !== selectedTurmaId && isSameTurmaName(item.nome, nomeTurma)
    );
    if (turmaDuplicada) {
      toast.error("Já existe outra turma com esse nome.", { duration: 2000 });
      return;
    }

    if (turmaSelecionada?.isTemp) {
      setTurmas((prev) =>
        sortTurmas(
          prev.map((item) =>
            item.id === selectedTurmaId ? { ...item, nome: nomeTurma } : item
          )
        )
      );
      setTurma(nomeTurma);
      toast.success("Nome da turma atualizado.", { duration: 2000 });
      return;
    }

    setIsSavingTurma(true);
    try {
      const response = await fetch(`http://localhost:8080/api/turma/${selectedTurmaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(nomeTurma),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao atualizar turma");
      }

      await loadTurmas();
      setTurma(nomeTurma);
      toast.success("Turma atualizada com sucesso!", { duration: 3000 });
    } catch (error) {
      console.error("Erro ao editar turma:", error);
      toast.error("Não foi possível atualizar a turma.", { duration: 3000 });
    } finally {
      setIsSavingTurma(false);
    }
  };

  const cancelarEdicao = () => {
    resetTurmaEditor();
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.turma;
      return newErrors;
    });
  };

  const abrirModalExcluir = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmarExclusao = async () => {
    const turmaParaApagar = deleteIndex !== null ? turmasFiltradas[deleteIndex] : null;
    if (!turmaParaApagar) {
      setDeleteIndex(null);
      return;
    }

    try {
      if (turmaParaApagar.isTemp) {
        setTurmas((prev) => prev.filter((item) => item.id !== turmaParaApagar.id));
      } else {
        const response = await fetch(
          `http://localhost:8080/api/turma/${turmaParaApagar.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Erro ao apagar turma");
        }

        setTurmas((prev) => prev.filter((item) => item.id !== turmaParaApagar.id));
      }

      if (selectedTurmaId === turmaParaApagar.id) {
        resetTurmaEditor();
      }

      setDeleteIndex(null);
      setErrors({});
      toast.success("Turma excluída com sucesso!", { duration: 3000 });
    } catch (error) {
      console.error("Erro ao apagar turma:", error);
      setErrors((prev) => ({
        ...prev,
        geral: "Erro ao apagar turma. Tente novamente.",
      }));
      toast.error("Falha ao apagar turma.", { duration: 3000 });
      setDeleteIndex(null);
    }
  };

  const cancelarExclusao = () => {
    setDeleteIndex(null);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <header className="flex md:hidden w-full items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">@</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-[#783E98] hover:underline"
        >
          Sair
        </button>
      </header>

      <header className="hidden md:flex w-full items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>
        <nav className="flex items-center gap-4">
          <a
            className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </a>
          <a
            className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
            onClick={() => navigate("/checkout")}
          >
            Liberar Check-out
          </a>
          <Button
            className="cursor-pointer bg-[#783E98] font-montserrat font-semibold text-white hover:bg-[#5e3178]"
            onClick={handleLogout}
          >
            Encerrar Sessão
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 w-full flex-col items-center px-4 py-6 md:px-8 md:py-10 pb-24 md:pb-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-[#783E98] mb-8 text-center">
            Iniciar Check-In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <input
                type="text"
                placeholder={
                  selectedTurmaId !== null
                    ? "Edite o nome da turma selecionada"
                    : "Digite uma turma"
                }
                value={turma}
                onChange={(e) => handleTurmaChange(e.target.value)}
                className={`w-full rounded-lg border-2 ${
                  errors.turma ? "border-red-500" : "border-[#783E98]"
                } bg-white px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#783E98]`}
              />
              {errors.turma && (
                <p className="text-sm text-red-500 mt-1">{errors.turma}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {selectedTurmaId !== null
                  ? "Edite o nome e salve a turma selecionada antes de liberar o código."
                  : "Digite o nome de uma turma nova ou selecione uma existente na lista abaixo."}
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {turmasFiltradas.map((item, index) => {
                const isSelected = selectedTurmaId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      isSelected
                        ? "border-[#783E98] bg-[#f7f1fb]"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex flex-1 flex-col items-start text-left"
                      onClick={() => handleSelectTurma(item)}
                    >
                      <span className="text-gray-700 hover:text-[#783E98]">
                        {item.nome}
                      </span>
                      {item.isTemp && (
                        <span className="text-[11px] text-amber-600">
                          Será salva ao liberar um check-in
                        </span>
                      )}
                    </button>
                    <div className="ml-3 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectTurma(item)}
                        className="rounded-md p-2 text-[#783E98] hover:bg-[#efe7f5]"
                        aria-label={`Editar turma ${item.nome}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirModalExcluir(index)}
                        className="rounded-md p-2 text-[#783E98] hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label={`Excluir turma ${item.nome}`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.geral && (
              <p className="text-sm text-red-500">{errors.geral}</p>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#783E98] text-white font-semibold rounded-full hover:bg-[#5e3178] cursor-pointer"
              >
                {isLoading ? "Liberando..." : "Liberar Check-in"}
              </Button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSavingTurma}
                  className="w-full py-4 border-2 border-gray-800 text-gray-800 font-semibold rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={selectedTurmaId !== null ? handleSalvarEdicao : handleAdicionarTurma}
                >
                  {selectedTurmaId !== null ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isSavingTurma ? "Salvando..." : "Salvar edição"}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar nova turma
                    </>
                  )}
                </Button>

                {selectedTurmaId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={cancelarEdicao}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar edição
                  </Button>
                )}
              </div>
            </div>
          </form>

          {codigoGerado && <SuccessCard codigo={codigoGerado} />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50">
        <button
          className="flex flex-col items-center gap-1 text-gray-500"
          onClick={() => navigate("/dashboard")}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Dashboard</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-[#783E98]"
          onClick={() => navigate("/checkin")}
        >
          <LogIn className="w-5 h-5" />
          <span className="text-xs font-medium">Check-in</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-gray-500"
          onClick={() => navigate("/checkout")}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Check-out</span>
        </button>
      </nav>

      <ModalConfirm
        isOpen={deleteIndex !== null}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        message={`Tem certeza que quer apagar a turma "${
          deleteIndex !== null ? turmasFiltradas[deleteIndex]?.nome : ""
        }"?`}
      />
    </div>
  );
}
