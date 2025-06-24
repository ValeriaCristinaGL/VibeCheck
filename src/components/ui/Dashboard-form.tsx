import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Exemplo usando recharts (ou troque pelo seu gráfico preferido)
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dados simulados organizados por semana, emoji, check-in e check-out
const dadosSemanais = [
  {
    semana: "1ª semana",
    emoji: "😊",
    checkin: 10,
    checkout: 8,
  },
  {
    semana: "1ª semana",
    emoji: "😐",
    checkin: 5,
    checkout: 7,
  },
  {
    semana: "1ª semana",
    emoji: "😢",
    checkin: 3,
    checkout: 2,
  },
  {
    semana: "2ª semana",
    emoji: "😊",
    checkin: 8,
    checkout: 6,
  },
  {
    semana: "2ª semana",
    emoji: "😐",
    checkin: 6,
    checkout: 8,
  },
  {
    semana: "2ª semana",
    emoji: "😢",
    checkin: 4,
    checkout: 3,
  },
];

// Mapeia cada combinação semana+emoji para um formato de gráfico de barras agrupadas
const dadosAgrupados = [
  {
    semana: "1ª semana",
    "😊": 10,
    "😐": 5,
    "😢": 3,
  },
  {
    semana: "2ª semana",
    "😊": 8,
    "😐": 6,
    "😢": 4,
  },
];

// Cores para cada emoji
const coresEmojis: Record<string, string> = {
  "😊": "#4ade80",
  "😐": "#facc15",
  "😢": "#60a5fa",
};

export function DashboardForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen bg-[#222]", className)} {...props}>
      <Card className="w-full max-w-3xl bg-[#333] text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Dashboard Semanal de Emoções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosAgrupados}>
                <XAxis dataKey="semana" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                {Object.keys(coresEmojis).map((emoji) => (
                  <Bar key={emoji} dataKey={emoji} fill={coresEmojis[emoji]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Perguntas que o dashboard responde:</h3>
            <ul className="list-disc pl-6 space-y-1 text-white text-base">
              <li>✅ Qual a emoção mais comum dos alunos em cada semana?</li>
              <li>✅ A felicidade aumentou ou diminuiu ao longo das semanas?</li>
              <li>✅ Há aumento de estados como ansiedade ou tristeza em certas semanas?</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}