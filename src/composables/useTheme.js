import { ref, watchEffect } from 'vue'
// Tema claro/escuro persistido (já aplicado no <html> pelo script do index.html)
const tema = ref(document.documentElement.dataset.tema || 'claro')
watchEffect(() => {
  document.documentElement.dataset.tema = tema.value
  document.getElementById('metaTema')?.setAttribute('content', tema.value === 'escuro' ? '#17161c' : '#f4f1ec')
  try { localStorage.setItem('reflexo_tema', tema.value) } catch {}
})
export function useTheme() {
  const alternar = () => { tema.value = tema.value === 'escuro' ? 'claro' : 'escuro' }
  return { tema, alternar }
}
