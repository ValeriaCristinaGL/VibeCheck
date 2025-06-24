import { useState, useEffect, useCallback } from 'react';
// Importação dos componentes de UI personalizados
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

// Tipos TypeScript para os dados do gráfico
type EmotionDataPoint = {
  week: string;
  [emotion: string]: number | string;
};

type DashboardData = EmotionDataPoint[];
type TimeRange = 'week' | 'month' | 'all';

// Cores padrão para cada emoção
const DEFAULT_EMOTION_COLORS: Record<string, string> = {
  "Muito Feliz": "#4ade80",
  "Feliz": "#86efac",
  "Desmotivado": "#a3a3a3",
  "Indiferente": "#d4d4d4",
  "Surpreso": "#fbbf24",
  "Triste": "#60a5fa",
  "Irritado": "#f87171",
  "Ansioso": "#c084fc",
  "Apaixonado": "#f472b6",
};

// Dados mockados para exibição inicial (remover ao integrar com backend)
const MOCK_DATA: DashboardData = [
  { week: "Semana 1", "Muito Feliz": 2, "Feliz": 3, "Desmotivado": 1, "Indiferente": 2, "Surpreso": 1, "Triste": 2, "Irritado": 1, "Ansioso": 1, "Apaixonado": 1 },
  { week: "Semana 2", "Muito Feliz": 1, "Feliz": 2, "Desmotivado": 2, "Indiferente": 3, "Surpreso": 2, "Triste": 1, "Irritado": 2, "Ansioso": 1, "Apaixonado": 0 },
  { week: "Semana 3", "Muito Feliz": 3, "Feliz": 1, "Desmotivado": 1, "Indiferente": 1, "Surpreso": 2, "Triste": 3, "Irritado": 1, "Ansioso": 2, "Apaixonado": 2 },
  { week: "Semana 4", "Muito Feliz": 2, "Feliz": 4, "Desmotivado": 1, "Indiferente": 2, "Surpreso": 1, "Triste": 0, "Irritado": 1, "Ansioso": 2, "Apaixonado": 1 },
];

// Componente principal do Dashboard
export function DashboardForm() {
  // Estados para filtro de tempo, dados, loading, erro e navegação
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para carregar dados (mockados por padrão, backend comentado)
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // --- INTEGRAÇÃO COM BACKEND (descomente para usar) ---
      /*
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/emotions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Resposta da API inválida');
      }

      setData(result.data);
      */
      
      // --- MOCK: simula delay e carrega dados locais ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
      setData(MOCK_DATA);
      
    } catch (err) {
      // Tratamento de erro
      console.error("Erro ao carregar dados:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Falha ao carregar dados');
      }
      toast();
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carrega os dados ao montar o componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função para recarregar os dados (usada no botão de refresh)
  const handleRefresh = () => {
    loadData();
  };

  // Função para filtrar os dados conforme o período selecionado
  const getFilteredData = useCallback((): DashboardData => {
    if (!data || data.length === 0) return [];
    
    switch (timeRange) {
      case 'week':
        return data.slice(-1); // Última semana
      case 'month':
        return data.slice(-4); // Últimas 4 semanas
      default:
        return data; // Todas as semanas
    }
  }, [data, timeRange]);

  // Dados filtrados para exibição no gráfico
  const filteredData = getFilteredData();

  // Lista de emoções disponíveis nos dados
  const availableEmotions = data && data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'week') 
    : [];

  // Função para obter a cor de cada emoção
  const getEmotionColor = (emotion: string) => {
    return DEFAULT_EMOTION_COLORS[emotion] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
  };

  // Exibe skeletons enquanto carrega os dados
  if (loading && !data) {
    return (
      <div className="space-y-6">
        {/* Card de loading do filtro */}
        <Card className="border-none shadow-none">
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Card de loading do gráfico */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exibe mensagem de erro e botões de ação caso haja erro ao carregar dados
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-white">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="text-white"
                onClick={handleRefresh}
              >
                Tentar novamente
              </Button>
              <Button 
                variant="outline" 
                className="text-white"
                onClick={() => navigate('/')}
              >
                Voltar ao início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderização principal do dashboard
  return (
    <div className="space-y-6">
      {/* Card de filtro e controles */}
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Título e botão de recarregar */}
            <CardTitle className="text-lg text-white">Relatórios</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={loading}
            >
              {/* Ícone de recarregar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-5 w-5 text-white ${loading ? 'animate-spin' : ''}`}
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </Button>
          </div>
          {/* Menu popover com navegação para check-in e check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <span className="flex flex-col gap-[3px]">
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                  <span className="block w-6 h-0.5 bg-white rounded"></span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 flex flex-col gap-2">
              <Button variant="outline" onClick={() => navigate("/checkin")}>Ir para Check-in</Button>
              <Button variant="outline" onClick={() => navigate("/checkout")}>Ir para Check-out</Button>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Botões de filtro de período */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <Button 
              variant={timeRange === 'all' ? "default" : "outline"} 
              onClick={() => setTimeRange('all')}
              disabled={loading}
            >
              Todos
            </Button>
            <Button 
              variant={timeRange === 'week' ? "default" : "outline"} 
              onClick={() => setTimeRange('week')}
              disabled={loading}
            >
              Semana
            </Button>
            <Button 
              variant={timeRange === 'month' ? "default" : "outline"} 
              onClick={() => setTimeRange('month')}
              disabled={loading}
            >
              Mês
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card do gráfico */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-medium mb-4 text-white">Visualização Gráfica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {/* Se houver dados, mostra o gráfico, senão mostra mensagem */}
            {data && data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={filteredData} 
                    margin={{ top: 10, right: 30, left: -30, bottom: 10 }}
                >
                    {/* Grade do gráfico */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4b5563" />
                    {/* Eixo X: semanas */}
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: '#ffffff' }} 
                      tickMargin={10}
                    />
                    {/* Eixo Y: valores (números) das emoções */}
                    <YAxis 
                      tick={{ fill: '#ffffff' }} 
                      allowDecimals={false}
                      width={50} // largura para os números
                    />
                    {/* Tooltip: mostra detalhes ao passar o mouse */}
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        borderColor: '#4b5563',
                        borderRadius: '0.5rem',
                      }}
                      itemStyle={{ color: '#ffffff' }}
                      labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                    />
                    {/* Legenda das emoções */}
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ 
                        marginTop: 20,
                        paddingTop: 10,
                        color: '#ffffff'
                      }}
                    />
                    {/* Linhas do gráfico para cada emoção */}
                    {availableEmotions.map((emotion) => (
                      <Line
                        key={emotion}
                        type="monotone"
                        dataKey={emotion}
                        stroke={getEmotionColor(emotion)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name={emotion}
                        animationDuration={500}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              // Caso não haja dados, mostra mensagem e botão para recarregar
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-400 text-lg">Nenhum dado disponível</p>
                <Button 
                  variant="outline" 
                  className="text-white"
                  onClick={handleRefresh}
                >
                  Recarregar dados
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}