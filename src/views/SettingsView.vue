<script setup>
// Configurações: compartilhar (exportar/importar), restaurar padrão e gerenciar cartões.
import { ref } from 'vue'
import CardItem from '../components/CardItem.vue'
import CardFormModal from '../components/CardFormModal.vue'
import { useCards, padrao } from '../composables/useCards'
const { fila, exportar, lerBackup, aplicarBackup, restaurar, remover, salvarTexto } = useCards()
const temPadrao = padrao().length > 0
const importando = ref(null), editando = ref(null)

function aoExportar() { fila.value.length ? exportar() : alert('Você ainda não tem cartões para exportar.') }
async function aoEscolherArquivo(e) {
  const f = e.target.files?.[0]; e.target.value = ''
  if (!f) return
  try { importando.value = await lerBackup(f) } catch (err) { alert(err.message) }
}
function aplicar(substituir) {
  if (substituir && !confirm('Isso apaga os cartões que você tem agora. Continuar?')) return
  const n = aplicarBackup(importando.value, substituir)
  importando.value = null
  alert(n + (n === 1 ? ' cartão adicionado.' : ' cartões adicionados.'))
}
function aoRestaurar() {
  if (confirm(temPadrao ? 'Substituir todos os seus cartões pelos cartões padrão?' : 'Apagar todos os seus cartões?')) restaurar()
}
function salvarEdicao(dados) { salvarTexto(dados, editando.value.id); editando.value = null }
const rotulo = r => r.tipo === 'imagem' ? (r.origem ? 'Imagem da biblioteca' : 'Imagem importada') : r.texto
</script>

<template>
  <section>
    <div class="bloco">
      <h3>Compartilhar meus cartões</h3>
      <p class="sub">Exporte um arquivo e envie para outra pessoa. Ela importa aqui e recebe os seus cartões.</p>
      <div class="dupla">
        <button class="btn sec" @click="aoExportar">⬆️ Exportar</button>
        <label class="btn sec" for="json">⬇️ Importar</label>
      </div>
      <input id="json" class="sr" type="file" accept=".json,application/json" @change="aoEscolherArquivo">
    </div>
    <div class="bloco">
      <h3>{{ temPadrao ? 'Cartões padrão' : 'Recomeçar do zero' }}</h3>
      <p class="sub">{{ temPadrao ? 'Volta para os cartões padrão do site e apaga os que você tem agora.' : 'Apaga todos os seus cartões. Depois você escolhe de novo na Biblioteca.' }}</p>
      <button class="btn sec" style="margin-bottom:0" @click="aoRestaurar">{{ temPadrao ? '↺ Restaurar cartões padrão' : '🗑️ Apagar todos os cartões' }}</button>
    </div>

    <p class="sub">Edite ou exclua os seus cartões.</p>
    <p v-if="!fila.length" class="empty">Nada por aqui.</p>
    <TransitionGroup name="lista" tag="div" class="lista">
      <div v-for="r in fila" :key="r.id" class="linha">
        <CardItem :card="r" mini class="mini-thumb" />
        <span class="t">{{ rotulo(r) }}</span>
        <button v-if="r.tipo === 'texto' && !r.origem" aria-label="Editar" @click="editando = r">✏️</button>
        <button aria-label="Excluir" @click="remover(r.id)">🗑️</button>
      </div>
    </TransitionGroup>

    <Transition name="modal">
      <div v-if="importando" class="modal" @click.self="importando = null">
        <div class="sheet">
          <h2>Importar cartões</h2>
          <p class="sub">Encontrei {{ importando.length }} {{ importando.length === 1 ? 'cartão' : 'cartões' }} no arquivo.</p>
          <button class="btn" @click="aplicar(false)">Adicionar aos meus cartões</button>
          <button class="btn sec" @click="aplicar(true)">Substituir todos os meus cartões</button>
          <button class="btn sec" @click="importando = null">Cancelar</button>
        </div>
      </div>
    </Transition>
    <CardFormModal v-if="editando" :card="editando" @save="salvarEdicao" @close="editando = null" />
  </section>
</template>

<style scoped>
.bloco{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:14px;margin-bottom:18px}
.bloco h3{margin-bottom:4px;font-size:16px}
.bloco .sub{margin:0 0 12px;text-align:left}
.dupla{display:flex;gap:10px}
.dupla .btn{flex:1;width:auto;margin-bottom:0;padding:12px 6px;font-size:14px}
.linha{display:flex;gap:12px;align-items:center;padding:10px;background:var(--surface);border-radius:14px;margin-bottom:10px;border:1px solid var(--line)}
.mini-thumb{width:40px;flex:none;border-radius:8px;padding:0;font-size:0;border:0}
.t{flex:1;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.linha button{border:0;background:none;font-size:18px;padding:6px}
.lista-enter-active,.lista-leave-active,.lista-move{transition:all .25s ease}
.lista-enter-from,.lista-leave-to{opacity:0;transform:translateX(30px)}
.lista-leave-active{position:absolute;width:100%}
.lista{position:relative}
</style>
