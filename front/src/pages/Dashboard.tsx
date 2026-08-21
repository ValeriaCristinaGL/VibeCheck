import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { buildApiUrl } from "@/api/config";
import { FileText, FileSpreadsheet, Calendar, ChevronDown, ChevronLeft, ChevronRight, Home, LogIn, LogOut } from "lucide-react";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { EMOTIONS, getEmotionByValue } from "@/lib/emotions";
import jsPDF from "jspdf";

// ---------------- Types ----------------
interface Turma {
  id: number;
  nome: string;
}

interface RawDataItem {
  id: number;
  tipo: string;
  emocao: number;
  turma: string;
  data: string;
  alunoId?: number;
}

interface ProcessedItem {
  id: number;
  tipo: string;
  emocao: number;
  turma: string;
  data: Date | null;
  alunoId?: number;
}

interface WeeklyDataItem {
  name: string;
  "Check-in": number;
  "Check-out": number;
}

interface EmotionDataItem {
  id: string;
  name: string;
  value: number;
  fill: string;
}

interface SummaryData {
  melhor: number;
  igual: number;
  pior: number;
}

interface Metrics {
  totalAvaliacoes?: number;
  emocaoMediaAntes?: number;
  emocaoMediaDepois?: number;
  variacao?: number;
}

type RgbColor = [number, number, number];

// ---------------- Cores do sistema ----------------
const SYSTEM_COLORS = {
  primaryHex: "#783E98",
  primaryDarkHex: "#5e3178",
  primarySoftHex: "#efe7f5",
  borderHex: "#E5E7EB",
  primary: [120, 62, 152] as RgbColor,
  primaryDark: [94, 49, 120] as RgbColor,
  primarySoft: [239, 231, 245] as RgbColor,
  text: [31, 41, 55] as RgbColor,
  muted: [107, 114, 128] as RgbColor,
  border: [229, 231, 235] as RgbColor,
  surface: [248, 248, 250] as RgbColor,
  white: [255, 255, 255] as RgbColor,
  success: [34, 197, 94] as RgbColor,
  warning: [234, 179, 8] as RgbColor,
  danger: [239, 68, 68] as RgbColor,
};

const CHART_COLORS = [
  SYSTEM_COLORS.primaryHex,
  "#3B82F6",
  "#22C55E",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
];

// Dias da semana
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR");
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});
const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

const parseApiDate = (value: string): Date | null => {
  const normalized = String(value || "").trim();
  if (!normalized) return null;

  // If API sends ISO datetime with timezone (Z or ±HH:mm), rely on native parser
  // so the value is converted to the user's local timezone before getDay().
  const hasIsoTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized);
  if (hasIsoTimezone) {
    const parsedWithTimezone = new Date(normalized);
    if (!Number.isNaN(parsedWithTimezone.getTime())) {
      return parsedWithTimezone;
    }
  }

  const brMatch = normalized.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (brMatch) {
    const [, day, month, year, hours, minutes, seconds] = brMatch;

    // Backend can send BR datetime in UTC semantics. Parsing as UTC keeps
    // "hoje" filters and weekday buckets aligned with real local day.
    if (hours !== undefined && minutes !== undefined) {
      return new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hours),
          Number(minutes),
          Number(seconds ?? "0")
        )
      );
    }

    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
  }

  const isoMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (isoMatch) {
    const [, year, month, day, hours, minutes, seconds] = isoMatch;

    // API sometimes sends ISO without timezone but values behave like UTC.
    // Treating these as UTC prevents records near midnight from moving to next weekday.
    if (hours !== undefined && minutes !== undefined) {
      return new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hours),
          Number(minutes),
          Number(seconds ?? "0")
        )
      );
    }

    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseInputDate = (value: string, endOfDay = false): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date: Date): string => DATE_LABEL_FORMATTER.format(date);

type ExcelCellValue = string | number;

interface ExcelWorksheetConfig {
  name: string;
  title: string;
  metadata: Array<[string, string]>;
  headers: string[];
  rows: ExcelCellValue[][];
  columnWidths: number[];
}

const escapeXml = (value: ExcelCellValue): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const sanitizeWorksheetName = (name: string): string =>
  name.replace(/[\\/?*[\]:]/g, " ").trim().slice(0, 31) || "Planilha";

const buildExcelCell = (
  value: ExcelCellValue,
  styleId: string,
  mergeAcross?: number
): string => {
  const type = typeof value === "number" && Number.isFinite(value) ? "Number" : "String";
  const mergeAttribute = mergeAcross && mergeAcross > 0 ? ` ss:MergeAcross="${mergeAcross}"` : "";

  return `<Cell ss:StyleID="${styleId}"${mergeAttribute}><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
};

const buildExcelWorksheet = (config: ExcelWorksheetConfig): string => {
  const columnCount = config.headers.length;
  const columns = config.columnWidths
    .map((width) => `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`)
    .join("");
  const metadataRows = config.metadata
    .map(([label, value]) => (
      `<Row>${buildExcelCell(label, "MetaLabel")}${buildExcelCell(value, "MetaValue", columnCount - 2)}</Row>`
    ))
    .join("");
  const headerRow = `<Row ss:Height="22">${config.headers
    .map((header) => buildExcelCell(header, "Header"))
    .join("")}</Row>`;
  const dataRows = config.rows
    .map((row, index) => {
      const styleId = index % 2 === 0 ? "Data" : "DataAlt";
      return `<Row>${row.map((cell) => buildExcelCell(cell, styleId)).join("")}</Row>`;
    })
    .join("");
  const autoFilterEndRow = config.rows.length + config.metadata.length + 3;

  return `
    <Worksheet ss:Name="${escapeXml(sanitizeWorksheetName(config.name))}">
      <Table>${columns}
        <Row ss:Height="28">${buildExcelCell(config.title, "Title", columnCount - 1)}</Row>
        ${metadataRows}
        <Row/>
        ${headerRow}
        ${dataRows || `<Row>${buildExcelCell("Nenhum dado disponivel", "Data", columnCount - 1)}</Row>`}
      </Table>
      <AutoFilter x:Range="R${config.metadata.length + 3}C1:R${autoFilterEndRow}C${columnCount}" xmlns="urn:schemas-microsoft-com:office:excel"/>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>${config.metadata.length + 3}</SplitHorizontal>
        <TopRowBottomPane>${config.metadata.length + 3}</TopRowBottomPane>
        <ActivePane>2</ActivePane>
      </WorksheetOptions>
    </Worksheet>`;
};

const buildExcelWorkbook = (worksheets: ExcelWorksheetConfig[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>VibeCheck</Author>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Color="#1F2937"/>
    </Style>
    <Style ss:ID="Title">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Montserrat" ss:Size="16" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="${SYSTEM_COLORS.primaryHex}" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="MetaLabel">
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Bold="1" ss:Color="${SYSTEM_COLORS.primaryHex}"/>
      <Interior ss:Color="${SYSTEM_COLORS.primarySoftHex}" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="MetaValue">
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Color="#1F2937"/>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="Header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="${SYSTEM_COLORS.primaryDarkHex}" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="${SYSTEM_COLORS.borderHex}"/>
      </Borders>
    </Style>
    <Style ss:ID="Data">
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Color="#1F2937"/>
      <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="${SYSTEM_COLORS.borderHex}"/>
      </Borders>
    </Style>
    <Style ss:ID="DataAlt">
      <Font ss:FontName="Montserrat" ss:Size="10" ss:Color="#1F2937"/>
      <Interior ss:Color="#F8F8FA" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="${SYSTEM_COLORS.borderHex}"/>
      </Borders>
    </Style>
  </Styles>
  ${worksheets.map(buildExcelWorksheet).join("")}
</Workbook>`;

const downloadTextFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob(["\uFEFF", content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getFileDateStamp = () => formatDateForInput(new Date());

const normalizeMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const isBeforeDay = (first: Date, second: Date): boolean =>
  new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime() <
  new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();

const isAfterDay = (first: Date, second: Date): boolean =>
  new Date(first.getFullYear(), first.getMonth(), first.getDate()).getTime() >
  new Date(second.getFullYear(), second.getMonth(), second.getDate()).getTime();

const isInRange = (date: Date, start?: Date, end?: Date): boolean => {
  if (!start || !end) return false;
  return !isBeforeDay(date, start) && !isAfterDay(date, end);
};

const buildCalendarDays = (month: Date): Date[] => {
  const firstDayOfMonth = normalizeMonth(month);
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
};

function CalendarMonthView({
  month,
  rangeStart,
  rangeEnd,
  onSelectDate,
}: {
  month: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
  onSelectDate: (date: Date) => void;
}) {
  const today = new Date();
  const days = buildCalendarDays(month);

  return (
    <div className="w-full min-w-[280px]">
      <div className="mb-3 text-center text-sm font-semibold capitalize text-gray-800">
        {MONTH_LABEL_FORMATTER.format(month)}
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="text-center text-xs font-medium text-gray-500"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === month.getMonth();
          const disabled = isAfterDay(day, today);
          const isStart = rangeStart ? isSameDay(day, rangeStart) : false;
          const isEnd = rangeEnd ? isSameDay(day, rangeEnd) : false;
          const isBetween = isInRange(day, rangeStart, rangeEnd);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              disabled={disabled}
              className={[
                "flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors",
                isCurrentMonth ? "text-gray-800" : "text-gray-300",
                disabled ? "cursor-not-allowed opacity-40" : "hover:bg-[#efe7f5]",
                isBetween ? "bg-[#efe7f5] text-[#783E98]" : "",
                isStart || isEnd ? "bg-[#783E98] font-semibold text-white hover:bg-[#6a3487]" : "",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashBoardPage() {
  const navigate = useNavigate();

  // ---------------- Estados ----------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rawData, setRawData] = useState<RawDataItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([]);
  const [emotionData, setEmotionData] = useState<EmotionDataItem[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({ melhor: 0, igual: 0, pior: 0 });
  const [metrics, setMetrics] = useState<Metrics>({});

  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [turmaFiltro, setTurmaFiltro] = useState("todas");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => normalizeMonth(new Date()));

  const selectedDateRange = dataInicio || dataFim
    ? {
        from: parseInputDate(dataInicio) ?? undefined,
        to: parseInputDate(dataFim) ?? parseInputDate(dataInicio) ?? undefined,
      }
    : undefined;

  // ---------------- Process API Data ----------------
  const processApiData = (apiData: ProcessedItem[]) => {
    const dataAntes = apiData.filter((i) => i.tipo === "checkin");
    const dataDepois = apiData.filter((i) => i.tipo === "checkout");

    const calc = (arr: ProcessedItem[]) => {
      const counts: Record<number, number> = {};
      let soma = 0;
      arr.forEach((i) => {
        const e = Number.isFinite(i.emocao) ? i.emocao : 0;
        counts[e] = (counts[e] || 0) + 1;
        soma += e;
      });
      const avg = arr.length ? soma / arr.length : 0;
      return { counts, avg, total: arr.length };
    };

    const a = calc(dataAntes);
    const d = calc(dataDepois);

    // Dados por dia da semana
    const weeklyMap: Record<string, { checkin: number; checkout: number; checkinCount: number; checkoutCount: number }> = {};
    DIAS_SEMANA.forEach((dia) => {
      weeklyMap[dia] = { checkin: 0, checkout: 0, checkinCount: 0, checkoutCount: 0 };
    });
    apiData.forEach((item) => {
      if (!item.data) return;
      const dayName = DIAS_SEMANA[item.data.getDay()];

      if (item.tipo === "checkin") {
        weeklyMap[dayName].checkin += item.emocao;
        weeklyMap[dayName].checkinCount++;
      } else if (item.tipo === "checkout") {
        weeklyMap[dayName].checkout += item.emocao;
        weeklyMap[dayName].checkoutCount++;
      }
    });
    const weeklyChartData: WeeklyDataItem[] = DIAS_SEMANA.map((dia) => ({
      name: dia,
      "Check-in": weeklyMap[dia].checkinCount > 0 
        ? Math.round(weeklyMap[dia].checkin / weeklyMap[dia].checkinCount) 
        : 0,
      "Check-out": weeklyMap[dia].checkoutCount > 0 
        ? Math.round(weeklyMap[dia].checkout / weeklyMap[dia].checkoutCount) 
        : 0,
    }));

    // Dados para o gráfico de emoções
    const emotionCounts: Record<string, number> = {};
    let otherEmotionCount = 0;
    apiData.forEach((item) => {
      const emotion = getEmotionByValue(item.emocao);

      if (!emotion) {
        otherEmotionCount++;
        return;
      }

      emotionCounts[emotion.id] = (emotionCounts[emotion.id] || 0) + 1;
    });

    const emotionChartData: EmotionDataItem[] = EMOTIONS.map((emotion, index) => ({
      id: emotion.id,
      name: emotion.label,
      value: emotionCounts[emotion.id] || 0,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    if (otherEmotionCount > 0) {
      emotionChartData.push({
        id: "outro",
        name: "Outro",
        value: otherEmotionCount,
        fill: SYSTEM_COLORS.primaryDarkHex,
      });
    }

    // Calcular resumo (melhor, igual, pior)
    let melhor = 0, igual = 0, pior = 0;
    const alunoData: Record<string | number, { checkin?: number; checkout?: number }> = {};
    apiData.forEach((item) => {
      const alunoId = item.alunoId || item.id;
      if (!alunoData[alunoId]) alunoData[alunoId] = {};
      if (item.tipo === "checkin") alunoData[alunoId].checkin = item.emocao;
      if (item.tipo === "checkout") alunoData[alunoId].checkout = item.emocao;
    });
    Object.values(alunoData).forEach((aluno) => {
      if (aluno.checkin !== undefined && aluno.checkout !== undefined) {
        if (aluno.checkout > aluno.checkin) melhor++;
        else if (aluno.checkout === aluno.checkin) igual++;
        else pior++;
      }
    });
    const total = melhor + igual + pior || 1;
    const summaryResult: SummaryData = {
      melhor: Math.round((melhor / total) * 100),
      igual: Math.round((igual / total) * 100),
      pior: Math.round((pior / total) * 100),
    };

    return {
      weeklyChartData,
      emotionChartData,
      summaryData: summaryResult,
      totalAvaliacoes: apiData.length,
      emocaoMediaAntes: a.avg,
      emocaoMediaDepois: d.avg,
      variacao: d.avg - a.avg,
    };
  };

  // ---------------- Fetch ----------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await fetch(buildApiUrl("/avaliacao/dashboard"), {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("Falha ao buscar dados do dashboard");
      const data = await resp.json();
      setRawData(data);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível carregar os dados.", { duration: 10000 });
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmas = async () => {
    try {
      const resp = await fetch(buildApiUrl("/avaliacao/turmas"), {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("Falha ao buscar turmas");
      const data = await resp.json();
      setTurmas(data);
    } catch (e) {
      toast.error("Não foi possível carregar a lista de turmas.", { duration: 3000 });
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTurmas();
  }, []);

  // ---------------- Filtros ----------------
  useEffect(() => {
    if (!rawData.length) return;

    let data: ProcessedItem[] = rawData.map((item) => ({
      ...item,
      tipo: String(item.tipo || "").toLowerCase(),
      emocao: Number(item.emocao) || 0,
      data: item.data ? parseApiDate(item.data) : null,
    }));

    // Filtro tipo
    if (tipoFiltro !== "todos") {
      data = data.filter((d) => d.tipo === tipoFiltro);
    }

    // Filtro de turma
    if (turmaFiltro !== "todas") {
      data = data.filter((d) => 
        d.turma?.trim().toLowerCase() === turmaFiltro.trim().toLowerCase()
      );
    }

    // Filtro datas
    if (dataInicio) {
      const startDate = parseInputDate(dataInicio);
      if (startDate) {
        data = data.filter((d) => d.data && d.data >= startDate);
      }
    }
    if (dataFim) {
      const endDate = parseInputDate(dataFim, true);
      if (endDate) {
        data = data.filter((d) => d.data && d.data <= endDate);
      }
    }

    const processed = processApiData(data);
    setWeeklyData(processed.weeklyChartData);
    setEmotionData(processed.emotionChartData);
    setSummaryData(processed.summaryData);
    setMetrics({
      totalAvaliacoes: processed.totalAvaliacoes,
      emocaoMediaAntes: processed.emocaoMediaAntes,
      emocaoMediaDepois: processed.emocaoMediaDepois,
      variacao: processed.variacao,
    });
  }, [rawData, tipoFiltro, turmaFiltro, dataInicio, dataFim]);

  // ---------------- Export Functions ----------------
  const exportToPDF = async () => {
    toast.loading("Gerando PDF...", { id: "pdf-export" });

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let y = 14;
      const marginX = 14;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - marginX * 2;

      const applyText = (
        size: number,
        color: RgbColor = SYSTEM_COLORS.text,
        style: "normal" | "bold" = "normal"
      ) => {
        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
      };

      const drawFooter = () => {
        applyText(8, SYSTEM_COLORS.muted);
        pdf.text(`VibeCheck - ${formatDateLabel(new Date())}`, marginX, pageHeight - 8);
      };

      const ensureSpace = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 18) {
          drawFooter();
          pdf.addPage();
          y = 16;
        }
      };

      const drawHeader = () => {
        pdf.setFillColor(...SYSTEM_COLORS.primary);
        pdf.roundedRect(marginX, y, contentWidth, 28, 3, 3, "F");
        applyText(18, SYSTEM_COLORS.white, "bold");
        pdf.text("Dashboard VibeCheck", marginX + 6, y + 11);
        applyText(10, SYSTEM_COLORS.primarySoft);
        pdf.text(`Gerado em ${formatDateLabel(new Date())}`, marginX + 6, y + 20);
        y += 38;
      };

      const writeSectionTitle = (title: string) => {
        ensureSpace(12);
        applyText(13, SYSTEM_COLORS.primary, "bold");
        pdf.text(title, marginX, y);
        y += 7;
      };

      const drawMetricCards = () => {
        const cardGap = 4;
        const cardWidth = (contentWidth - cardGap) / 2;
        const cardHeight = 19;
        const cards = [
          { label: "Avaliações", value: String(metrics.totalAvaliacoes ?? 0), color: SYSTEM_COLORS.primary },
          { label: "Média check-in", value: (metrics.emocaoMediaAntes ?? 0).toFixed(2), color: SYSTEM_COLORS.primary },
          { label: "Média check-out", value: (metrics.emocaoMediaDepois ?? 0).toFixed(2), color: SYSTEM_COLORS.primary },
          { label: "Variação", value: (metrics.variacao ?? 0).toFixed(2), color: SYSTEM_COLORS.primary },
          { label: "Melhor", value: `${summaryData.melhor}%`, color: SYSTEM_COLORS.success },
          { label: "Igual", value: `${summaryData.igual}%`, color: SYSTEM_COLORS.warning },
          { label: "Pior", value: `${summaryData.pior}%`, color: SYSTEM_COLORS.danger },
        ];

        cards.forEach((card, index) => {
          if (index % 2 === 0) ensureSpace(cardHeight + 4);
          const column = index % 2;
          const x = marginX + column * (cardWidth + cardGap);

          pdf.setFillColor(...SYSTEM_COLORS.surface);
          pdf.setDrawColor(...SYSTEM_COLORS.border);
          pdf.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "FD");
          applyText(9, SYSTEM_COLORS.muted, "bold");
          pdf.text(card.label, x + 4, y + 7);
          applyText(15, card.color, "bold");
          pdf.text(card.value, x + 4, y + 15);

          if (column === 1 || index === cards.length - 1) y += cardHeight + 4;
        });
      };

      const drawTable = (title: string, headers: string[], rows: string[][]) => {
        const rowHeight = 8;
        const columnWidth = contentWidth / headers.length;

        writeSectionTitle(title);
        ensureSpace(rowHeight * 2);

        pdf.setFillColor(...SYSTEM_COLORS.primaryDark);
        pdf.rect(marginX, y, contentWidth, rowHeight, "F");
        applyText(9, SYSTEM_COLORS.white, "bold");
        headers.forEach((header, index) => {
          pdf.text(header, marginX + index * columnWidth + 3, y + 5.3);
        });
        y += rowHeight;

        const tableRows = rows.length ? rows : [["Nenhum dado disponível"]];
        tableRows.forEach((row, rowIndex) => {
          ensureSpace(rowHeight);
          if (rowIndex % 2 === 0) {
            pdf.setFillColor(...SYSTEM_COLORS.surface);
            pdf.rect(marginX, y, contentWidth, rowHeight, "F");
          }

          pdf.setDrawColor(...SYSTEM_COLORS.border);
          pdf.line(marginX, y + rowHeight, marginX + contentWidth, y + rowHeight);
          applyText(9, SYSTEM_COLORS.text);
          row.forEach((cell, index) => {
            const text = pdf.splitTextToSize(cell, columnWidth - 6)[0] || "";
            pdf.text(text, marginX + index * columnWidth + 3, y + 5.3);
          });
          y += rowHeight;
        });

        y += 4;
      };

      drawHeader();
      drawTable("Filtros aplicados", ["Filtro", "Valor"], [
        ["Período", formatDateRange()],
        ["Tipo", tipoFiltro === "todos" ? "Todos" : tipoFiltro],
        ["Turma", turmaFiltro === "todas" ? "Todas as turmas" : turmaFiltro],
      ]);

      writeSectionTitle("Resumo");
      drawMetricCards();

      drawTable(
        "Check-in x Check-out por dia",
        ["Dia", "Check-in", "Check-out"],
        weeklyData.map((item) => [
          item.name,
          String(item["Check-in"]),
          String(item["Check-out"]),
        ])
      );

      drawTable(
        "Distribuição das emoções",
        ["Emoção", "Registros"],
        emotionData.map((item) => [item.name, String(item.value)])
      );

      drawFooter();

      pdf.save(`dashboard-vibecheck-${getFileDateStamp()}.pdf`);
      
      toast.success("PDF exportado com sucesso!", { id: "pdf-export" });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF", { id: "pdf-export" });
    }
  };

  const exportToExcel = () => {
    toast.loading("Gerando Excel...", { id: "excel-export" });
    
    try {
      const metadata: Array<[string, string]> = [
        ["Gerado em", formatDateLabel(new Date())],
        ["Período", formatDateRange()],
        ["Tipo", tipoFiltro === "todos" ? "Todos" : tipoFiltro],
        ["Turma", turmaFiltro === "todas" ? "Todas as turmas" : turmaFiltro],
      ];
      const workbook = buildExcelWorkbook([
        {
          name: "Resumo",
          title: "Resumo do Dashboard",
          metadata,
          headers: ["Métrica", "Valor"],
          rows: [
            ["Total de Avaliações", metrics.totalAvaliacoes ?? 0],
            ["Média check-in", (metrics.emocaoMediaAntes ?? 0).toFixed(2)],
            ["Média check-out", (metrics.emocaoMediaDepois ?? 0).toFixed(2)],
            ["Variação", (metrics.variacao ?? 0).toFixed(2)],
            ["Melhor", `${summaryData.melhor}%`],
            ["Igual", `${summaryData.igual}%`],
            ["Pior", `${summaryData.pior}%`],
          ],
          columnWidths: [180, 120],
        },
        {
          name: "Dados Semanais",
          title: "Check-in x Check-out por dia",
          metadata,
          headers: ["Dia da Semana", "Check-in (Média)", "Check-out (Média)"],
          rows: weeklyData.map((item) => [
            item.name,
            item["Check-in"],
            item["Check-out"],
          ]),
          columnWidths: [130, 130, 140],
        },
        {
          name: "Distribuição Emoções",
          title: "Distribuição das Emoções",
          metadata,
          headers: ["Emoção", "Quantidade"],
          rows: emotionData.map((item) => [item.name, item.value]),
          columnWidths: [180, 120],
        },
      ]);

      downloadTextFile(
        `dashboard-vibecheck-${getFileDateStamp()}.xls`,
        workbook,
        "application/vnd.ms-excel;charset=utf-8"
      );
      
      toast.success("Excel exportado com sucesso!", { id: "excel-export" });
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      toast.error("Erro ao exportar Excel", { id: "excel-export" });
    }
  };

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    try {
      const response = await fetch(buildApiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Format date for display
  const formatDateRange = () => {
    const startDate = parseInputDate(dataInicio);
    const endDate = parseInputDate(dataFim);

    if (dataInicio && dataFim) {
      const start = startDate ? formatDateLabel(startDate) : dataInicio;
      const end = endDate ? formatDateLabel(endDate) : dataFim;
      return `${start} - ${end}`;
    }
    if (dataInicio) {
      return `A partir de ${startDate ? formatDateLabel(startDate) : dataInicio}`;
    }
    if (dataFim) {
      return `Até ${endDate ? formatDateLabel(endDate) : dataFim}`;
    }
    return "Período";
  };

  const syncCalendarMonth = () => {
    const baseDate = parseInputDate(dataInicio) ?? new Date();
    setCalendarMonth(normalizeMonth(baseDate));
  };

  const handleCalendarOpenChange = (open: boolean) => {
    setShowDatePicker(open);
    if (open) {
      syncCalendarMonth();
    }
  };

  const handleCalendarDateClick = (date: Date) => {
    const startDate = selectedDateRange?.from;
    const endDate = selectedDateRange?.to;
    const normalizedValue = formatDateForInput(date);

    if (!startDate || (startDate && endDate)) {
      setDataInicio(normalizedValue);
      setDataFim("");
      return;
    }

    if (isBeforeDay(date, startDate)) {
      setDataInicio(normalizedValue);
      setDataFim(formatDateForInput(startDate));
      return;
    }

    setDataFim(normalizedValue);
  };

  const handlePresetRange = (days: number) => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    setDataInicio(formatDateForInput(start));
    setDataFim(formatDateForInput(end));
  };

  const clearDateRange = () => {
    setDataInicio("");
    setDataFim("");
  };

  const hasEmotionData = emotionData.some((item) => item.value > 0);
  const emotionChartWidth = Math.max(760, emotionData.length * 92);

  // ---------------- Render ----------------
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Navbar Mobile */}
      <header className="flex md:hidden w-full items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-x2 font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>
        <button 
          onClick={handleLogout}
          className="text-x2 font-medium text-[#783E98] hover:underline"
        >
          Sair
        </button>
      </header>

      {/* Navbar Desktop */}
      <header className="hidden md:flex w-full items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold font-montserrat text-[#783E98]">
          VibeCheck
        </h1>
        <nav className="flex items-center gap-4">
          <a
            className="cursor-pointer bg-transparent font-montserrat font-semibold text-[#783E98] hover:underline"
            onClick={() => navigate("/checkin")}
          >
            Liberar Check-in
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

      {/* Conteúdo */}
      <main className="flex flex-1 w-full flex-col px-4 py-6 md:px-8 md:py-10 pb-20 md:pb-10">
        <div className="flex flex-col w-full bg-white rounded-2xl shadow-sm p-4 md:p-8">
          <h1 className="text-xl md:text-4xl font-bold text-[#783E98] mb-4 md:mb-6 text-center">
            Dashboard Geral
          </h1>

          {/* Calendar Overlay - Mobile */}
          {showDatePicker && (
            <div
              className="fixed inset-0 z-[200] md:hidden bg-black/40 flex flex-col justify-end"
              onClick={() => setShowDatePicker(false)}
            >
              <div
                className="bg-white rounded-t-2xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm">Selecionar Período</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    onClick={() => setShowDatePicker(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setCalendarMonth((current) => addMonths(current, -1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold capitalize text-gray-800">
                    {MONTH_LABEL_FORMATTER.format(calendarMonth)}
                  </span>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setCalendarMonth((current) => addMonths(current, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <CalendarMonthView
                  month={calendarMonth}
                  rangeStart={selectedDateRange?.from}
                  rangeEnd={selectedDateRange?.to}
                  onSelectDate={handleCalendarDateClick}
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    className="text-xs py-2 px-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => handlePresetRange(1)}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    className="text-xs py-2 px-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => handlePresetRange(7)}
                  >
                    7 dias
                  </button>
                  <button
                    type="button"
                    className="text-xs py-2 px-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={clearDateRange}
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    className="text-xs py-2 px-2 bg-[#783E98] text-white rounded-md hover:bg-[#5e3178]"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filtros Mobile */}
          <div className="flex gap-2 mb-4 md:hidden">
            {/* Período */}
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#783E98] rounded-lg px-3 py-2 text-sm font-medium text-[#783E98]"
              onClick={() => handleCalendarOpenChange(true)}
            >
              <Calendar className="w-4 h-4" />
              {dataInicio || dataFim ? formatDateRange() : "Período"}
            </button>

            {/* Filtros */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-600">
                  Filtros
                  <ChevronDown className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Tipo</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={tipoFiltro}
                      onChange={(e) => setTipoFiltro(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="checkin">Check-in</option>
                      <option value="checkout">Check-out</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Turma</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={turmaFiltro}
                      onChange={(e) => setTurmaFiltro(e.target.value)}
                    >
                      <option value="todas">Todas as turmas</option>
                      {turmas.map((t) => (
                        <option key={t.id} value={t.nome}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="w-full text-xs py-2 px-2 bg-[#783E98] text-white rounded-md hover:bg-[#5e3178]"
                    onClick={() => setShowFilters(false)}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Filtros Desktop */}
          <div className="hidden md:flex flex-wrap gap-4 mb-6 justify-center items-center">
            <Popover open={showDatePicker} onOpenChange={handleCalendarOpenChange}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 bg-white border border-[#783E98] rounded-lg px-4 py-2 text-sm font-medium text-[#783E98] hover:bg-purple-50">
                  <Calendar className="w-4 h-4" />
                  {dataInicio || dataFim ? formatDateRange() : "Período"}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[720px] max-w-[calc(100vw-3rem)] p-5 bg-white border border-gray-200 shadow-lg rounded-lg">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Selecionar Período</h4>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setCalendarMonth((current) => addMonths(current, -1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-500">
                      Escolha a data inicial e depois a final
                    </span>
                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setCalendarMonth((current) => addMonths(current, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CalendarMonthView
                      month={calendarMonth}
                      rangeStart={selectedDateRange?.from}
                      rangeEnd={selectedDateRange?.to}
                      onSelectDate={handleCalendarDateClick}
                    />
                    <CalendarMonthView
                      month={addMonths(calendarMonth, 1)}
                      rangeStart={selectedDateRange?.from}
                      rangeEnd={selectedDateRange?.to}
                      onSelectDate={handleCalendarDateClick}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button"
                      className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                      onClick={() => handlePresetRange(1)}
                    >
                      Hoje
                    </button>
                    <button 
                      type="button"
                      className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                      onClick={() => handlePresetRange(7)}
                    >
                      7 dias
                    </button>
                    <button 
                      type="button"
                      className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                      onClick={() => handlePresetRange(30)}
                    >
                      30 dias
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className="flex-1 py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
                      onClick={clearDateRange}
                    >
                      Limpar
                    </button>
                    <button 
                      type="button"
                      className="flex-1 py-2 px-3 bg-[#783E98] text-white rounded-md hover:bg-[#5e3178] text-sm"
                      onClick={() => setShowDatePicker(false)}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option value="todos">Todos os Tipos</option>
              <option value="checkin">Check-in</option>
              <option value="checkout">Check-out</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
              value={turmaFiltro}
              onChange={(e) => setTurmaFiltro(e.target.value)}
            >
              <option value="todas">Todas as turmas</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.nome}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Gráfico de Barras */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Check-in x Check-out</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-3">Pontuações emocionais médias ao longo da semana</p>
              <div className="w-full h-[200px] md:h-[280px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Loader className="animate-spin w-5 h-5 mr-2" /> Carregando...
                  </div>
                ) : error ? (
                  <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">{error}</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        domain={[0, 10]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="Check-in" fill={SYSTEM_COLORS.primaryHex} radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Check-out" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SYSTEM_COLORS.primaryHex }}></div>
                  <span className="text-xs text-gray-600">Check-in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]"></div>
                  <span className="text-xs text-gray-600">Check-out</span>
                </div>
              </div>
            </div>

            {/* Gráfico de colunas por emoção */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1">Distribuição das emoções dos estudantes</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-3">Quantidade de registros por emoção no período selecionado</p>
              <div className="w-full h-[300px] overflow-x-auto overflow-y-hidden pb-2 md:h-[320px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Loader className="animate-spin w-5 h-5 mr-2" /> Carregando...
                  </div>
                ) : error ? (
                  <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">{error}</div>
                ) : !hasEmotionData ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    Nenhum registro emocional no período selecionado.
                  </div>
                ) : (
                  <div className="h-full" style={{ width: emotionChartWidth }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emotionData} margin={{ top: 10, right: 18, left: -8, bottom: 12 }} barCategoryGap="24%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0ECF4" />
                        <XAxis
                          dataKey="name"
                          interval={0}
                          angle={-24}
                          textAnchor="end"
                          height={72}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#6B7280", fontSize: 10 }}
                          tickMargin={12}
                        />
                        <YAxis
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#6B7280", fontSize: 10 }}
                          width={32}
                        />
                        <Tooltip
                          formatter={(value) => [`${value} registros`, "Registros"]}
                          labelFormatter={(label) => `Emoção: ${label}`}
                          contentStyle={{
                            borderRadius: "8px",
                            border: `1px solid ${SYSTEM_COLORS.borderHex}`,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="value" name="Registros" radius={[6, 6, 0, 0]} maxBarSize={42}>
                          {emotionData.map((entry) => (
                            <Cell key={`emotion-${entry.id}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {emotionData.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-md bg-gray-50 px-2 py-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.fill }} />
                    <span className="min-w-0 flex-1 truncate text-xs text-gray-600">{item.name}</span>
                    <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm mb-6">
            <h3 className="text-center text-sm md:text-base text-gray-600 mb-4 md:mb-6">Com base na semana anterior:</h3>
            <div className="flex justify-center items-center gap-6 md:gap-16">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <img src="/1.svg" alt="Melhor" className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <span className="text-xl md:text-3xl font-bold text-green-500">{summaryData.melhor}%</span>
                <span className="text-xs md:text-sm text-gray-500">Melhor</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <img src="/4.svg" alt="Igual" className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <span className="text-xl md:text-3xl font-bold text-yellow-500">{summaryData.igual}%</span>
                <span className="text-xs md:text-sm text-gray-500">Igual</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <img src="/6.svg" alt="Pior" className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <span className="text-xl md:text-3xl font-bold text-red-500">{summaryData.pior}%</span>
                <span className="text-xs md:text-sm text-gray-500">Pior</span>
              </div>
            </div>
          </div>

          {/* Botões de Exportação */}
          <div className="flex flex-col md:flex-row md:justify-center gap-3">
            <button 
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 md:py-2 rounded-lg shadow-sm w-full md:w-auto md:min-w-[170px] text-sm font-medium"
              onClick={exportToPDF}
            >
              <FileText className="w-4 h-4" />
              Exportar PDF
            </button>
            <button 
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 md:py-2 rounded-lg shadow-sm w-full md:w-auto md:min-w-[170px] text-sm font-medium"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Excel
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50">
        <button 
          className="flex flex-col items-center gap-1 text-[#783E98]"
          onClick={() => navigate("/dashboard")}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-gray-500"
          onClick={() => navigate("/checkin")}
        >
          <LogIn className="w-5 h-5" />
          <span className="text-xs">Check-in</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-gray-500"
          onClick={() => navigate("/checkout")}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Check-out</span>
        </button>
      </nav>
    </div>
  );
}
