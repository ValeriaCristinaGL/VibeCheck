export interface EmotionOption {
  id: string;
  value: number;
  label: string;
  src: string;
}

export const EMOTIONS: EmotionOption[] = [
  { id: "8", value: 8, label: "Muito Feliz", src: "/1.svg" },
  { id: "7", value: 7, label: "Feliz", src: "/2.svg" },
  { id: "4", value: 4, label: "Desmotivado", src: "/3.svg" },
  { id: "5", value: 5, label: "Indiferente", src: "/4.svg" },
  { id: "6", value: 6, label: "Surpreso", src: "/5.svg" },
  { id: "2", value: 2, label: "Triste", src: "/6.svg" },
  { id: "1", value: 1, label: "Irritado", src: "/7.svg" },
  { id: "3", value: 3, label: "Ansioso", src: "/8.svg" },
  { id: "9", value: 9, label: "Apaixonado", src: "/9.svg" },
];

export const getEmotionByValue = (value: number | string): EmotionOption | undefined =>
  EMOTIONS.find((emotion) => emotion.value === Number(value));
