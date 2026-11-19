<script setup>
// "Meus cartões": deck com swipe + botões e atalhos de teclado.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SwipeDeck from '../components/SwipeDeck.vue'
import CardFormModal from '../components/CardFormModal.vue'
import { useCards } from '../composables/useCards'
const { fila, salvarTexto, importarImagem, avancar, voltar } = useCards()
const deck = ref(null), escolha = ref(false), form = ref(false), arq = ref(null)
const contador = computed(() => fila.value.length ? `${fila.value.length} ${fila.value.length === 1 ? 'cartão' : 'cartões'} em loop` : '')

const tecla = (e) => {
  if (escolha.value || form.value) return
  if (e.key === 'ArrowLeft') deck.value?.next()
  if (e.key === 'ArrowRight') deck.value?.prev()
}
onMounted(() => addEventListener('keydown', tecla))
onBeforeUnmount(() => removeEventListener('keydown', tecla))

function salvar(dados) { salvarTexto(dados); form.value = false }
async function aoEscolherImagem(e) {
  const f = e.target.files?.[0]; e.target.value = ''
  if (!f) return
  try { await importarImagem(f); escolha.value = false } catch (err) { alert(err.message) }
}
</script>

<template>
  <section>
    <SwipeDeck ref="deck" :cards="fila" @next="avancar" @prev="voltar" />
    <div class="counter">{{ contador }}</div>
    <div class="acoes">
      <button class="seta" aria-label="Cartão anterior" @click="deck?.prev()">‹</button>
      <button class="add" @click="escolha = true">+ Adicionar cartão</button>
      <button class="seta" aria-label="Próximo cartão" @click="deck?.next()">›</button>
    </div>
    <div class="hint">Arraste para a esquerda para avançar e para a direita para voltar</div>

    <Transition name="modal">
      <div v-if="escolha" class="modal" @click.self="escolha = false">
        <div class="sheet">
          <h2>Adicionar cartão</h2>
          <button class="btn" @click="escolha = false; form = true">✍️ Escrever nova frase</button>
          <label class="btn sec" for="arq">🖼️ Importar imagem</label>
          <input id="arq" ref="arq" class="sr" type="file" accept="image/*" @change="aoEscolherImagem">
        </div>
      </div>
    </Transition>
    <CardFormModal v-if="form" @save="salvar" @close="form = false" />
  </section>
</template>

<style scoped>
section{flex:1;display:flex;flex-direction:column;align-items:center}
.counter{color:var(--muted);font-size:13px;text-align:center}
.acoes{display:flex;align-items:center;gap:10px;width:320px;max-width:100%;margin-top:4px}
.seta{flex:none;width:52px;height:52px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--fg);font-size:22px}
.add{flex:1;height:52px;border:0;border-radius:26px;background:var(--accent);color:#fff;font-weight:600;font-size:16px}
.acoes button:active{transform:scale(.96)}
@media (max-width:359px){.acoes{width:288px}}
</style>
