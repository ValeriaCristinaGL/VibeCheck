import { useState } from "react";

export function CheckInForm() {
  const [selectedDate, setSelectedDate] = useState("");
  const [turma, setTurma] = useState("");
  const [codigoGerado, setCodigoGerado] = useState<string | null>(null);

  const turmas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCodigoGerado("ABC123");
    console.log({
      data: selectedDate,
      turma: turma,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-xs flex flex-col gap-7">
        <h1 className="text-white text-2xl font-semibold">Iniciar Práticas</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-white text-sm mb-1">
              Data do Encontro
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg bg-[#444] text-white p-3 mb-2 border-2 border-[#394779] focus:border-[#5c6bc0] outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="turma" className="text-white text-sm mb-1">
              Turma
            </label>
            <select
              id="turma"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="rounded-lg bg-[#444] text-white p-3 mb-2 border-2 border-[#394779] focus:border-[#5c6bc0] outline-none"
              required
            >
              <option value="">Selecione</option>
              {turmas.map((t) => (
                <option key={t} value={t}>
                  {t}º Turma
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#394779] text-white border-none hover:bg-[#2e375e] rounded-lg p-1.5 font-medium transition-colors "
          >
            Liberar código do Check-in
          </button>
        </form>

        {codigoGerado && (
          <div className="bg-[#444] rounded-xl text-white p-4 mt-2">
            <p className="flex items-center gap-2 text-green-400 font-semibold">
              ✓ Código Gerado Com Sucesso
            </p>
            <p className="mt-2">Código:</p>
            <p className="text-xl font-bold">{codigoGerado}</p>
          </div>
        )}
      </div>
    </div>
  );
}
