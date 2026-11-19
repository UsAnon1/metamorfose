<script setup>
// Pilha de cartões com swipe e loop. Esquerda = próximo, direita = anterior.
// A animação é dirigida por estado (dx, anim); a fila só gira ao fim da animação.
import { ref, computed } from 'vue'
import CardItem from './CardItem.vue'
const props = defineProps({ cards: { type: Array, required: true } })
const emit = defineEmits(['next', 'prev'])

const dx = ref(0), dragging = ref(false), anim = ref(null), epoch = ref(0)
let startX = 0
const visiveis = computed(() => props.cards.slice(0, 3))
const anterior = computed(() => (props.cards.length > 1 ? props.cards[props.cards.length - 1] : null))
// p = progresso de "avançar" (0..1), q = progresso de "voltar" (0..1)
const p = computed(() => (anim.value === 'next' ? 1 : dx.value < 0 ? Math.min(-dx.value / 150, 1) : 0))
const q = computed(() => (anim.value === 'prev' ? 1 : dx.value > 0 && anterior.value ? Math.min(dx.value / 200, 1) : 0))

function estilo(pos) {
  if (pos === 0) {
    if (anim.value === 'next') return { transform: 'translateX(-600px) rotate(-25deg)', opacity: 0 }
    if (dx.value < 0) return { transform: `translateX(${dx.value}px) rotate(${dx.value / 18}deg)` }
    if (dx.value > 0 && !anterior.value) return { transform: `translateX(${dx.value * 0.2}px)` } // só 1 cartão: resistência
    return { transform: `translateY(${14 * q.value}px) scale(${1 - 0.05 * q.value})` }
  }
  if (pos === 1) return { transform: `translateY(${14 - 14 * p.value + 14 * q.value}px) scale(${0.95 + 0.05 * p.value - 0.05 * q.value})` }
  return { transform: `translateY(${28 - 14 * p.value}px) scale(${0.9 + 0.05 * p.value})` }
}
const estiloAnterior = computed(() => ({
  transform: `translateX(${-130 * (1 - q.value)}%) rotate(${-12 * (1 - q.value)}deg)`
}))

function terminar(evento) { // espera a animação CSS (.35s) e só então gira a fila
  setTimeout(() => { emit(evento); anim.value = null; dx.value = 0; epoch.value++ }, 340)
}
function next() { if (anim.value || !props.cards.length) return; anim.value = 'next'; terminar('next') }
function prev() { if (anim.value || !anterior.value) return; anim.value = 'prev'; terminar('prev') }
defineExpose({ next, prev })

function down(e) { if (anim.value) return; dragging.value = true; startX = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }
function move(e) { if (dragging.value) dx.value = e.clientX - startX }
function up() {
  if (!dragging.value) return
  dragging.value = false
  if (dx.value < -90) next()
  else if (dx.value > 90 && anterior.value) prev()
  else dx.value = 0 // não passou do limite: volta ao lugar
}
</script>

<template>
  <div class="palco">
    <div class="stack">
      <p v-if="!cards.length" class="empty">Nenhum cartão ainda. Escolha cartões na Biblioteca ou toque em + para criar o seu.</p>
      <template v-else>
        <CardItem v-for="(c, pos) in visiveis" :key="`${epoch}-${c.id}`" :card="c" class="c"
          :class="{ drag: dragging }" :style="{ ...estilo(pos), zIndex: 10 - pos }"
          @pointerdown="pos === 0 && down($event)" @pointermove="move" @pointerup="up" @pointercancel="up" />
        <!-- cartão anterior espera fora da tela, à esquerda -->
        <CardItem v-if="anterior" :key="`${epoch}-p-${anterior.id}`" :card="anterior" class="c prev"
          :class="{ drag: dragging }" :style="estiloAnterior" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.palco{width:100%;overflow:hidden;padding:16px 0 44px;display:flex;justify-content:center;touch-action:pan-y}
.stack{position:relative;flex:none;width:320px;height:480px}
.c{position:absolute;inset:0;font-size:24px;touch-action:pan-y;cursor:grab;will-change:transform;box-shadow:0 10px 30px rgba(0,0,0,.18);transition:transform .35s ease,opacity .35s ease}
.c.drag{transition:none;cursor:grabbing}
.prev{z-index:30;pointer-events:none}
.empty{margin:30% 10px 0}
@media (max-width:359px){.stack{width:288px;height:432px}}
</style>
