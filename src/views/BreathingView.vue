<script setup>
// Respiração 4-7-8: inspire 4s, segure 7s, expire 8s.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const FASES = [{ nome: 'Inspire', seg: 4, escala: 1 }, { nome: 'Segure', seg: 7, escala: 1 }, { nome: 'Expire', seg: 8, escala: 0.55 }]
const on = ref(false), idx = ref(0), restante = ref(0), ciclos = ref(0)
let timer = null, trava = null
const fase = computed(() => (on.value ? FASES[idx.value] : null))
// o círculo cresce ao inspirar, fica parado ao segurar e encolhe ao expirar
const orbe = computed(() => ({
  transitionDuration: (fase.value ? (fase.value.nome === 'Segure' ? 0 : fase.value.seg) : 1) + 's',
  transform: `scale(${fase.value ? fase.value.escala : 0.55})`
}))
function comecarFase() { restante.value = FASES[idx.value].seg; navigator.vibrate?.(40) }
function tick() {
  if (--restante.value > 0) return
  if (++idx.value >= FASES.length) { idx.value = 0; ciclos.value++ }
  comecarFase()
}
async function iniciar() {
  on.value = true; idx.value = 0; ciclos.value = 0
  try { trava = await navigator.wakeLock?.request('screen') } catch {}
  comecarFase(); timer = setInterval(tick, 1000)
}
function parar() {
  if (!on.value) return
  on.value = false; clearInterval(timer); trava?.release?.(); trava = null
}
const visib = () => document.hidden && parar()
onMounted(() => document.addEventListener('visibilitychange', visib))
onBeforeUnmount(() => { parar(); document.removeEventListener('visibilitychange', visib) })
</script>

<template>
  <section>
    <p class="sub">Técnica 4-7-8: inspire pelo nariz por 4 segundos, segure por 7 e solte o ar pela boca por 8.</p>
    <div class="resp">
      <div class="orbe" :style="orbe" />
      <div class="txt"><div class="fase">{{ fase ? fase.nome : 'Pronto' }}</div><div class="seg">{{ on ? restante : '' }}</div></div>
    </div>
    <div class="info">Ciclos: {{ ciclos }}</div>
    <button class="btn" :class="{ sec: on }" @click="on ? parar() : iniciar()">{{ on ? 'Parar' : 'Iniciar' }}</button>
    <p class="hint">Se sentir tontura, pare e volte a respirar normalmente.</p>
  </section>
</template>

<style scoped>
.resp{position:relative;display:flex;justify-content:center;align-items:center;height:300px;margin:8px 0 4px}
.orbe{width:230px;height:230px;border-radius:50%;background:var(--accent);transition:transform 1s ease-in-out;box-shadow:0 0 0 14px color-mix(in srgb,var(--accent) 18%,transparent),0 0 44px color-mix(in srgb,var(--accent) 40%,transparent)}
.txt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;pointer-events:none}
.fase{font-size:22px;font-weight:700}
.seg{font-size:42px;font-weight:700;line-height:1.1;min-height:46px}
.info{text-align:center;color:var(--muted);margin-bottom:18px}
</style>
