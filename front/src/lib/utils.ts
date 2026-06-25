import { clsx, type ClassValue } from "clsx"      // Importa o 'clsx' e o tipo 'ClassValue'
import { twMerge } from "tailwind-merge"         // Importa a função 'twMerge' para mesclar classes Tailwind

// Função 'cn' para combinar e mesclar classes CSS de forma eficiente
export function cn(...inputs: ClassValue[]) {
  // 'clsx' combina as classes, filtrando valores falsos e normalizando strings
  // 'twMerge' faz o merge das classes Tailwind conflitantes, priorizando as últimas
  return twMerge(clsx(inputs))
}
