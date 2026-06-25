export type Turma = {
  id: number;
  nome: string;
  isTemp?: boolean;
};

export const sortTurmas = (items: Turma[]): Turma[] =>
  [...items].sort((first, second) => first.nome.localeCompare(second.nome));

export const normalizeTurmas = (items: Turma[]): Turma[] =>
  sortTurmas(
    items
      .filter((item) => item.id !== 0 && item.nome.toLowerCase() !== "string")
      .map((item) => ({ ...item, isTemp: false }))
  );

export const getTemporaryTurmaId = (): number => -Date.now();

export const isSameTurmaName = (first: string, second: string): boolean =>
  first.trim().toLowerCase() === second.trim().toLowerCase();