import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export default function RecuperaSenhaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // estados para capturar os valores do forms
  const [email, setEmail] = useState("");
  const [showTitulo, setShowTitulo] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}) // Armazena erros de validação
  

  // Limpa o erro de um campo específico ao alterar o valor
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();// evita reload da página
    const newErrors: { [key: string]: string } = {}

    // Validações
    if (!email) {
      newErrors.email = "O campo de e-mail é obrigatório."
      toast.error("O campo de e-mail é obrigatório.", { duration: 3000 });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Por favor, insira um e-mail válido."
      toast.error("Por favor, insira um e-mail válido.", { duration: 3000 });
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return // Se houver erros, interrompe
    setLoading(true);

    // Limpa os campos após envio
    setEmail("")
    //Chamada da API
    setLoading(false);
    setShowTitulo(true);
  }
  return (
    <div className="flex min-h-screen flex-col bg-white" >
      {/* Navbar */}
      <header className="flex w-full items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-4">
          <a
            className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
            onClick={() => navigate("/")}
          >
            Voltar
          </a>
          <a
            className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
            onClick={() => navigate("/")}
          >
            Página Inicial
          </a>
        </nav>

        {/* Botão Hamburguer (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className="text-[#783E98]" /> : <Menu size={28} className="text-[#783E98]" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden z-50">
            <a
              className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
              onClick={() => {
                navigate("/dashboard");
                setIsOpen(false);
              }}
            >
              Voltar
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col-reverse items-center justify-center gap-10 px-8 md:flex-row md:gap-20">
        {/* Texto */}
        <div className="flex w-full max-w-md flex-col justify-center px-8 py-12 borde-5 rounded-2xl bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-dark">Recuperar Senha:</h1>
          <h1 className="text-1xl font-semibold text-dark mb-4">Informe seu e-mail</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError("email")
                }}
                className={cn(
                  "mt-1 w-full rounded-md border border-gray-300 bg-[#D9D9D9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </label>

            <Button 
              className="mt-4 py-6 bg-[#783E98] text-white hover:bg-[#783E98] cursor-pointer"
              type="submit"
              disabled={loading}
            >
            {loading ? (
            <span className="flex items-center justify-center gap-2 font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </span>
            ) : (
              "Enviar"
            )}
            </Button>
            {showTitulo && (
                <h1 className="text-center font-bold font-unbounded text-[#783E98] text-2x1">Verifique seu email para redefinir a senha</h1>
            )}
          </form>
        </div>

        {/* <div className="flex flex-col items-center max-w-xs md:max-w-md">
          <img
            src="/public/figura.svg" // coloque a imagem aqui dentro da pasta public/
            alt="Pessoa ouvindo música futurista"
            className="rounded-[2rem] object-cover"
          />
          <div className="flex flex-col items-center text-center md:items-start md:text-center">
            <h2 style={{lineHeight: '1.5'}} className="text-2xl md:text-3xl lg:text-4xl leading-snug font-unbounded text-[#7032C7]">
              Transforme suas<br />
              emoções em<br />{" "}
              <span className="font-bold text-[#7032C7]">Bem-Estar</span>
            </h2>
          </div>
        </div> */}
      </main>
    </div>
  );
}