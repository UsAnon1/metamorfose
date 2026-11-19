// Equivalente ao biblioteca.js original. Ajuste QTD / EXTENSAO / PADRAO.
export const QTD = 31          // quantas imagens existem em public/cartoes
export const EXTENSAO = 'png'  // formato (todas iguais)
export const PADRAO = [1, 2, 3, 4, 5, 6, 7, 8] // cartões que aparecem na 1ª vez

export const BIBLIOTECA = Array.from({ length: QTD }, (_, i) => ({
  arquivo: `cartoes/${i + 1}.${EXTENSAO}`, titulo: ''
}))
// Cartões de texto prontos (opcional):
// BIBLIOTECA.push({ texto: 'Isso vai passar.', bg: '#6c5ce7', cor: '#ffffff', fonte: 'Georgia, serif' })
