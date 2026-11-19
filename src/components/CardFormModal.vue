<script setup>
// Formulário de cartão de TEXTO (criar/editar): título, frase, categoria, cores e fonte.
import { reactive } from 'vue'
import { FONTES } from '../composables/useCards'
const props = defineProps({ card: { type: Object, default: null } })
const emit = defineEmits(['save', 'close'])
const NOMES = ['Sans-serif', 'Serifada', 'Máquina de escrever', 'Manuscrita']
const f = reactive({
  texto: props.card?.texto ?? '', titulo: props.card?.titulo ?? '', categoria: props.card?.categoria ?? '',
  bg: props.card?.bg ?? '#6c5ce7', cor: props.card?.cor ?? '#ffffff', fonte: props.card?.fonte ?? FONTES[0]
})
function salvar() {
  const texto = f.texto.trim()
  if (!texto) return
  emit('save', { ...f, texto, titulo: f.titulo.trim(), categoria: f.categoria.trim() })
}
</script>

<template>
  <Transition name="modal" appear>
    <div class="modal" @click.self="emit('close')">
      <div class="sheet">
        <h2>{{ card ? 'Editar frase' : 'Nova frase' }}</h2>
        <input v-model="f.titulo" type="text" maxlength="60" placeholder="Título (opcional)">
        <textarea v-model="f.texto" rows="4" maxlength="500" placeholder="Digite sua frase..." />
        <input v-model="f.categoria" type="text" maxlength="40" placeholder="Gatilho ou categoria (opcional)">
        <div class="row">
          <label>Fundo</label><input v-model="f.bg" type="color">
          <label>Texto</label><input v-model="f.cor" type="color">
        </div>
        <select v-model="f.fonte">
          <option v-for="(fo, i) in FONTES" :key="fo" :value="fo">{{ NOMES[i] }}</option>
        </select>
        <div class="previa" :style="{ background: f.bg, color: f.cor, fontFamily: f.fonte }">{{ f.texto || 'Prévia' }}</div>
        <button class="btn" :disabled="!f.texto.trim()" @click="salvar">Salvar</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.row{display:flex;gap:10px;align-items:center;margin-bottom:12px}
.row input[type=color]{width:56px;height:44px;padding:2px;border:0;background:none;margin:0}
.previa{border-radius:14px;padding:18px;text-align:center;margin-bottom:14px;min-height:64px;overflow-wrap:anywhere}
</style>
