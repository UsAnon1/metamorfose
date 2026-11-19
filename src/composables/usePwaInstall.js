import { ref, computed } from 'vue'
// Estado único da instalação do app. Os ouvintes ficam no nível do módulo para
// não perder o `beforeinstallprompt`, que o Chrome pode disparar antes da tela montar.
const pedido = ref(null)            // evento guardado (Android/Desktop)
const instalado = ref(false)
const guiaAberto = ref(false)       // janela com o passo a passo (iPhone/iPad)

const ua = navigator.userAgent
const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPadOS finge ser Mac
const iphone = /iphone|ipod/i.test(ua)
const emApp = /instagram|fban|fbav|tiktok|musical_ly|line\//i.test(ua) // navegadores embutidos não permitem instalar

instalado.value = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); pedido.value = e })
addEventListener('appinstalled', () => { instalado.value = true; pedido.value = null; guiaAberto.value = false })

export function usePwaInstall() {
  const pode = computed(() => !instalado.value && (!!pedido.value || ios))
  async function instalar() {
    if (pedido.value) {                       // Android/Desktop: abre o diálogo nativo
      const p = pedido.value
      p.prompt()
      const { outcome } = await p.userChoice
      pedido.value = null                     // o evento só vale uma vez
      if (outcome === 'accepted') instalado.value = true
    } else if (ios) guiaAberto.value = true   // iOS: a Apple não permite instalar por código
  }
  return { pode, instalar, guiaAberto, ios, iphone, emApp }
}
