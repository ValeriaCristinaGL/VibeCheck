import React from "react";

// Componente Skeleton para exibir um placeholder animado enquanto o conteúdo carrega
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      // Animação de "pulse" para dar efeito de carregamento
      // Fundo cinza escuro, bordas arredondadas, e recebe classes adicionais via props
      className={`animate-pulse bg-gray-700 rounded ${className ?? ""}`}
      // Define um tamanho mínimo para o componente, garantindo visibilidade mesmo sem conteúdo
      style={{ minHeight: 8, minWidth: 8 }}
    />
  );
}
