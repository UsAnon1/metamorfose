<script setup>
// Convite discreto para instalar o app (só na tela inicial).
// Android/Desktop: captura o `beforeinstallprompt`. iPhone/iPad (Safari): mostra o passo a passo.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const BASE = import.meta.env.BASE_URL
const CHAVE = 'pwa_banner_fechado', DIAS = 14
const route = useRoute()
const pedido = ref(null)       // evento guardado para chamar .prompt() depois
const fechado = ref(false), instalado = ref(false), ios = ref(false)

const jaInstalado = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
const eIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPadOS se apresenta como Mac

const visivel = computed(() =>
  route.path === '/' && !fechado.value && !instalado.value && (!!pedido.value || ios.value))

function aoPoderInstalar(e) { e.preventDefault(); pedido.value = e } // esconde o mini-aviso padrão do Chrome
function aoInstalar() { instalado.value = true; pedido.value = null }

async function instalar() {
  if (!pedido.value) return
  pedido.value.prompt()
  const { outcome } = await pedido.value.userChoice
  pedido.value = null // o evento só pode ser usado uma vez
  if (outcome === 'accepted') instalado.value = true
}
function dispensar() { // não incomoda de novo por 14 dias
  fechado.value = true
  try { localStorage.setItem(CHAVE, String(Date.now())) } catch {}
}

onMounted(() => {
  try {
    const t = +localStorage.getItem(CHAVE)
    if (t && Date.now() - t < DIAS * 864e5) fechado.value = true
  } catch {}
  if (jaInstalado()) { instalado.value = true; return }
  ios.value = eIOS()
  addEventListener('beforeinstallprompt', aoPoderInstalar)
  addEventListener('appinstalled', aoInstalar)
})
onBeforeUnmount(() => {
  removeEventListener('beforeinstallprompt', aoPoderInstalar)
  removeEventListener('appinstalled', aoInstalar)
})
</script>

<template>
  <Transition name="banner">
    <aside v-if="visivel" class="banner" role="region" aria-label="Instalar aplicativo">
      <img :src="BASE + 'icone-192.png'" alt="" class="ico" width="44" height="44">
      <div class="corpo">
        <strong>Tenha seus cartões sempre à mão</strong>
        <template v-if="pedido">
          <span>Instale o app na tela inicial e use até sem internet.</span>
          <button class="inst" @click="instalar">Instalar aplicativo</button>
        </template>
        <span v-else>
          No Safari, toque em <b>Compartilhar</b>
          <svg class="share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>
          e depois em <b>Adicionar à Tela de Início</b>.
        </span>
      </div>
      <button class="x" aria-label="Agora não" @click="dispensar">×</button>
    </aside>
  </Transition>
</template>

<style scoped>
.banner{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(408px,calc(100% - 24px));z-index:5;display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:18px;background:var(--surface);color:var(--fg);border:1px solid var(--line);box-shadow:0 10px 30px rgba(0,0,0,.18)}
.ico{border-radius:10px;flex:none}
.corpo{flex:1;display:flex;flex-direction:column;gap:4px;font-size:13px;line-height:1.4;color:var(--muted)}
.corpo strong{color:var(--fg);font-size:14px}
.share{width:15px;height:15px;vertical-align:-2px;color:var(--accent)}
.inst{align-self:flex-start;margin-top:6px;border:0;border-radius:10px;background:var(--accent);color:#fff;font-weight:600;font-size:14px;padding:9px 14px}
.x{flex:none;border:0;background:none;color:var(--muted);font-size:24px;line-height:1;padding:0 4px}
.banner-enter-active,.banner-leave-active{transition:opacity .3s ease,transform .3s ease}
.banner-enter-from,.banner-leave-to{opacity:0;transform:translate(-50%,24px)}
</style>
