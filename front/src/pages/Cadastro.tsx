import { Button } from "@/components/button";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();

  // estados para capturar os valores do forms
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [checkSenha, setCheckSenha] = useState("");
  const [nome, setNome] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkShowPassword, setCheckShowPassword] = useState(false);
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
    if (!nome.trim()) {
      newErrors.nome = "O campo de nome é obrigatório."
      toast.error("O campo de nome é obrigatório.", { duration: 3000 });
    }

    if (!email) {
      newErrors.email = "O campo de e-mail é obrigatório."
      toast.error("O campo de e-mail é obrigatório.", { duration: 3000 });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Por favor, insira um e-mail válido.", { duration: 3000 });
      newErrors.email = "Por favor, insira um e-mail válido."
    }

    if (!senha) {
      newErrors.senha = "O campo de senha é obrigatório."
      toast.error("O campo de senha é obrigatório.", { duration: 3000 });

    } else if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.", { duration: 3000 });
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres."
    }

    if (senha !== checkSenha) { 
      toast.error("As senhas não coincidem.", { duration: 3000 });
      newErrors.checkSenha = "As senhas não coincidem."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return // Se houver erros, interrompe

    // Limpa os campos após envio
    setEmail("")
    setSenha("")
    setNome("")
    setCheckSenha("")

    //Chamada da API
  }
  return (
    <div className="flex min-h-screen flex-col  bg-white" >
      {/* Navbar */}
      <header className="flex w-full items-center justify-between px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">VibeCheck</h1>
        <nav className="flex items-center gap-4">
          <Button className="cursor-pointer bg-[#783E98] font-montserrat font-semibold text-white hover:bg-[#783E98] lg:hidden"
            onClick={() => navigate("/")}>
            Voltar
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col-reverse items-center justify-center gap-10 px-8 md:flex-row md:gap-20">
        {/* Texto */}
        <div className="flex w-full max-w-md flex-col justify-center px-8 py-12 borde-5 rounded-2xl bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-dark">Cadastro</h1>
          <h1 className="text-1xl font-semibold text-dark mb-6">Insira as informações para criar uma conta:</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label>
              <span className="text-sm font-semibold">E-mail</span>
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

            <label>
              <span className="text-sm font-semibold">Nome</span>
              <input
                type="nome"
                placeholder="Nome"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  clearError("nome")
                }}
                className={cn(
                  "mt-1 w-full rounded-md border border-gray-300 bg-[#D9D9D9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500",
                  errors.nome && "border-red-500"
                )}
              />
              {errors.nome && (
                <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
              )}
            </label>

            <label className="relative">
              <span className="text-sm font-semibold">Senha</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  clearError("senha")
                }}
                className={cn(
                  "mt-1 w-full rounded-md border border-gray-300 bg-[#D9D9D9] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500",
                  errors.senha && "border-red-500"
                )}
              />
              {errors.senha && (
                <p className="text-sm text-red-500 mt-1">{errors.senha}</p>
              )}
              {/* Botão de ver senha */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[39px] text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {/* Campo para confirmar a senha */}
            <label className="relative">
              <span className="text-sm font-semibold">Confirmar Senha</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar Senha"
                value={checkSenha}
                onChange={(e) => {
                  setCheckSenha(e.target.value)
                  clearError("checkSenha")
                }}
                className={cn(
                  "mt-1 w-full rounded-md border border-gray-300 bg-[#D9D9D9] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500",
                  errors.checkSenha && "border-red-500"
                )}
              />
              {errors.checkSenha && (
                <p className="text-sm text-red-500 mt-1">{errors.checkSenha}</p>
              )}
              {/* Botão de ver senha */}
              <button
                type="button"
                onClick={() => setCheckShowPassword(!checkShowPassword)}
                className="absolute right-3 top-[39px] text-gray-600 hover:text-gray-800"
              >
                {checkShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            <Button 
              className="mt-4 py-6 bg-[#783E98] text-white hover:bg-[#783E98] cursor-pointer"
              type="submit"
            >Cadastrar</Button>
          </form>

          <p className="mt-6 text-center text-sm font-bold">
            Já tem uma conta?{" "}
            <a onClick={() => navigate("/")} className="text-[#783E98] font-bold cursor-pointer">FAZER LOGIN</a>
          </p>
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